
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp();
  }
}

const firestore = getFirestore();
const auth = admin.auth();

interface AuditLog {
  actorUid: string;
  actorEmail: string;
  action: string;
  target: { id: string; type: string };
  metadata?: Record<string, any>;
}

export const writeAuditLog = async (log: AuditLog) => {
  try {
    await firestore.collection('auditLogs').add({
      ...log,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to write audit log', error);
  }
};

export { admin, firestore, auth };
