import * as admin from 'firebase-admin';

const CENTRAL_PROJECT_ID = 'urai-4dc1d';
const CENTRAL_APP_NAME = 'urai-admin-governance';

let centralFirestoreInstance: admin.firestore.Firestore;

/**
 * Initializes the connection to the central urai-admin Firestore database
 * using approved Application Default Credentials while pinning the central
 * project independently from any satellite runtime's default Firebase app.
 */
export function initializeCentralDatabase() {
  if (centralFirestoreInstance) {
    console.warn('Central database already initialized.');
    return;
  }

  let centralApp: admin.app.App;
  try {
    centralApp = admin.app(CENTRAL_APP_NAME);
  } catch {
    centralApp = admin.initializeApp(
      {
        credential: admin.credential.applicationDefault(),
        projectId: CENTRAL_PROJECT_ID,
      },
      CENTRAL_APP_NAME
    );
  }

  centralFirestoreInstance = centralApp.firestore();
  console.log('Connection to central governance database established.');
}

/**
 * Returns the singleton instance of the central Firestore database.
 * Throws an error if the database has not been initialized.
 */
export function getCentralFirestoreInstance(): admin.firestore.Firestore {
  if (!centralFirestoreInstance) {
    throw new Error(
      'Central database not initialized. Call initializeCentralDatabase() first.'
    );
  }
  return centralFirestoreInstance;
}
