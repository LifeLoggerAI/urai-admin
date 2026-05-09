import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

type AuditTarget = {
  id: string;
  type: string;
};

export type AuditLogInput = {
  actorUid: string;
  actorEmail?: string | null;
  action: string;
  target: AuditTarget;
  metadata?: Record<string, unknown>;
  status?: 'success' | 'failure';
};

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!raw) {
    return undefined;
  }

  const parsed = JSON.parse(raw) as Record<string, string>;

  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }

  return parsed;
}

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const serviceAccount = parseServiceAccount();

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminApp = createAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

export async function writeAuditLog(input: AuditLogInput) {
  await adminDb.collection('auditLogs').add({
    actorUid: input.actorUid,
    actorEmail: input.actorEmail ?? null,
    action: input.action,
    target: input.target,
    metadata: input.metadata ?? {},
    status: input.status ?? 'success',
    createdAt: FieldValue.serverTimestamp(),
  });
}

export { FieldValue, Timestamp };
