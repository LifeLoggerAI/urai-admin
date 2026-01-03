
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

async function seedDatabase() {
  console.log('Seeding database...');

  // Create adminUsers collection
  const adminUsersRef = db.collection('adminUsers');
  await adminUsersRef.doc('superadmin').set({
    uid: 'superadmin',
    email: 'superadmin@example.com',
    displayName: 'Super Admin',
    role: 'superadmin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  });

  // Create auditLogs collection
  const auditLogsRef = db.collection('auditLogs');
  await auditLogsRef.add({
    actorUid: 'system',
    action: 'initialize',
    targetType: 'database',
    targetId: 'all',
    before: {},
    after: { status: 'seeded' },
    createdAt: new Date(),
    ip: '127.0.0.1',
    userAgent: 'system'
  });

  // Create featureFlags collection
  const featureFlagsRef = db.collection('featureFlags');
  await featureFlagsRef.doc('new-dashboard').set({
    key: 'new-dashboard',
    enabled: true,
    value: 'v2',
    updatedAt: new Date(),
    updatedBy: 'system'
  });

  console.log('Database seeded successfully!');
}

seedDatabase().catch(console.error);
