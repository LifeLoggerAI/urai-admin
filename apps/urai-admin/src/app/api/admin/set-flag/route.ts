import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession(request, ['owner', 'admin']);
    const { flagId, enabled } = await request.json();

    if (!flagId || typeof flagId !== 'string' || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Flag ID and enabled status are required' },
        { status: 400 },
      );
    }

    const flagRef = firestore.collection('featureFlags').doc(flagId);
    const auditLogRef = firestore.collection('auditLogs').doc();

    await firestore.runTransaction(async (transaction) => {
      const current = await transaction.get(flagRef);
      const before = current.exists ? current.data() : null;

      transaction.set(flagRef, {
        ...(before ?? {}),
        enabled,
        updatedAt: new Date(),
        updatedBy: session.uid,
      }, { merge: true });

      transaction.set(auditLogRef, {
        actorUid: session.uid,
        actorEmail: session.email ?? null,
        actorRole: session.role,
        action: 'featureFlag.update',
        target: { type: 'featureFlag', id: flagId },
        metadata: { before: before?.enabled ?? null, after: enabled },
        createdAt: new Date(),
      });
    });

    return NextResponse.json({ success: true, flagId, enabled });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
