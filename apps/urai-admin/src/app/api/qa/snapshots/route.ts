import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { listGuardedQaSnapshotTags } from '@/lib/qa/guarded-snapshot-list.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner']);

    const homeDir = process.env.HOME;

    if (!homeDir) {
      return NextResponse.json({ error: 'Deploy artifact directory is not configured' }, { status: 500 });
    }

    const tags = await listGuardedQaSnapshotTags(homeDir);
    return NextResponse.json(tags, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to read QA snapshots:', error);
    return NextResponse.json({ error: 'Failed to read snapshot directory' }, { status: 500 });
  }
}
