/**
 * R1436 REVIEW-ONLY extension of the existing URAI institutional control plane.
 *
 * Firestore is the intended shared transactional store, NOT the R1433 SQLite
 * pilot; this module does not create a service, scheduler or public endpoint.
 * The caller MUST supply a deployed, independently reviewed Admin RBAC/IAM
 * authorizer. Without that adapter every operation is DENIED.
 *
 * Metadata-only operations: no storage writer, GPU provisioning, customer
 * memories, production deploys, billing authorizations or release approval.
 * Google Cloud Function server time is used for lease comparisons; Firestore
 * serverTimestamp() is also recorded. Independent staging clock-skew and
 * multi-machine tests are REQUIRED before treating expiry as authoritative.
 */
import { createHash } from 'node:crypto';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';

export const MISSION_COLLECTIONS = Object.freeze({
  tasks: 'institutionalMissionTasks',
  workers: 'institutionalMissionWorkers',
});

export const MISSION_TASK_CLASSES = [
  'SOURCE_AUDIT', 'VISUAL_EVIDENCE_REVIEW', 'SECURITY_REVIEW', 'RESEARCH_REVIEW',
] as const;
export type MissionTaskClass = (typeof MISSION_TASK_CLASSES)[number];
export type MissionAction = 'REGISTER' | 'CREATE' | 'CLAIM' | 'HEARTBEAT'
  | 'SUBMIT_EVIDENCE' | 'VERIFY' | 'READ';
export type MissionState = 'READY' | 'CLAIMED' | 'VERIFYING' | 'ACCEPTED' | 'BLOCKED';

export type AdminAuthorizer = (input: {
  actorId: string;
  action: MissionAction;
  taskId?: string;
}) => Promise<boolean>;

function identity(value: string, label: string): string {
  if (typeof value !== 'string' || !/^[a-z][a-z0-9_-]{3,95}$/.test(value)) {
    throw new Error('invalid ' + label);
  }
  return value;
}

function revision(value: string): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/.test(value)) {
    throw new Error('exact 40-character Git revision required');
  }
  return value;
}

function digest(value: string): string {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) {
    throw new Error('SHA-256 digest required');
  }
  return value;
}

function evidenceUrl(value: string): string {
  if (typeof value !== 'string' || value.length > 2000) throw new Error('invalid evidence URL');
  const url = new URL(value);
  // Never accept arbitrary destinations, URL-embedded credentials, or query strings.
  if (url.protocol !== 'https:' || url.username || url.password || url.search ||
      !['github.com', 'docs.google.com'].includes(url.hostname)) {
    throw new Error('evidence URL must be an approved metadata-only origin');
  }
  return value;
}

function asTaskClass(value: string): MissionTaskClass {
  if (!(MISSION_TASK_CLASSES as readonly string[]).includes(value)) {
    throw new Error('unapproved or billable task class');
  }
  return value as MissionTaskClass;
}

function backendNow(): number {
  const value = Date.now();
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error('server clock invalid');
  return value;
}

function leaseDuration(value: number): number {
  if (!Number.isInteger(value) || value < 10 || value > 300) {
    throw new Error('lease duration must be bounded between 10 and 300 seconds');
  }
  return value;
}

export interface MissionTaskRegistration {
  taskId: string;
  sourceRevision: string;
  sourceUrl: string;
  taskClass: MissionTaskClass;
  dependencyIds: string[];
  dedupeKey: string;
}

export class InstitutionalMissionCoordination {
  constructor(
    private readonly db: Firestore,
    private readonly authorize: AdminAuthorizer | null = null,
    private readonly now: () => number = backendNow,
  ) {}

  private async permit(actorId: string, action: MissionAction, taskId?: string): Promise<void> {
    identity(actorId, 'actorId');
    if (!this.authorize || (await this.authorize({ actorId, action, taskId })) !== true) {
      throw new Error('DENY: approved Admin RBAC/IAM authorization adapter unavailable');
    }
  }

  private workerRef(workerId: string) {
    return this.db.collection(MISSION_COLLECTIONS.workers).doc(identity(workerId, 'workerId'));
  }

  private taskRef(taskId: string) {
    return this.db.collection(MISSION_COLLECTIONS.tasks).doc(identity(taskId, 'taskId'));
  }

  private nowChecked(): number {
    const value = this.now();
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error('invalid backend clock');
    return value;
  }

  async registerWorker(actorId: string, workerId: string, taskClasses: MissionTaskClass[]) {
    await this.permit(actorId, 'REGISTER');
    identity(workerId, 'workerId');
    if (!Array.isArray(taskClasses) || taskClasses.length === 0 || taskClasses.length > 4) {
      throw new Error('bounded worker capabilities required');
    }
    const classes = [...new Set(taskClasses.map(asTaskClass))].sort();
    const ref = this.workerRef(workerId);
    return this.db.runTransaction(async (tx) => {
      const prior = await tx.get(ref);
      if (prior.exists) {
        const previous = prior.data() || {};
        if (previous.status !== 'ACTIVE' || JSON.stringify(previous.taskClasses) !== JSON.stringify(classes)) {
          throw new Error('worker registration conflict; explicit reauthorization required');
        }
        return { workerId, duplicate: true };
      }
      tx.set(ref, {
        workerId, status: 'ACTIVE', taskClasses: classes,
        approvedBy: actorId, schema: 'urai-mission-firestore-review-1',
        registeredAt: FieldValue.serverTimestamp(),
      });
      return { workerId, duplicate: false };
    });
  }

