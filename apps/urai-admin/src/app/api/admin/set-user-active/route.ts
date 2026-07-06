import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AdminAuthError, adminAuthErrorResponse, requireAdminMutationSession } from '@/lib/admin/require-admin-session';
import { auth, firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const setUserActiveSchema = z.object({
  uid: z.string().trim().min(1),
  isActive: z.boolean(),
});

type FirestoreDoc = {
  exists: boolean;
  data: () => Record<string, unknown> | undefined;
};

type FirestoreTransaction = {
  get: (ref: unknown) => Promise<FirestoreDoc>;
  set: (ref: unknown, data: unknown, options?: unknown) => void;
};

export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdminMutationSession(request, ['owner', 'admin']);
    const payload = setUserActiveSchema.parse(await request.json());

    if (payload.uid === actor.uid && payload.isActive === false) {
      throw new AdminAuthError('You cannot deactivate your own admin account', 400);
    }

    const userRef = firestore.collection('adminUsers').doc(payload.uid);
    const current = await userRef.get();
    const before = current.data();
    if (!current.exists) {
      throw new AdminAuthError('Admin user not found', 404);
    }

    const targetRole = before?.role;
    if (targetRole !== 'owner' && targetRole !== 'admin' && targetRole !== 'viewer') {
      throw new AdminAuthError('Target admin role is invalid', 409);
    }
    if (actor.role !== 'owner' && targetRole !== 'viewer') {
      throw new AdminAuthError('Only an owner can change another owner or admin account', 403);
    }

    const previousActive = before?.isActive === true;
    if (previousActive === payload.isActive) {
      return NextResponse.json({
        success: true,
        uid: payload.uid,
        isActive: payload.isActive,
        sessionsRevoked: false,
        changed: false,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const userRecord = await auth.getUser(payload.uid);
    const previousClaims = userRecord.customClaims ?? {};
    const { role: _previousRoleClaim, admin: _previousAdminClaim, ...otherClaims } = previousClaims;
    const nextClaims = payload.isActive
      ? { ...otherClaims, admin: true, role: targetRole }
      : { ...otherClaims, admin: false };

    await auth.setCustomUserClaims(payload.uid, nextClaims);
    await auth.revokeRefreshTokens(payload.uid);

    const now = new Date();
    const auditLogRef = firestore.collection('auditLogs').doc();
    try {
      await firestore.runTransaction(async (transaction: FirestoreTransaction) => {
        const latest = await transaction.get(userRef);
        if (!latest.exists) {
          throw new AdminAuthError('Admin user not found', 404);
        }
        const latestData = latest.data();
        if (latestData?.role !== targetRole || (latestData?.isActive === true) !== previousActive) {
          throw new AdminAuthError('Admin user changed during active-state update', 409);
        }

        transaction.set(userRef, {
          isActive: payload.isActive,
          updatedAt: now,
          updatedBy: actor.uid,
        }, { merge: true });

        transaction.set(auditLogRef, {
          actorUid: actor.uid,
          actorEmail: actor.email ?? null,
          actorRole: actor.role,
          action: payload.isActive ? 'adminUsers.activate' : 'adminUsers.deactivate',
          target: { type: 'adminUser', id: payload.uid },
          metadata: {
            before: { isActive: previousActive, role: targetRole },
            after: { isActive: payload.isActive, role: targetRole },
            sessionsRevoked: true,
          },
          createdAt: now,
        });
      });
    } catch (error) {
      await auth.setCustomUserClaims(payload.uid, previousClaims);
      await auth.revokeRefreshTokens(payload.uid);
      throw error;
    }

    return NextResponse.json({
      success: true,
      uid: payload.uid,
      isActive: payload.isActive,
      sessionsRevoked: true,
      changed: true,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin user active-state payload', issues: error.issues },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to update admin user active state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user active state' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
