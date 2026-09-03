import { randomUUID } from 'node:crypto';

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
  data: () => Record<string, any> | undefined;
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

    const mutationId = randomUUID();
    const userRef = firestore.collection('adminUsers').doc(payload.uid);
    const reservation = await firestore.runTransaction(async (transaction: FirestoreTransaction) => {
      const currentDoc = await transaction.get(userRef);
      if (!currentDoc.exists) throw new AdminAuthError('Admin user not found', 404);

      const before = currentDoc.data();
      const targetRole = targetRoleFrom(before);
      const previousActive = before?.isActive === true;
      if (before?.roleMutation?.id) {
        throw new AdminAuthError('Admin role update already in progress', 409);
      }
      if (before?.activeMutation?.id) {
        throw new AdminAuthError('Admin active-state update already in progress', 409);
      }
      if (actor.role !== 'owner' && (targetRole === 'owner' || targetRole === 'admin')) {
        throw new AdminAuthError('Only an owner can change another owner or admin account', 403);
      }

      transaction.set(userRef, {
        activeMutation: {
          id: mutationId,
          status: 'pending',
          actorUid: actor.uid,
          previousActive,
          requestedActive: payload.isActive,
          startedAt: new Date(),
        },
        updatedAt: new Date(),
        updatedBy: actor.uid,
      }, { merge: true });
      return { targetRole, previousActive };
    });

    const userRecord = await auth.getUser(payload.uid);
    const previousClaims = userRecord.customClaims ?? {};
    const nextClaims = {
      ...previousClaims,
      admin: payload.isActive,
      role: reservation.targetRole,
    };

    let claimsMutationAttempted = false;
    try {
      claimsMutationAttempted = true;
      await auth.setCustomUserClaims(payload.uid, nextClaims);
      await auth.revokeRefreshTokens(payload.uid);

      const now = new Date();
      const auditLogRef = firestore.collection('auditLogs').doc(mutationId);
      await firestore.runTransaction(async (transaction: FirestoreTransaction) => {
        const currentDoc = await transaction.get(userRef);
        const current = currentDoc.data();
        if (
          !currentDoc.exists ||
          current?.activeMutation?.id !== mutationId ||
          current?.roleMutation?.id ||
          targetRoleFrom(current) !== reservation.targetRole ||
          (current?.isActive === true) !== reservation.previousActive
        ) {
          throw new AdminAuthError('Admin user changed during active-state update', 409);
        }

        transaction.set(userRef, {
          isActive: payload.isActive,
          activeMutation: null,
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
            mutationId,
            previousRole: reservation.targetRole,
            previousActive: reservation.previousActive,
            nextActive: payload.isActive,
            sessionsRevoked: true,
          },
          createdAt: now,
        });
      });
    } catch (error) {
      let claimsRestored = !claimsMutationAttempted;
      if (claimsMutationAttempted) {
        try {
          await auth.setCustomUserClaims(payload.uid, previousClaims);
          await auth.revokeRefreshTokens(payload.uid);
          claimsRestored = true;
        } catch (rollbackError) {
          console.error('Failed to restore admin claims after active-state update failure:', rollbackError);
        }
      }

      try {
        await firestore.runTransaction(async (transaction: FirestoreTransaction) => {
          const currentDoc = await transaction.get(userRef);
          const current = currentDoc.data();
          if (!currentDoc.exists || current?.activeMutation?.id !== mutationId) return;
          transaction.set(userRef, {
            activeMutation: claimsRestored
              ? null
              : { ...current.activeMutation, status: 'rollback-required', failedAt: new Date() },
            updatedAt: new Date(),
            updatedBy: actor.uid,
          }, { merge: true });
        });
      } catch (rollbackError) {
        console.error('Failed to clear active-state reservation after mutation failure:', rollbackError);
        throw new AdminAuthError('Admin active-state update failed and compensation was incomplete', 500);
      }

      if (!claimsRestored) {
        throw new AdminAuthError('Admin active-state update failed and claim rollback is required', 500);
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

    if (error instanceof AdminAuthError) return adminAuthErrorResponse(error);

    console.error('Failed to update admin user active state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user active state' },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
