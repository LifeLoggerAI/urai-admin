import { https } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { verifyIsAdmin } from '../helpers/verifyIsAdmin';

export const setFeatureFlag = https.onCall(async (data, context) => {
  await verifyIsAdmin(context.auth?.uid);

  const { key, value } = data;

  await firestore().collection('featureFlags').doc(key).set({ value });

  await firestore().collection('auditLogs').add({
    actorUid: context.auth?.uid,
    action: 'set-feature-flag',
    targetType: 'feature-flag',
    targetId: key,
    diff: { value },
    ts: Date.now(),
  });

  return { success: true };
});
