
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK.
admin.initializeApp();

/**
 * Sets the `admin` custom claim on a user's account.
 *
 * This function is triggered by an HTTP request and requires the user to be authenticated.
 * The user's UID is passed in the request body, and the function sets the `admin` custom claim to `true`.
 */
export const setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // Check if the user is an admin.
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "The function must be called by an admin."
    );
  }

  // Get the user's UID from the request body.
  const { uid, admin } = data;

  // Set the `admin` custom claim on the user's account.
  await admin.auth().setCustomUserClaims(uid, { admin });

  // Log the action.
  console.log(`Set admin claim to ${admin} for user ${uid}`);

  // Return a success message.
  return { message: `Successfully set admin claim to ${admin} for user ${uid}` };
});
