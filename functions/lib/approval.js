"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewAction = exports.requestAction = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
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