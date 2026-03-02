
import * as admin from 'firebase-admin';

let firestore: admin.firestore.Firestore;

/**
 * Initializes the central Firebase Admin SDK instance.
 * This should only be called once at the application's boot sequence.
 * It uses environment variables for configuration, ensuring all
 * satellite apps connect to the same central authority.
 */
export function initializeCentralFirestore(): void {
  if (admin.apps.length > 0) {
    // Avoid re-initializing
    firestore = admin.firestore();
    return;
  }

  // Expects GOOGLE_APPLICATION_CREDENTIALS env var to be set,
  // pointing to the service account key for the central urai-admin project.
  admin.initializeApp();

  firestore = admin.firestore();
  console.log('[Governance] Connected to central authority database.');
}

/**
 * Provides access to the central Firestore instance.
 * Throws an error if the SDK has not been initialized.
 * @returns The central Firestore instance.
 */
export function getCentralFirestore(): admin.firestore.Firestore {
  if (!firestore) {
    throw new Error(
      '[Governance] Central authority has not been initialized. Call initializeGovernance() first.'
    );
  }
  return firestore;
}
