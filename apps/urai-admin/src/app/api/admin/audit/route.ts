import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function parseLimit(value: string | null) {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner', 'admin']);

    const { searchParams } = new URL(req.url);
    const limit = parseLimit(searchParams.get('limit'));
    const cursor = searchParams.get('cursor');

    let query = firestore.collection('auditLogs').orderBy('createdAt', 'desc').limit(limit + 1);

    if (cursor) {
      const cursorDoc = await firestore.collection('auditLogs').doc(cursor).get();

      if (!cursorDoc.exists) {
        return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 });
      }

      query = query.startAfter(cursorDoc);
    }

    const auditLogsSnapshot = await query.get();
    const docs = auditLogsSnapshot.docs;
    const pageDocs = docs.slice(0, limit);
    const hasMore = docs.length > limit;

    const logs = pageDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      logs,
      pageInfo: {
        limit,
        hasMore,
        nextCursor: hasMore ? pageDocs[pageDocs.length - 1]?.id ?? null : null,
      },
    });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
