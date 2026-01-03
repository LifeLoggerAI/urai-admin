"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const firebase_1 = require("../firebase");
class AuditService {
    constructor() {
        this.db = firebase_1.admin.firestore();
    }
    async log(action, meta, actor) {
        const logEntry = {
            at: new Date(),
            action,
            meta,
            actor: actor || null,
        };
        await this.db.collection('adminAuditLogs').add(logEntry);
    }
}
exports.auditService = new AuditService();
//# sourceMappingURL=auditService.js.map