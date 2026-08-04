import { randomUUID } from 'node:crypto';

import type { DocumentData, DocumentReference, Transaction } from 'firebase-admin/firestore';

import type { AdminRole, AdminSession } from '@/lib/admin/require-admin-session';
import { AdminAuthError } from '@/lib/admin/require-admin-session';
import { auth, firestore } from '@/lib/firebase/admin';

// writeAuditLog is intentionally not used here: the audit record must commit atomically with the canonical role mutation.
type RoleReservation = {
  previousRole: AdminRole;
  previousRoleVersion: number;
  previousIsActive: boolean;
  nextRoleVersion: number;
};

function isAdminRole(value: unknown): value is AdminRole {
  return value === 'owner' || value === 'admin' || value === 'viewer';
}

function readRoleVersion(value: unknown): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0;
}

export async function updateAdminRole(input: {
  actor: AdminSession;
  uid: string;
  role: AdminRole;
}) {
  const { actor, uid, role } = input;
  if (actor.uid === uid) {
    throw new AdminAuthError('Cannot change your own role', 400);
  }

  const mutationId = randomUUID();
  const userRef = firestore.collection('adminUsers').doc(uid) as DocumentReference<DocumentData>;

  const reservation = await firestore.runTransaction(async (transaction: Transaction): Promise<RoleReservation> => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) throw new AdminAuthError('Admin user not found', 404);

    const before = userDoc.data() ?? {};
    if (before.roleMutation?.id) throw new AdminAuthError('Admin role update already in progress', 409);
    if (!isAdminRole(before.role)) throw new AdminAuthError('Admin user has an invalid canonical role', 409);

    const previousRoleVersion = readRoleVersion(before.roleVersion);
    const nextRoleVersion = previousRoleVersion + 1;
    const previousIsActive = before.isActive === true;

    transaction.set(userRef, {
      isActive: false,
      roleMutation: { id: mutationId, status: 'pending', actorUid: actor.uid, previousRole: before.role, previousRoleVersion, requestedRole: role, nextRoleVersion, startedAt: new Date() },
      updatedAt: new Date(),
      updatedBy: actor.uid,
    }, { merge: true });

    return { previousRole: before.role, previousRoleVersion, previousIsActive, nextRoleVersion };
  });

  let previousClaims: Record<string, unknown> | null = null;
  let claimsMutationAttempted = false;

  try {
    const userRecord = await auth.getUser(uid);
    previousClaims = userRecord.customClaims ?? {};
    const nextClaims = { ...previousClaims, admin: true, role, roleVersion: reservation.nextRoleVersion };

    claimsMutationAttempted = true;
    await auth.setCustomUserClaims(uid, nextClaims);
    await auth.revokeRefreshTokens(uid);

    const auditRef = firestore.collection('auditLogs').doc(mutationId) as DocumentReference<DocumentData>;
    await firestore.runTransaction(async (transaction: Transaction) => {
      const currentDoc = await transaction.get(userRef);
      const current = currentDoc.data() ?? {};
      if (!currentDoc.exists || current.roleMutation?.id !== mutationId || current.isActive !== false) {
        throw new AdminAuthError('Admin user changed during role update', 409);
      }

      transaction.set(userRef, { role, roleVersion: reservation.nextRoleVersion, isActive: reservation.previousIsActive, roleMutation: null, updatedAt: new Date(), updatedBy: actor.uid }, { merge: true });
      transaction.set(auditRef, {
        actorUid: actor.uid,
        actorEmail: actor.email ?? 'unknown-admin@urai.local',
        action: 'adminUsers.role.update',
        target: { type: 'adminUser', id: uid },
        metadata: { mutationId, previousRole: reservation.previousRole, previousRoleVersion: reservation.previousRoleVersion, newRole: role, newRoleVersion: reservation.nextRoleVersion, sessionsRevoked: true },
        createdAt: new Date(),
      });
    });

    return { success: true as const, uid, role, roleVersion: reservation.nextRoleVersion, sessionsRevoked: true as const };
  } catch (error) {
    let authRestored = !claimsMutationAttempted;
    if (claimsMutationAttempted && previousClaims) {
      try {
        await auth.setCustomUserClaims(uid, previousClaims);
        await auth.revokeRefreshTokens(uid);
        authRestored = true;
      } catch (rollbackError) {
        console.error('Failed to restore Firebase Auth claims after admin role mutation failure', rollbackError);
      }
    }

    let firestoreRestored = false;
    try {
      const failureAuditRef = firestore.collection('auditLogs').doc(`${mutationId}-failed`) as DocumentReference<DocumentData>;
      await firestore.runTransaction(async (transaction: Transaction) => {
        const currentDoc = await transaction.get(userRef);
        const current = currentDoc.data() ?? {};
        if (!currentDoc.exists || current.roleMutation?.id !== mutationId) throw new Error('Admin role reservation changed before compensation');

        transaction.set(userRef, {
          role: reservation.previousRole,
          roleVersion: reservation.previousRoleVersion,
          isActive: authRestored ? reservation.previousIsActive : false,
          roleMutation: authRestored ? null : { ...current.roleMutation, status: 'rollback-required', failedAt: new Date() },
          updatedAt: new Date(),
          updatedBy: actor.uid,
        }, { merge: true });
        transaction.set(failureAuditRef, {
          actorUid: actor.uid,
          actorEmail: actor.email ?? 'unknown-admin@urai.local',
          action: 'adminUsers.role.update.failed',
          target: { type: 'adminUser', id: uid },
          metadata: { mutationId, previousRole: reservation.previousRole, requestedRole: role, authRestored, accountDisabled: !authRestored },
          createdAt: new Date(),
        });
      });
      firestoreRestored = true;
    } catch (rollbackError) {
      console.error('Failed to compensate Firestore after admin role mutation failure', rollbackError);
    }

    if (!authRestored || !firestoreRestored) {
      throw new AdminAuthError('Admin role update failed and compensation was incomplete; the account remains disabled pending recovery', 500);
    }

    throw error;
  }
}
