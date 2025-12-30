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
exports.getConfigHistory = exports.setConfig = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const zod_1 = require("zod");
const db = admin.firestore();
/**
 * Sets an application config value and archives the previous version.
 */
exports.setConfig = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin || !context.auth?.token.perms?.includes("config:write")) {
        throw new functions.https.HttpsError("permission-denied", "Missing permission: config:write");
    }
    const schema = zod_1.z.object({
        id: zod_1.z.string(),
        env: zod_1.z.string(),
        value: zod_1.z.any(),
    });
    const { id, env, value } = schema.parse(data);
    const actorAdminId = context.auth.uid;
    const configRef = db.doc(`appConfig/${id}`);
    const historyCollectionRef = configRef.collection("history");
    let oldData = {};
    // Use a transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(configRef);
        if (doc.exists) {
            oldData = doc.data();
            const historyDocRef = historyCollectionRef.doc();
            transaction.set(historyDocRef, {
                ...oldData,
                archivedAt: admin.firestore.FieldValue.serverTimestamp(),
                archivedBy: actorAdminId,
            });
        }
        transaction.set(configRef, { env, value }, { merge: true });
    });
    // Log the change in the audit log
    await db.collection("auditLogs").add({
        actorAdminId,
        action: "setConfig",
        targetRef: `appConfig/${id}`,
        diff: { oldValue: oldData.value, newValue: value },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { ok: true };
});
/**
 * Retrieves the history for a specific config key.
 */
exports.getConfigHistory = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin || !context.auth?.token.perms?.includes("audit:read")) {
        throw new functions.https.HttpsError("permission-denied", "Missing permission: audit:read");
    }
    const schema = zod_1.z.object({ id: zod_1.z.string() });
    const { id } = schema.parse(data);
    const historySnap = await db.collection(`appConfig/${id}/history`)
        .orderBy("archivedAt", "desc")
        .limit(50)
        .get();
    return historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
//# sourceMappingURL=config.js.map