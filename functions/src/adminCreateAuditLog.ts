import { db } from './firebase';

export const adminCreateAuditLog = async (actor: { uid: string; email: string | undefined; }, action: string, target: { uid: string; email: string | undefined; }, details: any) => {
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

    await db.collection('auditLogs').add(logEntry);
  } catch (error) {
    console.error('Error creating audit log:', error);
    // We don't throw an error here because the primary action should not fail if logging fails
  }
};
