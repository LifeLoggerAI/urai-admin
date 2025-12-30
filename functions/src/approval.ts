import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { z } from "zod";
import { requireAdmin } from "./authz";

const db = admin.firestore();

/**
 * Creates a pending action that requires approval.
 */
export const requestAction = onCall(async (request) => {
  await requireAdmin(request);

  const schema = z.object({
    action: z.string(),
    target: z.any(),
    reason: z.string(),
  });
  const { action, target, reason } = schema.parse(request.data);
  const requesterId = request.auth?.uid;

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
export const reviewAction = onCall(async (request) => {
  await requireAdmin(request);

  const schema = z.object({
    id: z.string(),
    approved: z.boolean(),
  });
  const { id, approved } = schema.parse(request.data);
  const reviewerId = request.auth?.uid;

  const actionRef = db.doc(`pendingActions/${id}`);
  const actionDoc = await actionRef.get();

  if (!actionDoc.exists) {
    throw new HttpsError("not-found", "Action not found");
  }

  const actionData = actionDoc.data() as any;

  if (actionData.requesterId === reviewerId) {
    throw new HttpsError("permission-denied", "You cannot approve your own request.");
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
