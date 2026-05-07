import admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}
export var adminApp = admin.app();
export var adminDb = admin.firestore();
