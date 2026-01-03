
import { https } from 'firebase-functions/v1';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({
  credential: applicationDefault()
});

export const adminListUsers = https.onCall(async (data, context) => {
  // Check if the user is a superadmin or admin
  if (context.auth?.token.uraiRole !== 'superadmin' && context.auth?.token.uraiRole !== 'admin') {
    throw new https.HttpsError('permission-denied', 'You must be a superadmin or admin to list users.');
  }

  try {
    const listUsersResult = await getAuth().listUsers();
    const users = listUsersResult.users.map((userRecord) => {
      const { uid, email, customClaims } = userRecord;
      return { uid, email, customClaims };
    });
    return { users };
  } catch (error) {
    console.error(error);
    throw new https.HttpsError('internal', 'An unknown error occurred.');
  }
});
