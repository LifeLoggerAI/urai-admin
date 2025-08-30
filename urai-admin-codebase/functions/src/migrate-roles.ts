
import * as admin from 'firebase-admin';
admin.initializeApp();
async function run(){
  const db = admin.firestore();
  const admins = await db.collection('adminUsers').get();
  for (const doc of admins.docs) {
    const { email, roles } = doc.data();
    if (!email) continue;
    try {
      const u = await admin.auth().getUserByEmail(email);
      const current = u.customClaims || {};
      await admin.auth().setCustomUserClaims(u.uid, { ...current, admin: true, roles: roles || ['admin'] });
      console.log('updated', email);
    } catch (e) { console.error('skip', email, e); }
  }
}
run();
