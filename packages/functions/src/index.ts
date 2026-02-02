
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const db = admin.firestore();

/**
 * Checks if a user is an authorized admin.
 * @param {string} uid The user's ID.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
const isAdmin = async (uid: string): Promise<boolean> => {
  const adminUserDoc = await db.collection('adminUsers').doc(uid).get();
  return adminUserDoc.exists && adminUserDoc.data()?.isActive === true;
};

export const adminListAuthUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  if (!(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError('permission-denied', 'The caller does not have permission to execute the desired action.');
  }

  try {
    const userRecords = await admin.auth().listUsers();
    return userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email,
      createdAt: user.metadata.creationTime,
      lastSeen: user.metadata.lastSignInTime,
    }));
  } catch (error) {
    console.error('Error listing users:', error);
    throw new functions.https.HttpsError('internal', 'An internal error occurred while listing users.');
  }
});

export const bootstrapAdmin = functions.auth.user().onCreate(async (user) => {
  if (process.env.ALLOW_ADMIN_BOOTSTRAP === 'true') {
    const adminUsersCollection = db.collection('adminUsers');
    const snapshot = await adminUsersCollection.limit(1).get();
    if (snapshot.empty) {
      await adminUsersCollection.doc(user.uid).set({
        email: user.email,
        role: 'owner',
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Bootstrapped first admin user: ${user.email}`);
    }
  }
});
