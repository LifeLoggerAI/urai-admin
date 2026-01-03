"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeactivateUser = void 0;
const v1_1 = require("firebase-functions/v1");
const firebase_1 = require("./firebase");
exports.adminDeactivateUser = v1_1.https.onCall(async (data, context) => {
    // Check if the user is a superadmin
    if (context.auth?.token.uraiRole !== 'superadmin') {
        throw new v1_1.https.HttpsError('permission-denied', 'You must be a superadmin to deactivate users.');
    }
    const { uid } = data;
    if (!uid) {
        throw new v1_1.https.HttpsError('invalid-argument', 'The function must be called with a "uid" argument.');
    }
    try {
        // Deactivate the user in Firestore
        const userRef = firebase_1.db.collection('adminUsers').doc(uid);
        await userRef.update({ isActive: false, updatedAt: new Date() });
        return { success: true };
    }
    catch (error) {
        console.error('Error deactivating user:', error);
        throw new v1_1.https.HttpsError('internal', 'An internal error occurred while deactivating the user.');
    }
});
//# sourceMappingURL=adminDeactivateUser.js.map