import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { z } from "zod";

const db = admin.firestore();

/**
 * Creates a pending action that requires approval.
 */
export const requestAction = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("unauthenticated", "Admin only");
    }

    const schema = z.object({
        action: z.string(),
        target: z.any(),
        reason: z.string(),
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
export const reviewAction = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError("unauthenticated", "Admin only");
    }

    const schema = z.object({
        id: z.string(),
        approved: z.boolean(),
    });
    const { id, approved } = schema.parse(data);
    const reviewerId = context.auth.uid;

    const actionRef = db.doc(`pendingActions/${id}`);
    const actionDoc = await actionRef.get();

    if (!actionDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Action not found");
    }

    const actionData = actionDoc.data() as any;

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
