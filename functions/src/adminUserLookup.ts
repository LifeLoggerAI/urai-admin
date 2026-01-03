
import { logger } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { requireAdmin } from "./adminAuth";

export const adminUserLookup = requireAdmin(async (data: any, auth: any) => {
  const { uid, email } = data;

  if (!uid && !email) {
    throw new HttpsError("invalid-argument", 'Either "uid" or "email" must be provided.');
  }

  let user: admin.auth.UserRecord;
  try {
    if (uid) {
      user = await admin.auth().getUser(uid);
    } else {
      user = await admin.auth().getUserByEmail(email);
    }

    logger.info(`Admin lookup successful for ${uid || email}`, { 
        adminUid: auth.uid,
        targetUid: user.uid,
    });
    return { user };

  } catch (error: any) { // Specify the type of error as 'any'
    logger.error(`Error looking up user: ${uid || email}`, { error });
    if (error.code === "auth/user-not-found") {
      throw new HttpsError("not-found", "The requested user was not found.");
    }
    throw new HttpsError("internal", "An error occurred while looking up the user.");
  }
});
