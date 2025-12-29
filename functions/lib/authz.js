"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAdmin = exports.requireAdmin = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// A helper function to require admin privileges
const requireAdmin = async (context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const user = await admin.auth().getUser(context.auth.uid);
    if (!user.customClaims || !user.customClaims.admin) {
        throw new functions.https.HttpsError("permission-denied", "The function must be called by an admin.");
    }
};
exports.requireAdmin = requireAdmin;
// A function to set a user as an admin
exports.addAdmin = functions.https.onCall(async (data, context) => {
    await (0, exports.requireAdmin)(context);
    const uid = data.uid;
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { success: true };
});
//# sourceMappingURL=authz.js.map