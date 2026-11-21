/**
 * R1660: authenticated, single-task metadata-only Founder Inbox adapter.
 * Does not query a collection, bypass read authorization, download files,
 * archive media, notify users, or record founder approval.
 *
 * Caller must inject the exact reviewed InstitutionalMissionCoordination store.
 * The store READ method rechecks both authorizer and revocation fence
 * transactionally, and reads task + execution + verification together.
 */
import { projectMissionDelivery } from './founder-delivery-inbox.mjs';
const ID=/^[a-z][a-z0-9_-]{3,95}$/;
export async function readAuthorizedFounderTask(store,actorId,taskId){
  if(!store || typeof store.readTaskWithReceipts!=='function' ||
     typeof actorId!=='string'||!ID.test(actorId)||
     typeof taskId!=='string'||!ID.test(taskId)){
    throw Error('DENY: authenticated mission store and exact identities required');
  }
  // Do NOT fall back to readTask(), collection-level gets, or unauthenticated
  // cached receipts. Denied authorizer/fence errors propagate to the caller.
  const row=await store.readTaskWithReceipts(actorId,taskId);
  if(!row||!row.task||row.task.taskId!==taskId)throw Error('DENY: missing or wrong task');
  const projection=projectMissionDelivery(row.task,row.execution,row.verification);
  return {
    schema:'urai-founder-authorized-task-pointer-v1',
    actorScoped:true,
    taskId,
    status:projection.status,
    state:projection.state,
    sourceRevision:projection.sourceRevision,
    evidenceUrl:projection.evidenceUrl,
    sha256:projection.sha256,
    reviewerId:projection.reviewerId,
    artifactBytesVerified:false,
    founderAcknowledged:false,
    automaticallyDispatches:false,
    releaseGate:'HOLD_NO_GO',
    privateMemoryWrites:'DISABLED',
  };
}
