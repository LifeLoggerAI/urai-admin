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
exports.adminGetMyRoles = exports.adminDisableAdminUser = exports.adminUpsertAdminUser = exports.adminListAdmins = exports.adminDeleteUserData = exports.adminSetUserConsentTier = exports.adminEnableUser = exports.adminDisableUser = exports.adminGetUserSummary = exports.adminSearchUsers = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const authz_1 = require("./authz");
exports.adminSearchUsers = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { query, limit, cursor } = request.data;
    // This is a simplified search. For production, use a dedicated search service.
    const users = await admin.auth().listUsers(limit, cursor);
    const filteredUsers = users.users.filter(user => user.email?.includes(query));
    return { users: filteredUsers.map(user => ({ uid: user.uid, email: user.email, disabled: user.disabled })), nextPageToken: users.pageToken };
});
exports.adminGetUserSummary = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid } = request.data;
    const user = await admin.auth().getUser(uid);
    return { uid: user.uid, email: user.email, disabled: user.disabled, customClaims: user.customClaims, createdAt: user.metadata.creationTime, lastSignedInAt: user.metadata.lastSignInTime };
});
exports.adminDisableUser = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid, reason } = request.data;
    await admin.auth().updateUser(uid, { disabled: true });
    // Audit this action
    return { success: true };
});
exports.adminEnableUser = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid } = request.data;
    await admin.auth().updateUser(uid, { disabled: false });
    // Audit this action
    return { success: true };
});
exports.adminSetUserConsentTier = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid, tier } = request.data;
    await admin.auth().setCustomUserClaims(uid, { ...((await admin.auth().getUser(uid)).customClaims || {}), consentTier: tier });
    // Audit this action
    return { success: true };
});
exports.adminDeleteUserData = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid, dryRun, reason } = request.data;
    if (dryRun) {
        return { message: `Would delete user ${uid} and associated data.` };
    }
    // This is a dangerous operation and should have more robust handling in a real app.
    await admin.auth().deleteUser(uid);
    // You would also delete associated data from Firestore, Storage, etc.
    // Audit this action
    return { success: true };
});
exports.adminListAdmins = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const users = await admin.auth().listUsers();
    const admins = users.users.filter(user => user.customClaims?.admin);
    return { admins: admins.map(user => ({ uid: user.uid, email: user.email, roles: user.customClaims })) };
});
exports.adminUpsertAdminUser = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid, roles, enabled } = request.data;
    const user = await admin.auth().getUser(uid);
    await admin.auth().setCustomUserClaims(uid, roles);
    await admin.firestore().collection("adminUsers").doc(uid).set({
        email: user.email,
        roles,
        enabled,
        updatedAt: new Date(),
    }, { merge: true });
    return { success: true };
});
exports.adminDisableAdminUser = (0, https_1.onCall)(async (request) => {
    await (0, authz_1.requireAdmin)(request);
    const { uid } = request.data;
    await admin.firestore().collection("adminUsers").doc(uid).update({ enabled: false });
    return { success: true };
});
exports.adminGetMyRoles = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const user = await admin.auth().getUser(request.auth.uid);
    return { roles: user.customClaims };
});
//# sourceMappingURL=users.js.map