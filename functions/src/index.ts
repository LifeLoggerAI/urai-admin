
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setRole = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated and is an admin
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can set user roles.'
    );
  }

  const { userId, role } = data;

  if (!userId || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a "userId" and "role" argument.'
    );
  }

  try {
    // Set the custom claim on the user
    await admin.auth().setCustomUserClaims(userId, { role });
    return { message: `Success! The user has been assigned the role of ${role}.` };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while setting the user role.'
    );
  }
});

export const getUsers = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated and is an admin
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can fetch user data.'
    );
  }

  try {
    const userRecords = await admin.auth().listUsers();
    return userRecords.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || 'user', // Default to 'user' if no role is set
    }));
  } catch (error) {
    console.error('Error listing users:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while fetching the user list.'
    );
  }
});

export * from './users';
export * from './config';
export * from './approval';
export * from './roles';
