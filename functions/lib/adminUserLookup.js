"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserLookup = void 0;
const v1_1 = require("firebase-functions/v1");
const firebase_1 = require("./firebase");
const adminCreateAuditLog_1 = require("./adminCreateAuditLog");
exports.adminUserLookup = v1_1.https.onCall(async (data, context) => {
    // Check if the user is an admin or superadmin
    if (context.auth?.token.uraiRole !== 'admin' && context.auth?.token.uraiRole !== 'superadmin') {
        throw new v1_1.https.HttpsError('permission-denied', 'You must be an admin or superadmin to look up users.');
    }
    const { uid } = data;
    if (!uid) {
        throw new v1_1.https.HttpsError('invalid-argument', 'The function must be called with a "uid" argument.');
    }
    try {
        // Get user data from Auth and Firestore
        const authUser = await firebase_1.auth.getUser(uid);
        const firestoreUser = await firebase_1.db.collection('adminUsers').doc(uid).get();
        // Log the lookup
        await (0, adminCreateAuditLog_1.adminCreateAuditLog)({ uid: context.auth.uid, email: context.auth.token.email }, 'userLookup', { uid: uid, email: authUser.email }, { details: 'User data was retrieved.' });
        return {
            auth: authUser.toJSON(),
            firestore: firestoreUser.data(),
        };
    }
    catch (error) {
        console.error('Error looking up user:', error);
        throw new v1_1.https.HttpsError('internal', 'An internal error occurred while looking up the user.');
    }
});
//# sourceMappingURL=adminUserLookup.js.map