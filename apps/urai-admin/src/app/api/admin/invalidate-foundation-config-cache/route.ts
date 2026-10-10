import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { AdminAuthError, adminAuthErrorResponse, requireAdminMutationSession } from '@/lib/admin/require-admin-session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const actor = await requireAdminMutationSession(req, ['owner', 'admin']);
    const configRef = firestore.doc('foundationConfig/config');
    const actorRef = firestore.collection('adminUsers').doc(actor.uid);
    const auditRef = firestore.collection('auditLogs').doc();
    const timestamp = new Date();

    await firestore.runTransaction(async (transaction) => {
      const actorSnapshot = await transaction.get(actorRef);
      const canonical = actorSnapshot.data();
      if (!actorSnapshot.exists || canonical?.isActive !== true || canonical.role !== actor.role) {
        throw new AdminAuthError('Forbidden', 403);
      }
      transaction.update(configRef, { cacheInvalidatedAt: timestamp });
      transaction.create(auditRef, {
        actorUid: actor.uid,
        actorEmail: actor.email ?? null,
        actorRole: actor.role,
        action: 'invalidateFoundationConfigCache',
        target: { type: 'foundationConfig', id: 'config' },
        metadata: {},
        createdAt: timestamp,
      });
    });

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof AdminAuthError) return adminAuthErrorResponse(error);
    console.error('Foundation cache invalidation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
