import * as admin from "firebase-admin";
if (!admin.apps.length) {
    admin.initializeApp();
}
export var adminAuth = admin.auth();
export var adminDb = admin.firestore();
