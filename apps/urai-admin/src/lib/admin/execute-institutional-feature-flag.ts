import { createHash } from 'node:crypto';
import type { DocumentData, DocumentSnapshot, Transaction } from 'firebase-admin/firestore';

import { firestore } from '@/lib/firebase/admin';

const INSTITUTIONAL_RUNTIME_SCHEMA_VERSION = 'urai-institutional-control-plane-1';
const EVIDENCE_RECEIPT_SCHEMA_VERSION = 'urai-evidence-receipt-1';
const ACTION = 'featureFlags.set';
const DEFAULT_FAIL_CLOSED_KILL_SWITCH = 'ENVIRONMENT_WRITE_FREEZE';

const COLLECTIONS = Object.freeze({
  decisions: 'institutionalDecisions',
  evidenceReceipts: 'institutionalEvidenceReceipts',
  events: 'institutionalEvents',
  eventIdempotency: 'institutionalEventIdempotency',
  controlState: 'institutionalControlState',
});

const KILL_SWITCH_LEVELS = Object.freeze([
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

type ActorRole = 'owner' | 'admin' | 'viewer';

type InstitutionalActor = {
  uid: string;
  email?: string | null;
  role: ActorRole;
};

type FeatureFlagState = {
  exists: boolean;
  enabled: boolean | null;
  rollout: number | null;
};

type FeatureFlagWorkflowInput = {
  actor: InstitutionalActor;
  operationId: string;
  flagId: string;
  enabled: boolean;
  rollout?: number;
};

type InstitutionalRecord = Record<string, unknown>;

export type InstitutionalFeatureFlagResult = {
  success: true;
  duplicate: boolean;
  decisionId: string;
  evidenceId: string;
  eventId: string;
  flagId: string;
  enabled: boolean;
};

export class InstitutionalWorkflowError extends Error {
  constructor(message: string, readonly status = 409) {
    super(message);
    this.name = 'InstitutionalWorkflowError';
  }
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

function stripStoreMetadata(input: InstitutionalRecord): InstitutionalRecord {
  const value = { ...input };
  delete value.fingerprint;
  delete value.createdAt;
  delete value.updatedAt;
  delete value.runtimeSchemaVersion;
  return value;
}

function stateFromSnapshot(snapshot: DocumentSnapshot<DocumentData>): FeatureFlagState {
  const data = snapshot.data();
  return {
    exists: snapshot.exists,
    enabled: typeof data?.enabled === 'boolean' ? data.enabled : null,
    rollout: typeof data?.rollout === 'number' ? data.rollout : null,
  };
}

function recordFromSnapshot(snapshot: DocumentSnapshot<DocumentData>): InstitutionalRecord {
  return (snapshot.data() ?? {}) as InstitutionalRecord;
}

function decisionHistory(decision: InstitutionalRecord): InstitutionalRecord[] {
  return Array.isArray(decision.history) ? (decision.history as InstitutionalRecord[]) : [];
}

function expectedState(decision: InstitutionalRecord): FeatureFlagState {
  const expected = decision.expectedAfter;
  if (!expected || typeof expected !== 'object' || Array.isArray(expected)) {
    throw new InstitutionalWorkflowError('Institutional feature flag decision is missing its expected postcondition.', 409);
  }
  const record = expected as InstitutionalRecord;
  if (typeof record.enabled !== 'boolean') {
    throw new InstitutionalWorkflowError('Institutional feature flag decision has an invalid expected state.', 409);
  }
  return {
    exists: true,
    enabled: record.enabled,
    rollout: typeof record.rollout === 'number' ? record.rollout : null,
  };
}

function postconditionMatches(observed: FeatureFlagState, expected: FeatureFlagState): boolean {
  return observed.exists === true && observed.enabled === expected.enabled && observed.rollout === expected.rollout;
}

function killSwitchIndex(level: string): number {
  return KILL_SWITCH_LEVELS.indexOf(level as (typeof KILL_SWITCH_LEVELS)[number]);
}

async function assertEffectfulWritesAllowed(transaction: Transaction): Promise<string> {
  const controlRef = firestore.collection(COLLECTIONS.controlState).doc('global');
  const snapshot = await transaction.get(controlRef);
  if (!snapshot.exists) {
    throw new InstitutionalWorkflowError(
      `Institutional kill switch is not configured; effectful writes fail closed at ${DEFAULT_FAIL_CLOSED_KILL_SWITCH}.`,
      503,
    );
  }

  const state = recordFromSnapshot(snapshot);
  const level = typeof state.level === 'string' ? state.level : '';
  const currentIndex = killSwitchIndex(level);
  const freezeIndex = killSwitchIndex('ENVIRONMENT_WRITE_FREEZE');
  if (currentIndex < 0) {
    throw new InstitutionalWorkflowError('Institutional kill switch contains an unknown level.', 503);
  }
  if (currentIndex >= freezeIndex) {
    throw new InstitutionalWorkflowError(`Institutional effectful writes are frozen at ${level}.`, 503);
  }
  return level;
}

function transitionRef(
  decisionRef: FirebaseFirestore.DocumentReference,
  decisionId: string,
  index: number,
  fromState: string | null,
  toState: string,
  at: string,
) {
  const identity = fromState === null
    ? `${decisionId}:${index}:${toState}:${at}`
    : `${decisionId}:${index}:${fromState}:${toState}:${at}`;
  return decisionRef.collection('transitions').doc(storageId('transition', identity));
}

function storedDecision(body: InstitutionalRecord, createdAt: string, updatedAt: string): InstitutionalRecord {
  return {
    ...body,
    runtimeSchemaVersion: INSTITUTIONAL_RUNTIME_SCHEMA_VERSION,
    fingerprint: fingerprint(body),
    createdAt,
    updatedAt,
  };
}

function assertCompatibleDecision(decision: InstitutionalRecord, requestFingerprint: string): void {
  if (decision.schemaVersion !== INSTITUTIONAL_RUNTIME_SCHEMA_VERSION) {
    throw new InstitutionalWorkflowError('Existing institutional decision uses an incompatible schema.', 409);
  }
  if (decision.requestFingerprint !== requestFingerprint) {
    throw new InstitutionalWorkflowError('Conflicting feature flag operation already uses this operation ID.', 409);
  }
}

export async function executeInstitutionalFeatureFlag(
  input: FeatureFlagWorkflowInput,
): Promise<InstitutionalFeatureFlagResult> {
  if (input.actor.role !== 'owner' && input.actor.role !== 'admin') {
    throw new InstitutionalWorkflowError('Feature flag institutional execution requires owner or admin authority.', 403);
  }

  const decisionId = `admin-feature-flag:${input.operationId}`;
  const evidenceId = `${decisionId}:postcondition`;
  const eventId = `${decisionId}:changed`;
  const idempotencyKey = `${ACTION}:${input.operationId}`;
  const requestFingerprint = fingerprint({
    actorUid: input.actor.uid,
    operationId: input.operationId,
    flagId: input.flagId,
    enabled: input.enabled,
    rollout: input.rollout === undefined ? 'PRESERVE' : input.rollout,
  });

  const decisionRef = firestore.collection(COLLECTIONS.decisions).doc(storageId('decision', decisionId));
  const flagRef = firestore.collection('featureFlags').doc(input.flagId);
  const auditRef = firestore.collection('auditLogs').doc(storageId('institutional-audit', decisionId));
  const receiptRef = firestore.collection(COLLECTIONS.evidenceReceipts).doc(storageId('evidence', evidenceId));
  const eventRef = firestore.collection(COLLECTIONS.events).doc(storageId('event', eventId));
  const eventIdempotencyRef = firestore.collection(COLLECTIONS.eventIdempotency).doc(storageId('idempotency', idempotencyKey));

  const reservation = await firestore.runTransaction(async (transaction: Transaction) => {
    const killSwitchLevel = await assertEffectfulWritesAllowed(transaction);
    const existingSnapshot = await transaction.get(decisionRef);
    if (existingSnapshot.exists) {
      const existing = recordFromSnapshot(existingSnapshot);
      assertCompatibleDecision(existing, requestFingerprint);
      const state = typeof existing.state === 'string' ? existing.state : '';
      if (state === 'AUTHORIZED' || state === 'EXECUTED' || state === 'CLOSED') {
        return { state, resumed: true };
      }
      throw new InstitutionalWorkflowError(`Feature flag operation cannot resume from institutional state ${state || 'UNKNOWN'}.`, 409);
    }

    const at = new Date().toISOString();
    const requestedEvidence = {
      state: 'REQUESTED',
      at,
      actor: { uid: input.actor.uid, role: input.actor.role },
      action: ACTION,
      target: { type: 'featureFlag', id: input.flagId },
    };
    const authorizationEvidence = {
      at,
      approvals: [],
      authorization: {
        outcome: 'PERMIT',
        basis: 'allowlisted-low-risk-reversible-feature-flag-mutation',
        actorRole: input.actor.role,
        killSwitchLevel,
      },
    };
    const decision: InstitutionalRecord = {
      schemaVersion: INSTITUTIONAL_RUNTIME_SCHEMA_VERSION,
      decisionId,
      state: 'AUTHORIZED',
      action: ACTION,
      actor: {
        principalId: input.actor.uid,
        email: input.actor.email ?? null,
        role: input.actor.role,
      },
      target: { type: 'featureFlag', id: input.flagId },
      requestFingerprint,
      requiredApprovers: {
        identities: [],
        quorum: 0,
        separationOfDuties: false,
        policy: 'L2_ALLOWLISTED_REVERSIBLE_ACTION',
      },
      approvals: [],
      authorization: authorizationEvidence.authorization,
      history: [
        { state: 'REQUESTED', at },
        { state: 'AUTHORIZED', at },
      ],
    };

    transaction.set(decisionRef, storedDecision(decision, at, at));
    transaction.set(transitionRef(decisionRef, decisionId, 0, null, 'REQUESTED', at), {
      decisionId,
      fromState: null,
      toState: 'REQUESTED',
      at,
      evidenceFingerprint: fingerprint(requestedEvidence),
    });
    transaction.set(transitionRef(decisionRef, decisionId, 1, 'REQUESTED', 'AUTHORIZED', at), {
      decisionId,
      fromState: 'REQUESTED',
      toState: 'AUTHORIZED',
      at,
      evidenceFingerprint: fingerprint(authorizationEvidence),
    });
    return { state: 'AUTHORIZED', resumed: false };
  });

  if (reservation.state === 'CLOSED') {
    return {
      success: true,
      duplicate: true,
      decisionId,
      evidenceId,
      eventId,
      flagId: input.flagId,
      enabled: input.enabled,
    };
  }

  const execution = await firestore.runTransaction(async (transaction: Transaction) => {
    const killSwitchLevel = await assertEffectfulWritesAllowed(transaction);
    const decisionSnapshot = await transaction.get(decisionRef);
    if (!decisionSnapshot.exists) {
      throw new InstitutionalWorkflowError('Institutional decision disappeared before execution.', 409);
    }

    const decision = recordFromSnapshot(decisionSnapshot);
    assertCompatibleDecision(decision, requestFingerprint);
    const state = typeof decision.state === 'string' ? decision.state : '';
    if (state === 'CLOSED') {
      return { state, expectedAfter: expectedState(decision), resumed: true };
    }
    if (state === 'EXECUTED') {
      return { state, expectedAfter: expectedState(decision), resumed: true };
    }
    if (state !== 'AUTHORIZED') {
      throw new InstitutionalWorkflowError(`Feature flag execution requires AUTHORIZED state, found ${state || 'UNKNOWN'}.`, 409);
    }

    const flagSnapshot = await transaction.get(flagRef);
    const before = stateFromSnapshot(flagSnapshot);
    const expectedAfter: FeatureFlagState = {
      exists: true,
      enabled: input.enabled,
      rollout: input.rollout === undefined ? before.rollout : input.rollout,
    };
    const at = new Date().toISOString();
    const flagUpdate: InstitutionalRecord = {
      enabled: input.enabled,
      updatedAt: new Date(at),
      updatedBy: input.actor.uid,
    };
    if (input.rollout !== undefined) flagUpdate.rollout = input.rollout;

    const baseDecision = stripStoreMetadata(decision);
    const history = decisionHistory(baseDecision);
    const executionEvidence = {
      at,
      execution: {
        principalId: input.actor.uid,
        reference: `featureFlags/${input.flagId}`,
        mutationId: input.operationId,
        killSwitchLevel,
      },
    };
    const executedDecision: InstitutionalRecord = {
      ...baseDecision,
      state: 'EXECUTED',
      before,
      expectedAfter,
      execution: executionEvidence.execution,
      history: [...history, { state: 'EXECUTED', at }],
    };

    transaction.set(flagRef, flagUpdate, { merge: true });
    transaction.set(auditRef, {
      actorUid: input.actor.uid,
      actorEmail: input.actor.email ?? null,
      actorRole: input.actor.role,
      action: ACTION,
      target: { type: 'featureFlag', id: input.flagId },
      metadata: {
        mutationId: input.operationId,
        institutionalDecisionId: decisionId,
        before,
        after: expectedAfter,
        killSwitchLevel,
      },
      createdAt: new Date(at),
    });
    transaction.set(decisionRef, storedDecision(executedDecision, String(decision.createdAt ?? at), at));
    transaction.set(transitionRef(decisionRef, decisionId, history.length, 'AUTHORIZED', 'EXECUTED', at), {
      decisionId,
      fromState: 'AUTHORIZED',
      toState: 'EXECUTED',
      at,
      evidenceFingerprint: fingerprint(executionEvidence),
    });

    return { state: 'EXECUTED', expectedAfter, resumed: reservation.resumed };
  });

  if (execution.state === 'CLOSED') {
    return {
      success: true,
      duplicate: true,
      decisionId,
      evidenceId,
      eventId,
      flagId: input.flagId,
      enabled: input.enabled,
    };
  }

  const readback = stateFromSnapshot(await flagRef.get());
  if (!postconditionMatches(readback, execution.expectedAfter)) {
    throw new InstitutionalWorkflowError(
      'Feature flag execution committed but postcondition readback does not match; decision remains EXECUTED for controlled recovery.',
      409,
    );
  }

  const finalization = await firestore.runTransaction(async (transaction: Transaction) => {
    const decisionSnapshot = await transaction.get(decisionRef);
    if (!decisionSnapshot.exists) {
      throw new InstitutionalWorkflowError('Institutional decision disappeared before finalization.', 409);
    }
    const decision = recordFromSnapshot(decisionSnapshot);
    assertCompatibleDecision(decision, requestFingerprint);
    const state = typeof decision.state === 'string' ? decision.state : '';
    if (state === 'CLOSED') return { duplicate: true };
    if (state !== 'EXECUTED') {
      throw new InstitutionalWorkflowError(`Feature flag finalization requires EXECUTED state, found ${state || 'UNKNOWN'}.`, 409);
    }

    const flagSnapshot = await transaction.get(flagRef);
    const receiptSnapshot = await transaction.get(receiptRef);
    const eventSnapshot = await transaction.get(eventRef);
    const idempotencySnapshot = await transaction.get(eventIdempotencyRef);
    const observed = stateFromSnapshot(flagSnapshot);
    const expected = expectedState(decision);
    if (!postconditionMatches(observed, expected)) {
      throw new InstitutionalWorkflowError('Feature flag postcondition changed before receipt persistence; leaving decision EXECUTED.', 409);
    }
    if (receiptSnapshot.exists || eventSnapshot.exists || idempotencySnapshot.exists) {
      throw new InstitutionalWorkflowError('Partial institutional finalization evidence already exists; manual reconciliation required.', 409);
    }

    const at = new Date().toISOString();
    const baseDecision = stripStoreMetadata(decision);
    const history = decisionHistory(baseDecision);
    const postcondition = {
      verified: true,
      reference: `featureFlags/${input.flagId}`,
      expected,
      observed,
      verifiedAt: at,
    };
    const receipt: InstitutionalRecord = {
      schemaVersion: EVIDENCE_RECEIPT_SCHEMA_VERSION,
      evidenceId,
      verificationResult: 'PASS',
      policyDecisionId: decisionId,
      action: ACTION,
      actor: { principalId: input.actor.uid, role: input.actor.role },
      target: { type: 'featureFlag', id: input.flagId },
      postcondition,
      persistedAt: at,
    };
    const event: InstitutionalRecord = {
      specversion: '1.0',
      schemaVersion: INSTITUTIONAL_RUNTIME_SCHEMA_VERSION,
      id: eventId,
      source: 'urn:urai:admin:institutional-control-plane',
      type: 'urai.admin.feature-flag.changed.v1',
      subject: `featureFlags/${input.flagId}`,
      time: at,
      idempotencyKey,
      replayClassification: 'SAFE_REPLAY',
      policyDecisionId: decisionId,
      evidenceId,
      data: {
        enabled: observed.enabled,
        rollout: observed.rollout,
        actorUid: input.actor.uid,
      },
    };

    transaction.set(receiptRef, { ...receipt, fingerprint: fingerprint(receipt) });
    transaction.set(eventRef, { ...event, fingerprint: fingerprint(event), persistedAt: at });
    transaction.set(eventIdempotencyRef, { eventId, idempotencyKey, persistedAt: at });

    const postHistory = [...history, { state: 'POSTCONDITION_VERIFIED', at }];
    transaction.set(transitionRef(decisionRef, decisionId, history.length, 'EXECUTED', 'POSTCONDITION_VERIFIED', at), {
      decisionId,
      fromState: 'EXECUTED',
      toState: 'POSTCONDITION_VERIFIED',
      at,
      evidenceFingerprint: fingerprint({ at, postcondition }),
    });
    transaction.set(transitionRef(decisionRef, decisionId, postHistory.length, 'POSTCONDITION_VERIFIED', 'RECEIPT_PERSISTED', at), {
      decisionId,
      fromState: 'POSTCONDITION_VERIFIED',
      toState: 'RECEIPT_PERSISTED',
      at,
      evidenceFingerprint: fingerprint({ at, receiptId: evidenceId }),
    });
    const receiptHistory = [...postHistory, { state: 'RECEIPT_PERSISTED', at }];
    transaction.set(transitionRef(decisionRef, decisionId, receiptHistory.length, 'RECEIPT_PERSISTED', 'CLOSED', at), {
      decisionId,
      fromState: 'RECEIPT_PERSISTED',
      toState: 'CLOSED',
      at,
      evidenceFingerprint: fingerprint({ at, receiptId: evidenceId, eventId }),
    });

    const closedDecision: InstitutionalRecord = {
      ...baseDecision,
      state: 'CLOSED',
      postcondition,
      receiptId: evidenceId,
      eventId,
      history: [...receiptHistory, { state: 'CLOSED', at }],
    };
    transaction.set(decisionRef, storedDecision(closedDecision, String(decision.createdAt ?? at), at));
    return { duplicate: false };
  });

  return {
    success: true,
    duplicate: reservation.resumed || execution.resumed || finalization.duplicate,
    decisionId,
    evidenceId,
    eventId,
    flagId: input.flagId,
    enabled: input.enabled,
  };
}
