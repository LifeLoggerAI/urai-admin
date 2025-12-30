import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onUserCreated } from "firebase-functions/v2/auth";
import * as admin from "firebase-admin";

/**
 * A helper function to require admin privileges and, optionally, a specific permission.
 * It checks the custom claims on the user's authentication token.
 */
export const requireAdmin = async (context: { auth?: { uid: string, token?: any } }, permission?: string) => {
    if (!context.auth) {
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const claims = context.auth.token;
    if (!claims || !claims.admin) {
        throw new HttpsError("permission-denied", "The function must be called by an admin.");
    }

    if (permission) {
        const perms = claims.perms as string[] | undefined;
        if (!perms || !perms.includes(permission)) {
            throw new HttpsError("permission-denied", `Missing permission: ${permission}`);
        }
    }
};

/**
 * Grants a user the 'admin' custom claim.
 * Requires the 'user:admin:write' permission.
 */
export const addAdmin = onCall(async (request) => {
  await requireAdmin(request, 'user:admin:write');
  const uid = request.data.uid;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});

/**
 * Bootstraps the first administrative user for the application.
 * When a new user is created, if their email matches the ADMIN_BOOTSTRAP_EMAIL environment variable
 * and no other admins exist in the `adminUsers` Firestore collection, that user is granted
 * 'superadmin' and 'admin' roles.
 */
export const onUserCreateBootstrap = onUserCreated(async (event) => {
  const user = event.data;
  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;

  if (bootstrapEmail && user.email === bootstrapEmail) {
    const adminUsersCollection = await admin.firestore().collection("adminUsers").limit(1).get();
    if (adminUsersCollection.empty) {
      const roles = { superadmin: true, admin: true };
      await admin.auth().setCustomUserClaims(user.uid, roles);
      await admin.firestore().collection("adminUsers").doc(user.uid).set({
        email: user.email,
        roles,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
});
