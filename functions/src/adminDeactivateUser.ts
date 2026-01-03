
import { logger } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { requireAdmin } from "./adminAuth";

export const adminDeactivateUser = requireAdmin(async (data: any, auth: any) => {
  const { uid } = data;

  if (!uid) {
    throw new HttpsError("invalid-argument", 'The "uid" must be provided.');
  }

  try {
    await admin.auth().updateUser(uid, { disabled: true });
    logger.info(`Successfully deactivated user ${uid}`, { 
        adminUid: auth.uid,
        targetUid: uid,
    });
    return { success: true };
  } catch (error) {
    logger.error(`Error deactivating user ${uid}`, { error });
    throw new HttpsError("internal", "An error occurred while deactivating the user.");
  }
});
