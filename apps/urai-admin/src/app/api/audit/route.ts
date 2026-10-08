import { NextRequest, NextResponse } from 'next/server';

import { AdminAuthError, adminAuthErrorResponse, requireAdminMutationSession } from '@/lib/admin/require-admin-session';
import { sanitizeAuditMetadata } from '@/lib/admin/safe-audit-data';
import { writeRequiredAuditLog } from '@/lib/firebase/admin';

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
    !Array.isArray(value) &&
    'id' in value &&
    'type' in value &&
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    value.id.trim().length > 0 && value.type.trim().length > 0
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdminMutationSession(req, ['owner', 'admin']);
    const payload: unknown = await req.json();
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const { action, target, metadata } = payload as AuditPayload;

    if (typeof action !== 'string' || action.trim().length === 0 || !isAuditTarget(target)
      || (metadata !== undefined && (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata)))) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    await writeRequiredAuditLog({
      actorUid: session.uid,
      actorEmail: session.email ?? 'unknown-admin@urai.local',
      action,
      target: { id: target.id, type: target.type },
      metadata: sanitizeAuditMetadata((metadata ?? {}) as Record<string, unknown>),
    });

    return NextResponse.json({ success: true }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    console.error('Required Admin audit persistence failed');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
