import { https } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { verifyIsAdmin } from '../helpers/verifyIsAdmin';

export const requeueDeadLetter = https.onCall(async (data, context) => {
  await verifyIsAdmin(context.auth?.uid);

  const { deadLetterId } = data;

  // Your logic to requeue the dead letter

  await firestore().collection('auditLogs').add({
    actorUid: context.auth?.uid,
    action: 'requeue-dead-letter',
    targetType: 'dead-letter',
    targetId: deadLetterId,
    ts: Date.now(),
  });

  return { success: true };
});
