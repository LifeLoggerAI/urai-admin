"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditEvent = void 0;
const firebase_admin_1 = require("firebase-admin");
const logAuditEvent = async (actorUid, actorEmail, action, target) => {
    try {
        await (0, firebase_admin_1.firestore)().collection('adminAuditLogs').add({
            at: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
            actorUid,
            actorEmail,
            action,
            target,
        });
    }
    catch (error) {
        console.error('Error logging audit event', error);
    }
};
exports.logAuditEvent = logAuditEvent;
//# sourceMappingURL=auditService.js.map