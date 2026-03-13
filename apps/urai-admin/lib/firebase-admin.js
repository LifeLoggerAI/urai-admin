import admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp();
}
export var db = admin.firestore();
