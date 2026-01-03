"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminExportUserData = void 0;
const v1_1 = require("firebase-functions/v1");
const adminCreateAuditLog_1 = require("./adminCreateAuditLog");
exports.adminExportUserData = v1_1.https.onCall(async (data, context) => {
    // Check if the user is an admin or superadmin
    if (context.auth?.token.uraiRole !== 'admin' && context.auth?.token.uraiRole !== 'superadmin') {
        throw new v1_1.https.HttpsError('permission-denied', 'You must be an admin or superadmin to export user data.');
    }
    const { uid } = data;
    if (!uid) {
        throw new v1_1.https.HttpsError('invalid-argument', 'The function must be called with a "uid" argument.');
    }
    try {
        // In a real application, you would trigger a secure, asynchronous export process here.
        // For this example, we will just log the request.
        await (0, adminCreateAuditLog_1.adminCreateAuditLog)({ uid: context.auth.uid, email: context.auth.token.email }, 'exportUserData', { uid: uid, email: undefined }, // In a real app, you would look up the user's email
        { details: 'User data export was requested.' });
        return { success: true, message: 'User data export has been initiated.' };
    }
    catch (error) {
        console.error('Error exporting user data:', error);
        throw new v1_1.https.HttpsError('internal', 'An internal error occurred while exporting user data.');
    }
});
//# sourceMappingURL=adminExportUserData.js.map