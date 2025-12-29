import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { z } from "zod";

const db = admin.firestore();

/**
 * Assigns a role and permissions to a user.
 */
export const setUserRole = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin || !context.auth?.token.perms?.includes("users:write")) {
        throw new functions.https.HttpsError("permission-denied", "Missing permission: users:write");
    }

    const schema = z.object({
        uid: z.string(),
        role: z.string(),
    });
    const { uid, role } = schema.parse(data);

    const roleDoc = await db.doc(`roles/${role}`).get();
    if (!roleDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Role not found");
    }

    const perms = roleDoc.data()?.permissions || [];
    await admin.auth().setCustomUserClaims(uid, { role, perms, admin: true });

    return { ok: true };
});

/**
 * Disables or enables a user account.
 */
export const setUserDisabled = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin || !context.auth?.token.perms?.includes("users:write")) {
        throw new functions.https.HttpsError("permission-denied", "Missing permission: users:write");
    }

    const schema = z.object({
        uid: z.string(),
        disabled: z.boolean(),
    });
    const { uid, disabled } = schema.parse(data);

    await admin.auth().updateUser(uid, { disabled });

    return { ok: true };
});
