"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCreateAuditLog = void 0;
const firebase_1 = require("./firebase");
const adminCreateAuditLog = async (actor, action, target, details) => {
    try {
        const logEntry = {
            timestamp: new Date(),
            actor: {
                uid: actor.uid,
                email: actor.email,
            },
            action: action,
            target: {
                uid: target.uid,
                email: target.email,
            },
            details: details,
        };
        await firebase_1.db.collection('auditLogs').add(logEntry);
    }
    catch (error) {
        console.error('Error creating audit log:', error);
        // We don't throw an error here because the primary action should not fail if logging fails
    }
};
exports.adminCreateAuditLog = adminCreateAuditLog;
//# sourceMappingURL=adminCreateAuditLog.js.map