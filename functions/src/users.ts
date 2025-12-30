import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { requireAdmin } from "./authz";


export const adminSearchUsers = onCall(async (request) => {
  await requireAdmin(request);
  const { query, limit, cursor } = request.data;

  // This is a simplified search. For production, use a dedicated search service.
  const users = await admin.auth().listUsers(limit, cursor);
  const filteredUsers = users.users.filter(user => user.email?.includes(query));

  return { users: filteredUsers.map(user => ({ uid: user.uid, email: user.email, disabled: user.disabled })), nextPageToken: users.pageToken };
});

export const adminGetUserSummary = onCall(async (request) => {
  await requireAdmin(request);
  const { uid } = request.data;
  const user = await admin.auth().getUser(uid);
  return { uid: user.uid, email: user.email, disabled: user.disabled, customClaims: user.customClaims, createdAt: user.metadata.creationTime, lastSignedInAt: user.metadata.lastSignInTime };
});

export const adminDisableUser = onCall(async (request) => {
  await requireAdmin(request);
  const { uid, reason } = request.data;
  await admin.auth().updateUser(uid, { disabled: true });
  // Audit this action
  return { success: true };
});

export const adminEnableUser = onCall(async (request) => {
  await requireAdmin(request);
  const { uid } = request.data;
  await admin.auth().updateUser(uid, { disabled: false });
  // Audit this action
  return { success: true };
});

export const adminSetUserConsentTier = onCall(async (request) => {
  await requireAdmin(request);
  const { uid, tier } = request.data;
  await admin.auth().setCustomUserClaims(uid, { ...((await admin.auth().getUser(uid)).customClaims || {}), consentTier: tier });
  // Audit this action
  return { success: true };
});

export const adminDeleteUserData = onCall(async (request) => {
  await requireAdmin(request);
  const { uid, dryRun, reason } = request.data;

  if (dryRun) {
    return { message: `Would delete user ${uid} and associated data.` };
  }

  // This is a dangerous operation and should have more robust handling in a real app.
  await admin.auth().deleteUser(uid);
  // You would also delete associated data from Firestore, Storage, etc.
  // Audit this action
  return { success: true };
});

export const adminListAdmins = onCall(async (request) => {
  await requireAdmin(request);
  const users = await admin.auth().listUsers();
  const admins = users.users.filter(user => user.customClaims?.admin);
  return { admins: admins.map(user => ({ uid: user.uid, email: user.email, roles: user.customClaims })) };
});

export const adminUpsertAdminUser = onCall(async (request) => {
  await requireAdmin(request);
  const { uid, roles, enabled } = request.data;
  const user = await admin.auth().getUser(uid);
  await admin.auth().setCustomUserClaims(uid, roles);
  await admin.firestore().collection("adminUsers").doc(uid).set({
    email: user.email,
    roles,
    enabled,
    updatedAt: new Date(),
  }, { merge: true });
  return { success: true };
});

export const adminDisableAdminUser = onCall(async (request) => {
  await requireAdmin(request);
  const { uid } = request.data;
  await admin.firestore().collection("adminUsers").doc(uid).update({ enabled: false });
  return { success: true };
});

export const adminGetMyRoles = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const user = await admin.auth().getUser(request.auth.uid);
  return { roles: user.customClaims };
});
