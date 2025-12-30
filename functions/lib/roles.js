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
exports.setRolePermissions = exports.getRoles = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
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