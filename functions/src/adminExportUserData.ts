
import { logger } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { requireAdmin } from "./adminAuth";

export const adminExportUserData = requireAdmin(async (data: any, auth: any) => {
  const { uid } = data;

  if (!uid) {
    throw new HttpsError("invalid-argument", 'The "uid" must be provided.');
  }

  try {
    // This is a placeholder for a real data export.
    // In a real application, you would query your databases (Firestore, etc.)
    // and return a comprehensive JSON object of the user's data.
    const user = await admin.auth().getUser(uid);
    logger.info(`Successfully exported data for user ${uid}`, {
        adminUid: auth.uid,
        targetUid: uid,
    });
    return { user }; 

  } catch (error) {
    logger.error(`Error exporting data for user ${uid}`, { error });
    throw new HttpsError("internal", "An error occurred while exporting user data.");
  }
});
