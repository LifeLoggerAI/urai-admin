import { admin, auth, firestore, writeAuditLog } from './firebase/admin';

export const adminApp = admin.app();
export const adminDb = firestore;
export const db = firestore;

export { admin, auth, firestore, writeAuditLog };
