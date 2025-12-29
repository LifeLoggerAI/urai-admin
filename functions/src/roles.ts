import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { z } from "zod";

const db = admin.firestore();

/**
 * Retrieves all roles and their permissions.
 */
export const getRoles = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin only");
    }

    const rolesSnap = await db.collection("roles").get();
    return rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

/**
 * Updates the permissions for a specific role.
 * This is a high-risk action and should require two-person approval.
 */
export const setRolePermissions = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin only");
    }

    const schema = z.object({
        roleId: z.string(),
        permissions: z.array(z.string()),
    });
    const { roleId, permissions } = schema.parse(data);

    const roleRef = db.doc(`roles/${roleId}`);
    await roleRef.set({ permissions }, { merge: true });

    // In a real app, we'd trigger the two-person approval flow here
    // For now, we'll just log the action
    const actorAdminId = context.auth.uid;
    await db.collection("auditLogs").add({
        actorAdminId,
        action: "setRolePermissions",
        targetRef: `roles/${roleId}`,
        diff: { newPermissions: permissions },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { ok: true };
});
