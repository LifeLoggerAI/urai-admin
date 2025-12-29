"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewAction = exports.requestAction = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const zod_1 = require("zod");
const db = admin.firestore();
/**
 * Creates a pending action that requires approval.
 */
exports.requestAction = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("unauthenticated", "Admin only");
    }
    const schema = zod_1.z.object({
        action: zod_1.z.string(),
        target: zod_1.z.any(),
        reason: zod_1.z.string(),
    });
    const { action, target, reason } = schema.parse(data);
    const requesterId = context.auth.uid;
    await db.collection("pendingActions").add({
        action,
        target,
        reason,
        requesterId,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { ok: true };
});
/**
 * Approves or rejects a pending action.
 */
exports.reviewAction = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("unauthenticated", "Admin only");
    }
    const schema = zod_1.z.object({
        id: zod_1.z.string(),
        approved: zod_1.z.boolean(),
    });
    const { id, approved } = schema.parse(data);
    const reviewerId = context.auth.uid;
    const actionRef = db.doc(`pendingActions/${id}`);
    const actionDoc = await actionRef.get();
    if (!actionDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Action not found");
    }
    const actionData = actionDoc.data();
    if (actionData.requesterId === reviewerId) {
        throw new functions.https.HttpsError("permission-denied", "You cannot approve your own request.");
    }
    if (approved) {
        // Execute the action here based on actionData.action and actionData.target
        // For example, if action is 'banUser', call the banUser function
    }
    await actionRef.update({
        status: approved ? "approved" : "rejected",
        reviewerId,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { ok: true };
});
//# sourceMappingURL=approval.js.map