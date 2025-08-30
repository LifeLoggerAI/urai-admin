import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

function assertAdmin(ctx: functions.https.CallableContext) {
  if (!ctx.auth || ctx.auth.token.admin !== true) {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }
}

export const grantProTier = functions.https.onCall(async (data, ctx) => {
  assertAdmin(ctx);
  const { userId, expiresAt } = data;
  await db.collection("billingOverrides").doc(userId).set({ userId, pro: true, expiresAt: expiresAt ?? null }, { merge: true });
  return { ok: true };
});

export const reviewFlaggedContent = functions.https.onCall(async (data, ctx) => {
  assertAdmin(ctx);
  const { itemId, status } = data; // status: approved|rejected
  await db.collection("moderationQueue").doc(itemId).set({ status, reviewedAt: admin.firestore.FieldValue.serverTimestamp(), reviewedBy: ctx.auth?.uid }, { merge: true });
  return { ok: true };
});

export const setFeatureFlag = functions.https.onCall(async (data, ctx) => {
  assertAdmin(ctx);
  const { flagId, enabled, targets, notes } = data;
  await db.collection("featureFlags").doc(flagId).set({ enabled, targets: targets ?? [], notes: notes ?? "" }, { merge: true });
  return { ok: true };
});