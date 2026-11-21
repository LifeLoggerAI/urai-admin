/**
 * R1653 review-only founder delivery inbox projector.
 * Consumes existing institutionalMissionCoordination task/receipt snapshots.
 * Pure read-only transformation: no Firestore writes, scheduling, worker grants,
 * notification transport, secret access, external fetches, or release approval.
 *
 * A VERIFIED_POINTER is NOT a downloaded, content-hash-checked file and never
 * means the founder acknowledged receipt.
 */
import { createHash } from 'node:crypto';

const SHA40 = /^[a-f0-9]{40}$/;
const SHA64 = /^[a-f0-9]{64}$/;
const ID = /^[a-z][a-z0-9_-]{3,95}$/;
const STATES = new Set(['READY', 'CLAIMED', 'VERIFYING', 'ACCEPTED', 'BLOCKED']);
const OWN = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function validId(value) { return typeof value === 'string' && ID.test(value); }
function validHash(value, re) { return typeof value === 'string' && re.test(value); }
function evidencePointer(value) {
  if (typeof value !== 'string' || value.length > 2000) return false;
  // WHATWG URL normalizes encoded dot segments before pathname checks.
  // Reject dangerous raw spellings first, including backslashes and traversal.
  if (/%2f|%5c|%2e|%00/i.test(value) || value.includes('\\') ||
      /\/(?:\.{1,2})(?:\/|$)/.test(value)) return false;
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || u.port ||
        u.search || u.hash || u.pathname.includes('//') ||
        /%2f|%5c|%2e|%00/i.test(u.pathname) ||
        !['github.com', 'docs.google.com'].includes(u.hostname)) return false;
    if (u.hostname === 'github.com') {
      const p = u.pathname.split('/').filter(Boolean);
      return p.length >= 4 && p[0] !== 'settings' &&
        ['blob', 'commit', 'pull', 'issues'].includes(p[2]) &&
        p.every((segment) => /^[a-zA-Z0-9_.-]+$/.test(segment) && !['.', '..'].includes(segment));
    }
    const p = u.pathname.split('/').filter(Boolean);
    return p.length >= 3 && p[0] === 'document' && p[1] === 'd' &&
      /^[a-zA-Z0-9_-]+$/.test(p[2]) && (p.length === 3 || (p.length === 4 && p[3] === 'edit'));
  } catch { return false; }
}
function serial(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function projectMissionDelivery(task, execution, verification) {
  if (!object(task) || !validId(task.taskId) || !validHash(task.sourceRevision, SHA40) ||
      !STATES.has(task.state)) throw Error('DENY: invalid mission task');
  const base = {
    taskId: task.taskId, taskClass: task.taskClass ?? null,
    sourceRevision: task.sourceRevision, state: task.state,
    status: 'NOT_DELIVERED', evidenceUrl: null, sha256: null,
    reviewerId: null, founderAcknowledged: false, artifactBytesVerified: false,
  };
  // A blocked task must never become ready due to stale receipts.
  if (task.state === 'BLOCKED') return { ...base, status: 'BLOCKED' };
  if (!['VERIFYING', 'ACCEPTED'].includes(task.state)) return base;
  if (!object(execution) || execution.taskId !== task.taskId ||
      !validId(execution.workerId) || execution.workerId !== task.evidenceSubmittedBy ||
      !Number.isSafeInteger(execution.leaseEpoch) || execution.leaseEpoch < 1 ||
      !validHash(execution.sourceRevision, SHA40) ||
      execution.sourceRevision !== task.sourceRevision ||
      !validHash(execution.sha256, SHA64) || execution.sha256 !== task.evidenceDigest ||
      !evidencePointer(execution.evidenceUrl) ||
      execution.evidenceUrl !== task.evidenceUrl) {
    return { ...base, status: 'EVIDENCE_INVALID' };
  }
  const submitted = {
    ...base, evidenceUrl: execution.evidenceUrl, sha256: execution.sha256,
    status: 'PENDING_INDEPENDENT_REVIEW',
  };
  if (task.state === 'VERIFYING') return submitted;
  // The existing coordination module writes PASS/FAIL in a separate verification
  // receipt; task.state alone is untrusted, even if it reads ACCEPTED.
  if (!object(verification) || verification.taskId !== task.taskId ||
      verification.result !== 'PASS' ||
      !validId(verification.reviewerId) ||
      verification.reviewerId === execution.workerId ||
      verification.expectedRevision !== task.sourceRevision ||
      verification.expectedDigest !== execution.sha256 ||
      task.verifiedBy !== verification.reviewerId ||
      verification.externalCertification !== false) {
    return { ...submitted, status: 'VERIFICATION_INVALID' };
  }
  return { ...submitted, reviewerId: verification.reviewerId,
    status: 'VERIFIED_POINTER', artifactBytesVerified: false,
    founderAcknowledged: false };
}

export function buildFounderDeliveryInbox(records) {
  if (!Array.isArray(records) || records.length > 500) {
    throw Error('DENY: bounded array of task/receipt snapshots required');
  }
  const seen = new Set();
  const items = records.map((row) => {
    if (!object(row)) throw Error('DENY: invalid inbox row');
    const item = projectMissionDelivery(row.task, row.execution, row.verification);
    if (seen.has(item.taskId)) throw Error('DENY: duplicate task identifier');
    seen.add(item.taskId);
    return item;
  }).sort((a, b) => a.taskId.localeCompare(b.taskId));
  const projectionSha256 = serial(items);
  const counts = Object.fromEntries([...new Set(items.map((x) => x.status))]
    .sort().map((status) => [status, items.filter((x) => x.status === status).length]));
  return { schema: 'urai-founder-inbox-readonly-v1',
    releaseGate: 'HOLD_NO_GO', privateMemoryWrites: 'DISABLED',
    deliveryMode: 'MANUAL_READ_ONLY', automaticallyDispatches: false,
    founderAcknowledgementImplemented: false, projectionSha256,
    counts, items };
}
