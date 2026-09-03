import { randomUUID } from 'node:crypto';
import type { DocumentData, DocumentReference, Transaction } from 'firebase-admin/firestore';

import type { AdminRole, AdminSession } from '@/lib/admin/require-admin-session';
import { AdminAuthError } from '@/lib/admin/require-admin-session';
import { auth, firestore } from '@/lib/firebase/admin';

function isAdminRole(value: unknown): value is AdminRole {
  return value === 'owner' || value === 'admin' || value === 'viewer';
}

function mutationMillis(value: unknown): number {
  if (value && typeof (value as { toMillis?: unknown }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  const millis = new Date(value as string | number | Date).getTime();
  return Number.isFinite(millis) ? millis : 0;
}

export async function recoverAdminMutation(input: {
  actor: AdminSession;
  uid: string;
  mutationId: string;
}) {
  const { actor, uid, mutationId } = input;
  if (actor.role !== 'owner') throw new AdminAuthError('Only an owner can recover admin mutations', 403);
  if (actor.uid === uid) throw new AdminAuthError('Cannot recover your own admin mutation through this route', 400);

  const userRef = firestore.collection('adminUsers').doc(uid) as DocumentReference<DocumentData>;
  const recoveryToken = randomUUID();

  const recovery = await firestore.runTransaction(async (transaction: Transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) throw new AdminAuthError('Admin user not found', 404);

    const current = snapshot.data() ?? {};
    const roleMutation = current.roleMutation?.id ? current.roleMutation : null;
    const activeMutation = current.activeMutation?.id ? current.activeMutation : null;
    if (roleMutation && activeMutation) {
      throw new AdminAuthError('Admin user has conflicting mutation reservations; manual security review required', 409);
    }

    const marker = roleMutation ?? activeMutation;
    if (!marker) throw new AdminAuthError('Admin user has no recoverable mutation reservation', 409);
    if (marker.id !== mutationId) throw new AdminAuthError('Mutation recovery identifier does not match', 409);
    // Never race or reclaim a live/stalled mutation worker. Recovery is allowed
    // only after the original mutation has completed its compensated failure path
    // and marked the reservation rollback-required. An existing recovery claim is
    // deliberately terminal for automation and requires manual security review.
    if (marker.recoveryToken) {
      throw new AdminAuthError('Admin mutation recovery is already in progress; manual security review required', 409);
    }
    if (marker.status !== 'rollback-required') {
      throw new AdminAuthError('Only a completed rollback-required mutation can be recovered', 409);
    }

    const desiredRole = roleMutation ? roleMutation.previousRole : current.role;
    const desiredActive = roleMutation ? roleMutation.previousIsActive : activeMutation.previousActive;
    const desiredRoleVersion = roleMutation ? roleMutation.previousRoleVersion : current.roleVersion;
    if (!isAdminRole(desiredRole) || typeof desiredActive !== 'boolean') {
      throw new AdminAuthError('Mutation reservation lacks a safe canonical recovery state', 409);
    }

    const claimedMarker = {
      ...marker,
      recoveryToken,
      recoveryBy: actor.uid,
      recoveryStartedAt: new Date(),
    };
    transaction.set(userRef, roleMutation
      ? { roleMutation: claimedMarker, updatedAt: new Date() }
      : { activeMutation: claimedMarker, updatedAt: new Date() }, { merge: true });

    return {
      desiredRole,
      desiredActive,
      desiredRoleVersion,
      mutationType: roleMutation ? 'role' as const : 'active' as const,
      previousStatus: marker.status ?? 'pending',
    };
  });

  // Fence stale recovery workers immediately before touching Auth. A reclaimed
  // reservation must never be allowed to apply its obsolete recovery state.
  const ownershipSnapshot = await userRef.get();
  const ownershipState = ownershipSnapshot.data() ?? {};
  const ownershipMarker = recovery.mutationType === 'role'
    ? ownershipState.roleMutation
    : ownershipState.activeMutation;
  if (
    !ownershipSnapshot.exists ||
    ownershipMarker?.id !== mutationId ||
    ownershipMarker?.recoveryToken !== recoveryToken
  ) {
    throw new AdminAuthError('Admin mutation recovery lost its reservation before Auth reconciliation', 409);
  }

  const userRecord = await auth.getUser(uid);
  const previousClaims = userRecord.customClaims ?? {};
  await auth.setCustomUserClaims(uid, {
    ...previousClaims,
    admin: recovery.desiredActive,
    role: recovery.desiredRole,
    ...(Number.isInteger(recovery.desiredRoleVersion) ? { roleVersion: recovery.desiredRoleVersion } : {}),
  });
  await auth.revokeRefreshTokens(uid);

  const recoveredAt = new Date();
  const auditRef = firestore.collection('auditLogs').doc(`${mutationId}-recovered`) as DocumentReference<DocumentData>;
  try {
    await firestore.runTransaction(async (transaction: Transaction) => {
      const freshDoc = await transaction.get(userRef);
      const fresh = freshDoc.data() ?? {};
      const freshMarker = recovery.mutationType === 'role' ? fresh.roleMutation : fresh.activeMutation;
      if (!freshDoc.exists || freshMarker?.id !== mutationId || freshMarker?.recoveryToken !== recoveryToken) {
        throw new AdminAuthError('Admin mutation recovery lost its reservation', 409);
      }

      transaction.set(userRef, {
        role: recovery.desiredRole,
        ...(Number.isInteger(recovery.desiredRoleVersion) ? { roleVersion: recovery.desiredRoleVersion } : {}),
        isActive: recovery.desiredActive,
        roleMutation: null,
        activeMutation: null,
        updatedAt: recoveredAt,
        updatedBy: actor.uid,
      }, { merge: true });
      transaction.set(auditRef, {
        actorUid: actor.uid,
        actorEmail: actor.email ?? 'unknown-admin@urai.local',
        action: 'adminUsers.mutation.recover',
        target: { type: 'adminUser', id: uid },
        metadata: {
          mutationId,
          mutationType: recovery.mutationType,
          previousStatus: recovery.previousStatus,
          restoredRole: recovery.desiredRole,
          restoredActive: recovery.desiredActive,
          sessionsRevoked: true,
        },
        createdAt: recoveredAt,
      });
    });
  } catch (error) {
    // If another worker reclaimed this lease while Auth was being updated,
    // restore Auth from the newest canonical Firestore state before returning.
    const canonicalSnapshot = await userRef.get();
    const canonical = canonicalSnapshot.data() ?? {};
    const currentMarker = recovery.mutationType === 'role'
      ? canonical.roleMutation
      : canonical.activeMutation;
    const lostOwnership = !canonicalSnapshot.exists ||
      currentMarker?.id !== mutationId ||
      currentMarker?.recoveryToken !== recoveryToken;

    if (lostOwnership && canonicalSnapshot.exists && isAdminRole(canonical.role)) {
      const currentUser = await auth.getUser(uid);
      await auth.setCustomUserClaims(uid, {
        ...(currentUser.customClaims ?? {}),
        admin: canonical.isActive === true,
        role: canonical.role,
        ...(Number.isInteger(canonical.roleVersion) ? { roleVersion: canonical.roleVersion } : {}),
      });
      await auth.revokeRefreshTokens(uid);
    }
    throw error;
  }

  return {
    success: true as const,
    uid,
    mutationId,
    role: recovery.desiredRole,
    isActive: recovery.desiredActive,
    sessionsRevoked: true as const,
  };
}
