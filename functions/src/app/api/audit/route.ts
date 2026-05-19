import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { writeAuditLog } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

type AuditPayload = {
  action?: unknown;
  target?: unknown;
  metadata?: unknown;
};

function isAuditTarget(value: unknown): value is { id: string; type: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    typeof value.id === 'string' &&
    typeof value.type === 'string'
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdminSession(req, ['owner', 'admin']);
    const { action, target, metadata } = (await req.json()) as AuditPayload;

    if (typeof action !== 'string' || !isAuditTarget(target)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    await writeAuditLog({
      actorUid: session.uid,
      actorEmail: session.email ?? 'unknown-admin@urai.local',
      action,
      target,
      metadata: typeof metadata === 'object' && metadata !== null ? metadata as Record<string, unknown> : {},
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Error writing audit log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
