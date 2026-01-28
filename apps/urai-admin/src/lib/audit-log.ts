
import admin from './firebase-admin';

export const createAuditLog = async (actorUid: string, actorEmail: string, action: string, targetType: string, targetId: string, meta: any = {}) => {
  const auditLogsRef = admin.firestore().collection('auditLogs');
  await auditLogsRef.add({
    ts: admin.firestore.FieldValue.serverTimestamp(),
    actorUid,
    actorEmail,
    action,
    targetType,
    targetId,
    meta,
  });
};
