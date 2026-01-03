/* eslint-disable no-console */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const { SUPERADMIN_EMAIL, SUPERADMIN_UID } = process.env;

if (!SUPERADMIN_EMAIL || !SUPERADMIN_UID) {
  console.error('Missing SUPERADMIN_EMAIL or SUPERADMIN_UID in .env.local');
  process.exit(1);
}

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(),
});

const auth = getAuth();
const db = getFirestore();

async function bootstrap() {
  try {
    console.log(`Bootstrapping superadmin: ${SUPERADMIN_EMAIL} (${SUPERADMIN_UID})`);

    // 1. Set Custom Claims
    await auth.setCustomUserClaims(SUPERADMIN_UID, { uraiRole: 'superadmin', uraiAdmin: true });
    console.log('✅ Custom claims set successfully.');

    // 2. Create adminUsers document
    const adminUserRef = db.collection('adminUsers').doc(SUPERADMIN_UID);
    await adminUserRef.set({
      uid: SUPERADMIN_UID,
      email: SUPERADMIN_EMAIL,
      displayName: 'Super Admin',
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    });
    console.log('✅ adminUsers document created successfully.');

    console.log('\n🎉 Bootstrap complete! Superadmin created.');
    console.log('You can now log in to the admin console.');
  } catch (error) {
    console.error('❌ Error during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
