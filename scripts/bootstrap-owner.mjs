#!/usr/bin/env node

import process from 'node:process';
import admin from 'firebase-admin';

const placeholderValues = new Set([
  '<Firebase Auth UID>',
  'PASTE_REAL_UID_HERE',
  'THE_REAL_FIREBASE_AUTH_UID',
]);

let uid = process.env.URAI_ADMIN_OWNER_UID;
const email = process.env.URAI_ADMIN_OWNER_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'urai-4dc1d';

if (!email) {
  console.error('Missing required env var: URAI_ADMIN_OWNER_EMAIL');
  process.exit(1);
}

if (uid && placeholderValues.has(uid)) {
  console.error('URAI_ADMIN_OWNER_UID is still a placeholder. Set the real Firebase Auth UID or omit it to resolve by email.');
  process.exit(1);
}

if (projectId !== 'urai-4dc1d') {
  console.error(`Refusing to bootstrap non-production project: ${projectId}`);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}

const firestore = admin.firestore();
const auth = admin.auth();
const now = admin.firestore.FieldValue.serverTimestamp();

if (!uid) {
  try {
    const ownerUser = await auth.getUserByEmail(email);
    uid = ownerUser.uid;
    console.log(`Resolved URAI Admin owner UID for ${email}`);
  } catch (error) {
    if (error?.code === 'auth/user-not-found') {
      console.error(`No Firebase Auth user exists for ${email}. Sign in to URAI Admin once with this email, then rerun bootstrap:owner.`);
      process.exit(1);
    }
    throw error;
  }
}

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

console.log(`Bootstrapped URAI Admin owner ${email} (${uid}) in ${projectId} using Application Default Credentials.`);
