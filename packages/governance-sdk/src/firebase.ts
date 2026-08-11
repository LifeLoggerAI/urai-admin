import * as admin from 'firebase-admin';

let centralFirestoreInstance: admin.firestore.Firestore;

/**
 * Initializes the connection to the central urai-admin Firestore database
 * using the runtime's approved Application Default Credentials.
 */
export function initializeCentralDatabase() {
  if (centralFirestoreInstance) {
    console.warn('Central database already initialized.');
    return;
  }

  if (!admin.apps.length) {
    admin.initializeApp();
  }

  centralFirestoreInstance = admin.firestore();
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
