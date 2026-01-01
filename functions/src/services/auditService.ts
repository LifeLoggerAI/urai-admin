import { firestore } from 'firebase-admin';
import { db } from '../app';

interface AuditLog {
  at: firestore.Timestamp;
  actorUid: string;
  actorEmail: string;
  action: string;
  target: {
    type: string;
    id: string;
  };
  correlationId?: string;
  requestId?: string;
  meta?: any;
}

export const auditService = {
  async log(log: Omit<AuditLog, 'at'>): Promise<void> {
    await db.collection('adminAuditLogs').add({
      ...log,
      at: firestore.Timestamp.now(),
    });
  },
};
