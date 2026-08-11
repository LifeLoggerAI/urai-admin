import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const shouldStubFirebaseAdmin =
  process.env.URAI_ADMIN_BUILD_STUB_FIREBASE === '1' || process.env.NEXT_PHASE === 'phase-production-build';

function createEmptySnapshot() {
  return {
    size: 0,
    docs: [],
    empty: true,
  };
}

function createEmptyDocument(id = 'build-stub') {
  return {
    id,
    exists: false,
    data: () => undefined,
  };
}

function createBuildFirestoreStub(): any {
  const query: any = {
    limit: () => query,
    orderBy: () => query,
    where: () => query,
    startAfter: () => query,
    get: async () => createEmptySnapshot(),
    add: async () => createEmptyDocument(),
    doc: (id?: string) => ({
      ...createEmptyDocument(id),
      get: async () => createEmptyDocument(id),
      set: async () => undefined,
      update: async () => undefined,
      delete: async () => undefined,
      collection: () => query,
    }),
  };

  return {
    collection: () => query,
    batch: () => ({
      set: () => undefined,
      update: () => undefined,
      delete: () => undefined,
      commit: async () => undefined,
    }),
  };
}

function createBuildAuthStub(): any {
  return {
    verifySessionCookie: async () => {
      throw Object.assign(new Error('Admin auth is unavailable during build'), { status: 401 });
    },
    verifyIdToken: async () => {
      throw Object.assign(new Error('Admin auth is unavailable during build'), { status: 401 });
    },
    setCustomUserClaims: async () => undefined,
    getUser: async () => ({ uid: 'build-stub', email: null }),
  };
}

if (!shouldStubFirebaseAdmin && !admin.apps.length) {
  admin.initializeApp();
}

const firestore = shouldStubFirebaseAdmin ? createBuildFirestoreStub() : getFirestore();
const auth = shouldStubFirebaseAdmin ? createBuildAuthStub() : admin.auth();

interface AuditLog {
  actorUid: string;
  actorEmail: string;
  action: string;
  target: { id: string; type: string };
  metadata?: Record<string, any>;
}

export const writeAuditLog = async (log: AuditLog) => {
  if (shouldStubFirebaseAdmin) {
    return;
  }

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
