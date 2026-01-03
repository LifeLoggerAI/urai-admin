import { admin } from "../firebase";

class AuditService {
    private db = admin.firestore();

    async log(action: string, meta: any, actor?: { uid: string, email: string }) {
        const logEntry = {
            at: new Date(),
            action,
            meta,
            actor: actor || null,
        };
        await this.db.collection('adminAuditLogs').add(logEntry);
    }
}

export const auditService = new AuditService();
