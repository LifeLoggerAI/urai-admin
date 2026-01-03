"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListUsers = void 0;
const v1_1 = require("firebase-functions/v1");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
(0, app_1.initializeApp)({
    credential: (0, app_1.applicationDefault)()
});
exports.adminListUsers = v1_1.https.onCall(async (data, context) => {
    // Check if the user is a superadmin or admin
    if (context.auth?.token.uraiRole !== 'superadmin' && context.auth?.token.uraiRole !== 'admin') {
        throw new v1_1.https.HttpsError('permission-denied', 'You must be a superadmin or admin to list users.');
    }
    try {
        const listUsersResult = await (0, auth_1.getAuth)().listUsers();
        const users = listUsersResult.users.map((userRecord) => {
            const { uid, email, customClaims } = userRecord;
            return { uid, email, customClaims };
        });
        return { users };
    }
    catch (error) {
        console.error(error);
        throw new v1_1.https.HttpsError('internal', 'An unknown error occurred.');
    }
});
//# sourceMappingURL=adminListUsers.js.map