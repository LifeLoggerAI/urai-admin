import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

async function seedAdmin(email: string, uid: string) {
  await auth.setCustomUserClaims(uid, { role: 'OWNER' });
  await firestore.collection('adminUsers').doc(uid).set({
    email,
    uid,
    isActive: true,
    role: 'OWNER',
  });
}

const [email, uid] = process.argv.slice(2);

if (!email || !uid) {
  console.error('Usage: ts-node scripts/seed_admin.ts <email> <uid>');
  process.exit(1);
}

seedAdmin(email, uid)
  .then(() => console.log('Admin seeded successfully'))
  .catch((err) => console.error('Error seeding admin:', err));
