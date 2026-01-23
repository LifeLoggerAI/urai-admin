import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();
export const health=functions.https.onRequest((_,res)=> { res.send('OK'); });