  async registerTask(actorId: string, input: MissionTaskRegistration) {
    await this.permit(actorId, 'CREATE', input.taskId);
    identity(input.taskId, 'taskId');
    revision(input.sourceRevision);
    evidenceUrl(input.sourceUrl);
    asTaskClass(input.taskClass);
    if (!Array.isArray(input.dependencyIds) || input.dependencyIds.length > 8 ||
        new Set(input.dependencyIds).size !== input.dependencyIds.length ||
        input.dependencyIds.includes(input.taskId)) {
      throw new Error('invalid bounded dependency graph');
    }
    input.dependencyIds.forEach((v) => identity(v, 'dependencyId'));
    if (typeof input.dedupeKey !== 'string' || input.dedupeKey.length > 256 || !input.dedupeKey.trim()) {
      throw new Error('invalid idempotency key');
    }
    const canonical = {
      taskId: input.taskId, sourceRevision: input.sourceRevision,
      sourceUrl: input.sourceUrl, taskClass: input.taskClass,
      dependencyIds: input.dependencyIds, dedupeKey: input.dedupeKey,
    };
    const fingerprint = createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
    const ref = this.taskRef(input.taskId);
    const dedupeRef = this.db.collection(MISSION_COLLECTIONS.tasks)
      .doc('_dedupe_' + createHash('sha256').update(input.dedupeKey).digest('hex'));
    return this.db.runTransaction(async (tx) => {
      const current = await tx.get(ref);
      const unique = await tx.get(dedupeRef);
      const deps = await Promise.all(input.dependencyIds.map((id) => tx.get(this.taskRef(id))));
      if (current.exists || unique.exists) {
        if (current.exists && unique.exists &&
            current.data()?.fingerprint === fingerprint && unique.data()?.taskId === input.taskId) {
          return { taskId: input.taskId, duplicate: true };
        }
        throw new Error('conflicting task or duplicate-work identity');
      }
      if (deps.some((d) => !d.exists)) throw new Error('missing prerequisite task');
      tx.set(ref, {
        ...canonical, fingerprint, state: 'READY', leaseEpoch: 0,
        leaseOwner: null, leaseExpiresAtMs: null, evidenceDigest: null,
        evidenceSubmittedBy: null, createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(), producerClass: 'METADATA_ONLY',
      });
      tx.set(dedupeRef, { taskId: input.taskId, fingerprint, createdAt: FieldValue.serverTimestamp() });
      return { taskId: input.taskId, duplicate: false };
    });
  }

  async claimTask(workerId: string, taskId: string, durationSeconds = 60) {
    await this.permit(workerId, 'CLAIM', taskId);
    leaseDuration(durationSeconds);
    const ref = this.taskRef(taskId), workerRef = this.workerRef(workerId);
    return this.db.runTransaction(async (tx) => {
      const w = await tx.get(workerRef), t = await tx.get(ref);
      if (!w.exists || w.data()?.status !== 'ACTIVE') throw new Error('unregistered worker denied');
      if (!t.exists) throw new Error('task not found');
      const task = t.data() || {};
      if (!w.data()?.taskClasses?.includes(task.taskClass)) throw new Error('capability denied');
      const dependencies = (task.dependencyIds || []) as string[];
      const depSnapshots = await Promise.all(dependencies.map((id) => tx.get(this.taskRef(id))));
      if (depSnapshots.some((d) => !d.exists || d.data()?.state !== 'ACCEPTED')) {
        throw new Error('task dependencies not accepted');
      }
      const now = this.nowChecked();
      if (!(task.state === 'READY' ||
        (task.state === 'CLAIMED' && Number.isSafeInteger(task.leaseExpiresAtMs) && task.leaseExpiresAtMs < now))) {
        return null;
      }
      const epoch = Number(task.leaseEpoch);
      if (!Number.isSafeInteger(epoch) || epoch < 0 || epoch >= Number.MAX_SAFE_INTEGER - 1) {
        throw new Error('unsafe lease generation');
      }
      const nextEpoch = epoch + 1;
      const until = now + durationSeconds * 1000;
      tx.update(ref, {
        state: 'CLAIMED', leaseOwner: workerId, leaseEpoch: nextEpoch,
        leaseExpiresAtMs: until, updatedAt: FieldValue.serverTimestamp(),
      });
      return { taskId, workerId, leaseEpoch: nextEpoch, expiresAtMs: until };
    });
  }

