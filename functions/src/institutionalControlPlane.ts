import * as admin from 'firebase-admin';
import { createHash } from 'node:crypto';

export const INSTITUTIONAL_RUNTIME_SCHEMA_VERSION = 'urai-institutional-control-plane-1';
export const EVIDENCE_RECEIPT_SCHEMA_VERSION = 'urai-evidence-receipt-1';

export const INSTITUTIONAL_COLLECTIONS = Object.freeze({
  decisions: 'institutionalDecisions',
  evidenceReceipts: 'institutionalEvidenceReceipts',
  events: 'institutionalEvents',
  eventIdempotency: 'institutionalEventIdempotency',
  deliveryAttempts: 'institutionalDeliveryAttempts',
  deadLetters: 'institutionalDeadLetters',
  replayRequests: 'institutionalReplayRequests',
  controlState: 'institutionalControlState',
  killSwitchTransitions: 'institutionalKillSwitchTransitions',
});

export const DECISION_STATES = Object.freeze([
  'REQUESTED',
  'AUTHORIZED',
  'DENIED',
  'SUPERSEDED',
  'EXPIRED',
  'EXECUTED',
  'POSTCONDITION_VERIFIED',
  'RECEIPT_PERSISTED',
  'CLOSED',
] as const);

export const REPLAY_CLASSIFICATIONS = Object.freeze([
  'SAFE_REPLAY',
  'COMPENSATED_REPLAY',
  'NO_REPLAY',
] as const);

export const KILL_SWITCH_LEVELS = Object.freeze([
  'NORMAL',
  'TASK_CANCEL',
  'AGENT_DISABLE',
  'CAPABILITY_DISABLE',
  'CREDENTIAL_REVOKE',
  'TOOL_PROVIDER_DISABLE',
  'ENVIRONMENT_WRITE_FREEZE',
  'FINANCIAL_SPENDING_FREEZE',
  'OUTBOUND_COMMUNICATION_FREEZE',
  'DEPLOYMENT_FREEZE',
  'INSTITUTIONAL_EMERGENCY_MODE',
] as const);

const DECISION_TRANSITIONS: Record<string, readonly string[]> = Object.freeze({
  REQUESTED: ['AUTHORIZED', 'DENIED', 'SUPERSEDED', 'EXPIRED'],
  AUTHORIZED: ['EXECUTED', 'SUPERSEDED', 'EXPIRED'],
  DENIED: [],
  SUPERSEDED: [],
  EXPIRED: [],
  EXECUTED: ['POSTCONDITION_VERIFIED'],
  POSTCONDITION_VERIFIED: ['RECEIPT_PERSISTED'],
  RECEIPT_PERSISTED: ['CLOSED'],
  CLOSED: [],
});

const DEFAULT_FAIL_CLOSED_KILL_SWITCH = 'ENVIRONMENT_WRITE_FREEZE';

type Firestore = ReturnType<typeof admin.firestore>;
type InstitutionalRecord = Record<string, unknown>;

export interface RuntimeIdentityInput {
  projectIdentityPresent: boolean;
  revisionPresent: boolean;
}

export interface InstitutionalRuntimeReadiness {
  ready: boolean;
  checks: {
    projectIdentity: boolean;
    runtimeRevision: boolean;
    firestoreReachable: boolean;
    collectionsBound: boolean;
    killSwitchConfigured: boolean;
    globalEffectfulWritesAllowed: boolean;
  };
  killSwitch: {
    configured: boolean;
    level: string;
  };
}

function requireObject(value: unknown, name: string): InstitutionalRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as InstitutionalRecord;
}

