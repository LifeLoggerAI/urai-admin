"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRolePermissions = exports.getRoles = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const zod_1 = require("zod");
const db = admin.firestore();
/**
 * Retrieves all roles and their permissions.
 */
exports.getRoles = functions.https.onCall(async (data, context) => {
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
exports.setRolePermissions = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin only");
    }
    const schema = zod_1.z.object({
        roleId: zod_1.z.string(),
        permissions: zod_1.z.array(zod_1.z.string()),
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
//# sourceMappingURL=roles.js.map