import type { AdminRole, AdminSession } from '@/lib/admin/require-admin-session';
import { AdminAuthError } from '@/lib/admin/require-admin-session';
import { auth, firestore, writeAuditLog } from '@/lib/firebase/admin';

export async function updateAdminRole(input: {
  actor: AdminSession;
  uid: string;
  role: AdminRole;
}) {
  const { actor, uid, role } = input;
  if (actor.uid === uid) {
    throw new AdminAuthError('Cannot change your own role', 400);
  }

  const userRef = firestore.collection('adminUsers').doc(uid);
  const userDoc = await userRef.get();
  const before = userDoc.data();
  if (!userDoc.exists) {
    throw new AdminAuthError('Admin user not found', 404);
  }

  const userRecord = await auth.getUser(uid);
  const previousClaims = userRecord.customClaims ?? {};
  const nextClaims = { ...previousClaims, admin: true, role };

  await auth.setCustomUserClaims(uid, nextClaims);
  await auth.revokeRefreshTokens(uid);

  try {
    await userRef.set({
      role,
      updatedAt: new Date(),
      updatedBy: actor.uid,
    }, { merge: true });
  } catch (error) {
    await auth.setCustomUserClaims(uid, previousClaims);
    await auth.revokeRefreshTokens(uid);
    throw error;
  }

  await writeAuditLog({
    actorUid: actor.uid,
    actorEmail: actor.email ?? 'unknown-admin@urai.local',
    action: 'adminUsers.role.update',
    target: { type: 'adminUser', id: uid },
    metadata: {
      previousRole: before?.role ?? null,
      newRole: role,
      sessionsRevoked: true,
    },
  });

  return {
    success: true as const,
    uid,
    role,
    sessionsRevoked: true as const,
  };
}