  async heartbeat(workerId: string, taskId: string, leaseEpoch: number, durationSeconds = 60) {
    await this.permit(workerId, 'HEARTBEAT', taskId);
    leaseDuration(durationSeconds);
    if (!Number.isSafeInteger(leaseEpoch) || leaseEpoch < 1) return false;
    const ref = this.taskRef(taskId), w = this.workerRef(workerId);
    return this.db.runTransaction(async (tx) => {
      const current = await tx.get(ref), worker = await tx.get(w);
      const task = current.data() || {};
      const now = this.nowChecked();
      if (!worker.exists || worker.data()?.status !== 'ACTIVE' ||
          task.state !== 'CLAIMED' || task.leaseOwner !== workerId ||
          task.leaseEpoch !== leaseEpoch || task.leaseExpiresAtMs < now) return false;
      tx.update(ref, {
        leaseExpiresAtMs: now + durationSeconds * 1000,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return true;
    });
  }

  async submitEvidence(workerId: string, taskId: string, leaseEpoch: number, url: string, sha256: string) {
    await this.permit(workerId, 'SUBMIT_EVIDENCE', taskId);
    evidenceUrl(url);
    digest(sha256);
    if (!Number.isSafeInteger(leaseEpoch) || leaseEpoch < 1) return false;
    const ref = this.taskRef(taskId), workerRef = this.workerRef(workerId);
    return this.db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref), worker = await tx.get(workerRef);
      const task = snapshot.data() || {};
      const now = this.nowChecked();
      if (!worker.exists || worker.data()?.status !== 'ACTIVE' || task.state !== 'CLAIMED' ||
          task.leaseOwner !== workerId || task.leaseEpoch !== leaseEpoch ||
          task.leaseExpiresAtMs < now) return false;
      const receiptRef = ref.collection('receipts').doc('execution');
      const existing = await tx.get(receiptRef);
      if (existing.exists) throw new Error('execution evidence already persisted; fail closed');
      tx.set(receiptRef, {
        taskId, leaseEpoch, workerId, sourceRevision: task.sourceRevision,
        evidenceUrl: url, sha256, recordedAt: FieldValue.serverTimestamp(),
      });
      tx.update(ref, {
        state: 'VERIFYING', leaseOwner: null, leaseExpiresAtMs: null,
        evidenceDigest: sha256, evidenceSubmittedBy: workerId,
        evidenceUrl: url, updatedAt: FieldValue.serverTimestamp(),
      });
      return true;
    });
  }

  async verifyEvidence(
    reviewerId: string, taskId: string, expectedRevision: string,
    expectedDigest: string, result: 'PASS' | 'FAIL',
  ) {
    await this.permit(reviewerId, 'VERIFY', taskId);
    revision(expectedRevision);
    digest(expectedDigest);
    if (result !== 'PASS' && result !== 'FAIL') throw new Error('invalid verification result');
    const ref = this.taskRef(taskId), reviewerRef = this.workerRef(reviewerId);
    return this.db.runTransaction(async (tx) => {
      const taskSnapshot = await tx.get(ref), reviewer = await tx.get(reviewerRef);
      const task = taskSnapshot.data() || {};
      if (task.state !== 'VERIFYING') throw new Error('task not submitted for verification');
      if (!reviewer.exists || reviewer.data()?.status !== 'ACTIVE' ||
          !reviewer.data()?.taskClasses?.includes('SECURITY_REVIEW')) {
        throw new Error('independent reviewer capability required');
      }
      if (task.evidenceSubmittedBy === reviewerId) throw new Error('separation of duties violation');
      if (task.sourceRevision !== expectedRevision || task.evidenceDigest !== expectedDigest) {
        throw new Error('source or evidence changed; verification denied');
      }
      const executionReceipt = await tx.get(ref.collection('receipts').doc('execution'));
      const verifierReceipt = await tx.get(ref.collection('receipts').doc('verification'));
      if (!executionReceipt.exists || verifierReceipt.exists) {
        throw new Error('missing execution receipt or verification already recorded');
      }
      tx.set(ref.collection('receipts').doc('verification'), {
        taskId, reviewerId, expectedRevision, expectedDigest, result,
        recordedAt: FieldValue.serverTimestamp(), externalCertification: false,
      });
      tx.update(ref, { state: result === 'PASS' ? 'ACCEPTED' : 'BLOCKED',
        verifiedBy: reviewerId, verifiedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp() });
      return { taskId, state: result === 'PASS' ? 'ACCEPTED' : 'BLOCKED', reviewerId };
    });
  }

  async readTask(actorId: string, taskId: string) {
    await this.permit(actorId, 'READ', taskId);
    const snapshot = await this.taskRef(taskId).get();
    if (!snapshot.exists) throw new Error('task not found');
    return snapshot.data();
  }
}

export function createInstitutionalMissionCoordinationStore(
  db: Firestore,
  authorize: AdminAuthorizer | null = null,
) {
  return new InstitutionalMissionCoordination(db, authorize);
}
