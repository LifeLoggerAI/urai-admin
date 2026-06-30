import { https } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { verifyIsAdmin } from '../helpers/verifyIsAdmin';

export const retryJob = https.onCall(async (data, context) => {
  await verifyIsAdmin(context.auth?.uid);

  const { jobId } = data;

  // Your logic to retry the job

  await firestore().collection('auditLogs').add({
    actorUid: context.auth?.uid,
    action: 'retry-job',
    targetType: 'job',
    targetId: jobId,
    ts: Date.now(),
  });

  return { success: true };
});
