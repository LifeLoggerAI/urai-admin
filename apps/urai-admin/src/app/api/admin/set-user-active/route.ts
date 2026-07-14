import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  AdminAuthError,
  adminAuthErrorResponse,
  requireAdminMutationSession,
  type AdminRole,
} from '@/lib/admin/require-admin-session';
import { auth, firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store' } as const;
const adminRoleSchema = z.enum(['owner', 'admin', 'viewer']);
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

function targetRoleFrom(data: Record<string, unknown> | undefined): AdminRole {
  const parsed = adminRoleSchema.safeParse(data?.role);
  if (!parsed.success) {
    throw new AdminAuthError('Admin user role is invalid', 409);
  }
  return parsed.data;
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdminMutationSession(request, ['owner', 'admin']);
    const payload = setUserActiveSchema.parse(await request.json());

    if (payload.uid === actor.uid && payload.isActive === false) {
      throw new AdminAuthError('You cannot deactivate your own admin account', 400);
    }

    const userRef = firestore.collection('adminUsers').doc(payload.uid);
    const initialDoc = await userRef.get();
    if (!initialDoc.exists) {
      throw new AdminAuthError('Admin user not found', 404);
    }

    const before = initialDoc.data();
    const targetRole = targetRoleFrom(before);
    const previousActive = before?.isActive === true;

    if (actor.role !== 'owner' && (targetRole === 'owner' || targetRole === 'admin')) {
      throw new AdminAuthError('Only an owner can change another owner or admin account', 403);
    }

    const userRecord = await auth.getUser(payload.uid);
    const previousClaims = userRecord.customClaims ?? {};
    const nextClaims = {
      ...previousClaims,
      admin: payload.isActive,
      role: targetRole,
    };

    let claimsChanged = false;
    try {
      await auth.setCustomUserClaims(payload.uid, nextClaims);
      claimsChanged = true;
      await auth.revokeRefreshTokens(payload.uid);

      const now = new Date();
      const auditLogRef = firestore.collection('auditLogs').doc();

      await firestore.runTransaction(async (transaction: FirestoreTransaction) => {
        const currentDoc = await transaction.get(userRef);
        if (!currentDoc.exists) {
          throw new AdminAuthError('Admin user not found', 404);
        }

        const current = currentDoc.data();
        const currentRole = targetRoleFrom(current);
        const currentActive = current?.isActive === true;
        if (currentRole !== targetRole || currentActive !== previousActive) {
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
            previousRole: targetRole,
            previousActive,
            nextActive: payload.isActive,
            sessionsRevoked: true,
          },
          createdAt: now,
        });
      });
    } catch (error) {
      if (claimsChanged) {
        try {
          await auth.setCustomUserClaims(payload.uid, previousClaims);
          await auth.revokeRefreshTokens(payload.uid);
        } catch (rollbackError) {
          console.error('Failed to restore admin claims after active-state update failure:', rollbackError);
          throw new AdminAuthError('Admin active-state update failed and claim rollback failed', 500);
        }
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      uid: payload.uid,
      isActive: payload.isActive,
      sessionsRevoked: true,
    }, { headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin user active-state payload', issues: error.issues },
        { status: 400, headers: noStoreHeaders },
      );
    }

    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to update admin user active state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user active state' },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
