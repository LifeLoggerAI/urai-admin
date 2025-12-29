import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// A helper function to require admin privileges
export const requireAdmin = async (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const user = await admin.auth().getUser(context.auth.uid);
  if (!user.customClaims || !user.customClaims.admin) {
    throw new functions.https.HttpsError("permission-denied", "The function must be called by an admin.");
  }
};

// A function to set a user as an admin
export const addAdmin = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
  const uid = data.uid;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});
