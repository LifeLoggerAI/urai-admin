import { db } from '@/lib/firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const getOrCreateUser = async (user: DecodedIdToken) => {
  const userRef = db.collection('users').doc(user.uid);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({ lastLoginAt: new Date() });
    return userDoc.data();
  }

  const superAdmins = process.env.URAI_SUPERADMINS?.split(',') || [];
  const role = superAdmins.includes(user.uid) ? 'admin' : 'viewer';

  const newUser = {
    email: user.email,
    displayName: user.name,
    role,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  await userRef.set(newUser);
  return newUser;
};
