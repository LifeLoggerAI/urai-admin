import * as functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '../app';

export const setCustomClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated.');
  }
  const superAdminRole = context.auth.token.roles.superAdmin === true;
  if(!superAdminRole) {
    throw new functions.https.HttpsError('permission-denied', 'You must be a super admin to perform this action.');
  }

  const { uid, roles } = data;
  try {
    await getAuth(adminApp).setCustomUserClaims(uid, { roles });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'An error occurred while setting custom claims.', error);
  }
});