function requireString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${name} must be a non-empty string`);
  }
  return value;
}

function requireBoolean(value: unknown, name: string): boolean {
  if (typeof value !== 'boolean') throw new Error(`${name} must be boolean`);
  return value;
}

function requirePositiveInteger(value: unknown, name: string): number {
  if (!Number.isInteger(value) || Number(value) < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return Number(value);
}

function requireIsoTime(value: unknown, name: string): string {
  const result = requireString(value, name);
  if (Number.isNaN(Date.parse(result))) throw new Error(`${name} must be an ISO timestamp`);
  return result;
}

function requireArray(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  return value;
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    if (value instanceof Date) return value.toISOString();
    return Object.fromEntries(
      Object.entries(value as InstitutionalRecord)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, stableValue(child)]),
    );
  }
  return value;
}

function fingerprint(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(stableValue(value))).digest('hex');
}

function storageId(namespace: string, value: string): string {
  return createHash('sha256').update(`${namespace}\u0000${value}`).digest('hex');
}

function withoutStoreMetadata(input: InstitutionalRecord): InstitutionalRecord {
  const value = { ...input };
  delete value.fingerprint;
  delete value.createdAt;
  delete value.updatedAt;
  delete value.runtimeSchemaVersion;
  return value;
}

function requireDecisionShape(input: unknown): InstitutionalRecord {
  const decision = requireObject(input, 'decision');
  if (decision.schemaVersion !== INSTITUTIONAL_RUNTIME_SCHEMA_VERSION) {
    throw new Error('decision schemaVersion mismatch');
  }
  requireString(decision.decisionId, 'decision.decisionId');
  requireString(decision.state, 'decision.state');
  if (!DECISION_STATES.includes(decision.state as (typeof DECISION_STATES)[number])) {
    throw new Error('decision.state is not recognized');
  }
  requireObject(decision.requiredApprovers, 'decision.requiredApprovers');
  requireArray(decision.approvals ?? [], 'decision.approvals');
  requireArray(decision.history, 'decision.history');
  return decision;
}

function requireEvidenceReceiptShape(input: unknown): InstitutionalRecord {
  const receipt = requireObject(input, 'evidence receipt');
  if (receipt.schemaVersion !== EVIDENCE_RECEIPT_SCHEMA_VERSION) {
    throw new Error('evidence receipt schemaVersion mismatch');
  }
  requireString(receipt.evidenceId, 'evidence receipt.evidenceId');
  requireString(receipt.verificationResult, 'evidence receipt.verificationResult');
  return receipt;
}

function requireEventShape(input: unknown): InstitutionalRecord {
  const event = requireObject(input, 'institutional event');
  if (event.specversion !== '1.0') throw new Error('event specversion must be CloudEvents 1.0');
  if (event.schemaVersion !== INSTITUTIONAL_RUNTIME_SCHEMA_VERSION) {
    throw new Error('event schemaVersion mismatch');
  }
  requireString(event.id, 'event.id');
  requireString(event.idempotencyKey, 'event.idempotencyKey');
  const replayClassification = requireString(event.replayClassification, 'event.replayClassification');
  if (!REPLAY_CLASSIFICATIONS.includes(replayClassification as (typeof REPLAY_CLASSIFICATIONS)[number])) {
    throw new Error('event replayClassification is not recognized');
  }
  return event;
}

function killSwitchIndex(level: string): number {
  const index = KILL_SWITCH_LEVELS.indexOf(level as (typeof KILL_SWITCH_LEVELS)[number]);
  if (index < 0) throw new Error(`unknown kill-switch level: ${level}`);
  return index;
}

export function writesAllowedAtKillSwitchLevel(level: string): boolean {
  return killSwitchIndex(level) < killSwitchIndex('ENVIRONMENT_WRITE_FREEZE');
}

export class InstitutionalControlPlaneStore {
  constructor(private readonly db: Firestore) {}

  async persistDecision(input: InstitutionalRecord): Promise<{ created: boolean; duplicate: boolean; decisionId: string }> {
    const decision = requireDecisionShape(input);
    if (decision.state !== 'REQUESTED') throw new Error('new decision must start in REQUESTED');
    const decisionId = requireString(decision.decisionId, 'decision.decisionId');
    const history = requireArray(decision.history, 'decision.history');
    const firstHistory = requireObject(history[0], 'decision.history[0]');
    if (firstHistory.state !== 'REQUESTED') throw new Error('first decision history state must be REQUESTED');
    const requestedAt = requireIsoTime(firstHistory.at, 'decision.history[0].at');
    const inputFingerprint = fingerprint(decision);
    const decisionRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.decisions).doc(storageId('decision', decisionId));
    const transitionRef = decisionRef.collection('transitions').doc(storageId('transition', `${decisionId}:0:REQUESTED:${requestedAt}`));

    return this.db.runTransaction(async (tx) => {
      const current = await tx.get(decisionRef);
      if (current.exists) {
        const stored = requireObject(current.data(), 'stored decision');
        if (stored.fingerprint === inputFingerprint) {
          return { created: false, duplicate: true, decisionId };
        }
        throw new Error('conflicting decision already exists');
      }

      tx.set(decisionRef, {
        ...decision,
        runtimeSchemaVersion: INSTITUTIONAL_RUNTIME_SCHEMA_VERSION,
        fingerprint: inputFingerprint,
        createdAt: requestedAt,
        updatedAt: requestedAt,
      });
      tx.set(transitionRef, {
        decisionId,
        fromState: null,
        toState: 'REQUESTED',
        at: requestedAt,
        evidenceFingerprint: fingerprint(firstHistory),
      });
      return { created: true, duplicate: false, decisionId };
    });
  }

  async transitionDecision(
    decisionId: string,
    nextState: string,
    evidenceInput: InstitutionalRecord,
  ): Promise<{ decisionId: string; state: string }> {
    requireString(decisionId, 'decisionId');
    if (!DECISION_STATES.includes(nextState as (typeof DECISION_STATES)[number])) {
      throw new Error('nextState is not recognized');
    }
    const evidence = requireObject(evidenceInput, 'transition evidence');
    const at = requireIsoTime(evidence.at, 'transition evidence.at');
    const decisionRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.decisions).doc(storageId('decision', decisionId));

    return this.db.runTransaction(async (tx) => {
      const snapshot = await tx.get(decisionRef);
      if (!snapshot.exists) throw new Error('decision does not exist');
      const stored = requireObject(snapshot.data(), 'stored decision');
      const decision = requireDecisionShape(withoutStoreMetadata(stored));
      const currentState = requireString(decision.state, 'decision.state');
      if (!DECISION_TRANSITIONS[currentState]?.includes(nextState)) {
        throw new Error(`invalid decision transition ${currentState} -> ${nextState}`);
      }

      let receiptSnapshot: FirebaseFirestore.DocumentSnapshot | null = null;
      let receiptId: string | null = null;
      if (nextState === 'RECEIPT_PERSISTED') {
        receiptId = requireString(evidence.receiptId, 'transition evidence.receiptId');
        const receiptRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.evidenceReceipts).doc(storageId('evidence', receiptId));
        receiptSnapshot = await tx.get(receiptRef);
        if (!receiptSnapshot.exists) throw new Error('referenced evidence receipt does not exist');
        const receipt = requireEvidenceReceiptShape(receiptSnapshot.data());
        if (receipt.policyDecisionId !== decisionId) {
          throw new Error('evidence receipt is not bound to this decision');
        }
      }

      const next: InstitutionalRecord = { ...decision };
      if (nextState === 'AUTHORIZED') {
        const approvals = requireArray(evidence.approvals, 'transition evidence.approvals');
        const requiredApprovers = requireObject(decision.requiredApprovers, 'decision.requiredApprovers');
        const identities = requireArray(requiredApprovers.identities, 'decision.requiredApprovers.identities').map((value, index) =>
          requireString(value, `decision.requiredApprovers.identities[${index}]`),
        );
        const quorum = Number(requiredApprovers.quorum);
        if (!Number.isInteger(quorum) || quorum < 0) throw new Error('decision.requiredApprovers.quorum must be non-negative');
        if (approvals.length < quorum) throw new Error('authorization quorum not satisfied');
        for (const approval of approvals) {
          const approvalRecord = requireObject(approval, 'approval');
          const principalId = requireString(approvalRecord.principalId, 'approval.principalId');
          if (identities.length > 0 && !identities.includes(principalId)) {
            throw new Error('approval from unauthorized principal');
          }
        }
        next.approvals = approvals;
      }
      if (nextState === 'DENIED') next.denialReason = requireString(evidence.reason, 'transition evidence.reason');
      if (nextState === 'SUPERSEDED') next.supersededBy = requireString(evidence.supersededBy, 'transition evidence.supersededBy');
      if (nextState === 'EXECUTED') {
        const execution = requireObject(evidence.execution, 'transition evidence.execution');
        const principalId = requireString(execution.principalId, 'transition evidence.execution.principalId');
        requireString(execution.reference, 'transition evidence.execution.reference');
        const requiredApprovers = requireObject(decision.requiredApprovers, 'decision.requiredApprovers');
        const separationOfDuties = requireBoolean(requiredApprovers.separationOfDuties, 'decision.requiredApprovers.separationOfDuties');
        if (separationOfDuties) {
          const approvals = requireArray(decision.approvals ?? [], 'decision.approvals');
          const executorApproved = approvals.some((approval) =>
            requireObject(approval, 'approval').principalId === principalId,
          );
          if (executorApproved) throw new Error('separation of duties violated by executor');
        }
        next.execution = execution;
      }
      if (nextState === 'POSTCONDITION_VERIFIED') {
        const postcondition = requireObject(evidence.postcondition, 'transition evidence.postcondition');
        if (postcondition.verified !== true) throw new Error('postcondition must be positively verified');
        requireString(postcondition.reference, 'transition evidence.postcondition.reference');
        next.postcondition = postcondition;
      }
      if (nextState === 'RECEIPT_PERSISTED') next.receiptId = receiptId;
      if (nextState === 'CLOSED') {
        if (!decision.receiptId) throw new Error('decision cannot close without a persisted receipt');
        const postcondition = requireObject(decision.postcondition, 'decision.postcondition');
        if (postcondition.verified !== true) throw new Error('decision cannot close without verified postcondition');
      }

      const history = requireArray(decision.history, 'decision.history');
      next.state = nextState;
      next.history = [...history, { state: nextState, at }];
      const nextFingerprint = fingerprint(next);
      const transitionRef = decisionRef.collection('transitions').doc(
        storageId('transition', `${decisionId}:${history.length}:${currentState}:${nextState}:${at}`),
      );
      tx.set(decisionRef, {
        ...next,
        runtimeSchemaVersion: INSTITUTIONAL_RUNTIME_SCHEMA_VERSION,
        fingerprint: nextFingerprint,
        createdAt: stored.createdAt ?? at,
        updatedAt: at,
      });
      tx.set(transitionRef, {
        decisionId,
        fromState: currentState,
        toState: nextState,
        at,
        evidenceFingerprint: fingerprint(evidence),
      });
      return { decisionId, state: nextState };
    });
  }

  async persistEvidenceReceipt(input: InstitutionalRecord): Promise<{ created: boolean; duplicate: boolean; evidenceId: string }> {
    const receipt = requireEvidenceReceiptShape(input);
    const evidenceId = requireString(receipt.evidenceId, 'evidence receipt.evidenceId');
    const inputFingerprint = fingerprint(receipt);
    const receiptRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.evidenceReceipts).doc(storageId('evidence', evidenceId));

    return this.db.runTransaction(async (tx) => {
      const current = await tx.get(receiptRef);
      if (current.exists) {
        const stored = requireObject(current.data(), 'stored evidence receipt');
        if (stored.fingerprint === inputFingerprint) {
          return { created: false, duplicate: true, evidenceId };
        }
        throw new Error('conflicting evidence receipt already exists');
      }
      tx.set(receiptRef, {
        ...receipt,
        fingerprint: inputFingerprint,
        persistedAt: new Date().toISOString(),
      });
      return { created: true, duplicate: false, evidenceId };
    });
  }

  async persistEvent(input: InstitutionalRecord): Promise<{ accepted: boolean; reason: string; eventId: string }> {
    const event = requireEventShape(input);
    const eventId = requireString(event.id, 'event.id');
    const idempotencyKey = requireString(event.idempotencyKey, 'event.idempotencyKey');
    const eventRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.events).doc(storageId('event', eventId));
    const idempotencyRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.eventIdempotency).doc(storageId('idempotency', idempotencyKey));

    return this.db.runTransaction(async (tx) => {
      const eventSnapshot = await tx.get(eventRef);
      const idempotencySnapshot = await tx.get(idempotencyRef);
      if (eventSnapshot.exists) return { accepted: false, reason: 'DUPLICATE_EVENT_ID', eventId };
      if (idempotencySnapshot.exists) return { accepted: false, reason: 'DUPLICATE_IDEMPOTENCY_KEY', eventId };

      tx.set(eventRef, {
        ...event,
        fingerprint: fingerprint(event),
        persistedAt: new Date().toISOString(),
      });
      tx.set(idempotencyRef, {
        eventId,
        idempotencyKey,
        persistedAt: new Date().toISOString(),
      });
      return { accepted: true, reason: 'FIRST_DELIVERY', eventId };
    });
  }

  async recordEventFailure(input: {
    eventId: string;
    attempt: number;
    maxAttempts: number;
    retryable: boolean;
    errorClass: string;
    errorReference: string;
  }): Promise<{ classification: 'RETRY' | 'DEAD_LETTER'; duplicate: boolean }> {
    const eventId = requireString(input.eventId, 'eventId');
    const attempt = requirePositiveInteger(input.attempt, 'attempt');
    const maxAttempts = requirePositiveInteger(input.maxAttempts, 'maxAttempts');
    requireBoolean(input.retryable, 'retryable');
    const errorClass = requireString(input.errorClass, 'errorClass');
    const errorReference = requireString(input.errorReference, 'errorReference');
    const classification: 'RETRY' | 'DEAD_LETTER' = input.retryable && attempt < maxAttempts ? 'RETRY' : 'DEAD_LETTER';
    const eventRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.events).doc(storageId('event', eventId));
    const attemptRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.deliveryAttempts).doc(storageId('delivery-attempt', `${eventId}:${attempt}`));
    const deadLetterRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.deadLetters).doc(storageId('dead-letter', eventId));
    const attemptRecord = { eventId, attempt, maxAttempts, retryable: input.retryable, errorClass, errorReference, classification };
    const attemptFingerprint = fingerprint(attemptRecord);

    return this.db.runTransaction(async (tx) => {
      const eventSnapshot = await tx.get(eventRef);
      const priorAttempt = await tx.get(attemptRef);
      const priorDeadLetter = classification === 'DEAD_LETTER' ? await tx.get(deadLetterRef) : null;
      if (!eventSnapshot.exists) throw new Error('cannot record failure for unknown event');
      if (priorAttempt.exists) {
        const stored = requireObject(priorAttempt.data(), 'stored delivery attempt');
        if (stored.fingerprint === attemptFingerprint) return { classification, duplicate: true };
        throw new Error('conflicting delivery attempt already exists');
      }
      if (priorDeadLetter?.exists) throw new Error('event is already dead-lettered');

      tx.set(attemptRef, { ...attemptRecord, fingerprint: attemptFingerprint, recordedAt: new Date().toISOString() });
      if (classification === 'DEAD_LETTER') {
        tx.set(deadLetterRef, {
          eventId,
          terminalAttempt: attempt,
          errorClass,
          errorReference,
          replayRequiresSeparateAuthorization: true,
          recordedAt: new Date().toISOString(),
        });
      }
      return { classification, duplicate: false };
    });
  }

  async requestReplay(input: {
    requestId: string;
    eventId: string;
    requestedBy: string;
    reason: string;
    compensationReceiptId?: string | null;
  }): Promise<{ created: boolean; duplicate: boolean; requestId: string }> {
    const requestId = requireString(input.requestId, 'replay requestId');
    const eventId = requireString(input.eventId, 'replay eventId');
    const requestedBy = requireString(input.requestedBy, 'replay requestedBy');
    const reason = requireString(input.reason, 'replay reason');
    const eventRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.events).doc(storageId('event', eventId));
    const requestRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.replayRequests).doc(storageId('replay-request', requestId));

    return this.db.runTransaction(async (tx) => {
      const eventSnapshot = await tx.get(eventRef);
      const requestSnapshot = await tx.get(requestRef);
      if (!eventSnapshot.exists) throw new Error('replay event does not exist');
      const event = requireEventShape(eventSnapshot.data());
      const replayClassification = requireString(event.replayClassification, 'event.replayClassification');
      if (replayClassification === 'NO_REPLAY') throw new Error('event replay forbidden');

      let compensationReceiptId: string | null = null;
      if (replayClassification === 'COMPENSATED_REPLAY') {
        compensationReceiptId = requireString(input.compensationReceiptId, 'compensationReceiptId');
        const receiptRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.evidenceReceipts).doc(storageId('evidence', compensationReceiptId));
        const compensationReceipt = await tx.get(receiptRef);
        if (!compensationReceipt.exists) throw new Error('compensated replay requires persisted compensation evidence');
        const receipt = requireEvidenceReceiptShape(compensationReceipt.data());
        if (receipt.verificationResult !== 'PASS') {
          throw new Error('compensated replay requires verified compensation evidence');
        }
      }

      const replayRecord = {
        requestId,
        eventId,
        requestedBy,
        reason,
        replayClassification,
        compensationReceiptId,
        executionAuthorized: false,
        requiresSeparateAuthorization: true,
        state: 'REQUESTED',
      };
      const replayFingerprint = fingerprint(replayRecord);
      if (requestSnapshot.exists) {
        const stored = requireObject(requestSnapshot.data(), 'stored replay request');
        if (stored.fingerprint === replayFingerprint) return { created: false, duplicate: true, requestId };
        throw new Error('conflicting replay request already exists');
      }

      tx.set(requestRef, { ...replayRecord, fingerprint: replayFingerprint, requestedAt: new Date().toISOString() });
      return { created: true, duplicate: false, requestId };
    });
  }

  async getKillSwitchState(): Promise<{ configured: boolean; level: string; version: number }> {
    const stateRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.controlState).doc('global');
    const snapshot = await stateRef.get();
    if (!snapshot.exists) {
      return { configured: false, level: DEFAULT_FAIL_CLOSED_KILL_SWITCH, version: 0 };
    }
    const state = requireObject(snapshot.data(), 'kill-switch state');
    const level = requireString(state.level, 'kill-switch state.level');
    killSwitchIndex(level);
    const version = Number(state.version ?? 0);
    if (!Number.isInteger(version) || version < 0) throw new Error('kill-switch version is invalid');
    return { configured: true, level, version };
  }

  async transitionKillSwitch(
    targetLevel: string,
    options: { authorized: boolean; restorationAuthorized: boolean; actorId: string; reason: string },
  ): Promise<{ level: string; version: number }> {
    killSwitchIndex(targetLevel);
    if (options.authorized !== true) throw new Error('kill-switch transition requires explicit authorization');
    const actorId = requireString(options.actorId, 'kill-switch actorId');
    const reason = requireString(options.reason, 'kill-switch reason');
    const stateRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.controlState).doc('global');

    return this.db.runTransaction(async (tx) => {
      const snapshot = await tx.get(stateRef);
      let configured = false;
      let currentLevel = DEFAULT_FAIL_CLOSED_KILL_SWITCH;
      let currentVersion = 0;
      if (snapshot.exists) {
        configured = true;
        const state = requireObject(snapshot.data(), 'kill-switch state');
        currentLevel = requireString(state.level, 'kill-switch state.level');
        killSwitchIndex(currentLevel);
        currentVersion = Number(state.version ?? 0);
        if (!Number.isInteger(currentVersion) || currentVersion < 0) throw new Error('kill-switch version is invalid');
      }
      if (killSwitchIndex(targetLevel) < killSwitchIndex(currentLevel) && options.restorationAuthorized !== true) {
        throw new Error('kill-switch restoration requires separately authorized restoration');
      }
      const nextVersion = currentVersion + 1;
      const at = new Date().toISOString();
      const transitionRef = this.db.collection(INSTITUTIONAL_COLLECTIONS.killSwitchTransitions).doc(
        storageId('kill-switch-transition', `${nextVersion}:${currentLevel}:${targetLevel}:${actorId}`),
      );
      tx.set(stateRef, {
        configured: true,
        level: targetLevel,
        version: nextVersion,
        updatedAt: at,
        updatedBy: actorId,
        reason,
        priorStateConfigured: configured,
      });
      tx.set(transitionRef, {
        fromLevel: currentLevel,
        toLevel: targetLevel,
        version: nextVersion,
        actorId,
        reason,
        restorationAuthorized: options.restorationAuthorized === true,
        at,
      });
      return { level: targetLevel, version: nextVersion };
    });
  }

  async readRuntimeReadiness(identity: RuntimeIdentityInput): Promise<InstitutionalRuntimeReadiness> {
    const collectionsBound = Object.values(INSTITUTIONAL_COLLECTIONS).every((name) => typeof name === 'string' && name.length > 0);
    try {
      const killSwitch = await this.getKillSwitchState();
      const checks = {
        projectIdentity: identity.projectIdentityPresent,
        runtimeRevision: identity.revisionPresent,
        firestoreReachable: true,
        collectionsBound,
        killSwitchConfigured: killSwitch.configured,
        globalEffectfulWritesAllowed: writesAllowedAtKillSwitchLevel(killSwitch.level),
      };
      return {
        ready: Object.values(checks).every(Boolean),
        checks,
        killSwitch: { configured: killSwitch.configured, level: killSwitch.level },
      };
    } catch {
      const checks = {
        projectIdentity: identity.projectIdentityPresent,
        runtimeRevision: identity.revisionPresent,
        firestoreReachable: false,
        collectionsBound,
        killSwitchConfigured: false,
        globalEffectfulWritesAllowed: false,
      };
      return {
        ready: false,
        checks,
        killSwitch: { configured: false, level: DEFAULT_FAIL_CLOSED_KILL_SWITCH },
      };
    }
  }
}

export function createInstitutionalControlPlaneStore(db: Firestore): InstitutionalControlPlaneStore {
  return new InstitutionalControlPlaneStore(db);
}
