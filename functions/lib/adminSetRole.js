"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSetRole = void 0;
const v1_1 = require("firebase-functions/v1");
const firebase_1 = require("./firebase");
exports.adminSetRole = v1_1.https.onCall(async (data, context) => {
    // Check if the user is a superadmin
    if (context.auth?.token.uraiRole !== 'superadmin') {
        throw new v1_1.https.HttpsError('permission-denied', 'You must be a superadmin to set roles.');
    }
    const { uid, role } = data;
    if (!uid || !role) {
        throw new v1_1.https.HttpsError('invalid-argument', 'The function must be called with a "uid" and "role" argument.');
    }
    try {
        // Set custom claims
        await firebase_1.auth.setCustomUserClaims(uid, { uraiRole: role, uraiAdmin: true });
        // Update the user's role in Firestore
        const userRef = firebase_1.db.collection('adminUsers').doc(uid);
        await userRef.update({ role: role, updatedAt: new Date() });
        return { success: true };
    }
    catch (error) {
        console.error('Error setting custom claims and updating user role:', error);
        throw new v1_1.https.HttpsError('internal', 'An internal error occurred while setting the user role.');
    }
});
//# sourceMappingURL=adminSetRole.js.map