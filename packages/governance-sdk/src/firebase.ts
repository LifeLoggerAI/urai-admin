import * as admin from 'firebase-admin';

let centralFirestoreInstance: admin.firestore.Firestore;

/**
 * Initializes the connection to the central urai-admin Firestore database.
 * This must be called once by the satellite service at boot time.
 * @param serviceAccount The service account key with permissions to access the central Firestore.
 */
export function initializeCentralDatabase(serviceAccount: admin.ServiceAccount) {
  if (centralFirestoreInstance) {
    console.warn('Central database already initialized.');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  centralFirestoreInstance = admin.firestore();
  console.log('✅ Connection to central governance database established.');
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
