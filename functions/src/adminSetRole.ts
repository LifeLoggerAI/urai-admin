
import { logger } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { requireAdmin } from "./adminAuth";

export const adminSetRole = requireAdmin(async (data: any, auth: any) => {
  const { uid, role } = data;

  if (!uid || !role) {
    throw new HttpsError("invalid-argument", 'The "uid" and "role" must be provided.');
  }

  if (role !== "admin" && role !== "user") {
    throw new HttpsError("invalid-argument", 'The "role" must be either "admin" or "user".');
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { [role]: true });
    logger.info(`Successfully set role for ${uid} to ${role}`, { 
        adminUid: auth.uid,
        targetUid: uid,
        role: role,
    });
    return { success: true };
  } catch (error) {
    logger.error(`Error setting role for ${uid}`, { error });
    throw new HttpsError("internal", "An error occurred while setting the user role.");
  }
});
