#!/usr/bin/env node

import process from 'node:process';
import admin from 'firebase-admin';

const uid = process.env.URAI_ADMIN_OWNER_UID;
const email = process.env.URAI_ADMIN_OWNER_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'urai-4dc1d';

if (!uid || !email) {
  console.error('Missing required env vars: URAI_ADMIN_OWNER_UID and URAI_ADMIN_OWNER_EMAIL');
  process.exit(1);
}

if (projectId !== 'urai-4dc1d') {
  console.error(`Refusing to bootstrap non-production project: ${projectId}`);
  process.exit(1);
}

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      projectId,
    });
  } else {
    admin.initializeApp({ projectId });
  }
}

const firestore = admin.firestore();
const auth = admin.auth();
const now = admin.firestore.FieldValue.serverTimestamp();

await auth.setCustomUserClaims(uid, {
  admin: true,
  role: 'owner',
});

await firestore.collection('adminUsers').doc(uid).set(
  {
    email,
    role: 'owner',
    isActive: true,
    createdAt: now,
    updatedAt: now,
    bootstrappedBy: 'scripts/bootstrap-owner.mjs',
  },
  { merge: true },
);

await firestore.collection('auditLogs').add({
  actorUid: uid,
  actorEmail: email,
  actorRole: 'owner',
  action: 'admin.owner.bootstrap',
  target: { type: 'adminUser', id: uid },
  metadata: { script: 'scripts/bootstrap-owner.mjs' },
  createdAt: now,
});

console.log(`Bootstrapped URAI Admin owner ${email} (${uid}) in ${projectId}`);
