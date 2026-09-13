export const INSTITUTIONAL_SCHEMA_VERSION = 'urai-institutional-control-plane-1';
export const EVIDENCE_RECEIPT_SCHEMA_VERSION = 'urai-evidence-receipt-1';
export const AUTHORIZATION_RESULTS = Object.freeze(['PERMIT', 'DENY', 'REQUIRES_APPROVAL']);
export const AUTONOMY_LEVELS = Object.freeze(['L0', 'L1', 'L2', 'L3', 'L4', 'L5']);
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
]);
export const EVENT_CATEGORIES = Object.freeze([
  'DOMAIN',
  'AUDIT_SECURITY',
  'WORKFLOW',
  'EVIDENCE',
  'TELEMETRY',
  'ANALYTICS',
]);
export const REPLAY_CLASSIFICATIONS = Object.freeze(['SAFE_REPLAY', 'COMPENSATED_REPLAY', 'NO_REPLAY']);
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
]);

const DECISION_TRANSITIONS = Object.freeze({
  REQUESTED: new Set(['AUTHORIZED', 'DENIED', 'SUPERSEDED', 'EXPIRED']),
  AUTHORIZED: new Set(['EXECUTED', 'SUPERSEDED', 'EXPIRED']),
  DENIED: new Set(),
  SUPERSEDED: new Set(),
  EXPIRED: new Set(),
  EXECUTED: new Set(['POSTCONDITION_VERIFIED']),
  POSTCONDITION_VERIFIED: new Set(['RECEIPT_PERSISTED']),
  RECEIPT_PERSISTED: new Set(['CLOSED']),
  CLOSED: new Set(),
});

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function requireObject(value, name) {
  invariant(value && typeof value === 'object' && !Array.isArray(value), `${name} must be an object`);
  return value;
}

function requireString(value, name) {
  invariant(typeof value === 'string' && value.trim().length > 0, `${name} must be a non-empty string`);
  return value;
}

function requireBoolean(value, name) {
  invariant(typeof value === 'boolean', `${name} must be boolean`);
  return value;
}

function requireArray(value, name) {
  invariant(Array.isArray(value), `${name} must be an array`);
  return value;
}

function requireEnum(value, allowed, name) {
  invariant(allowed.includes(value), `${name} must be one of ${allowed.join(', ')}`);
  return value;
}

function requireIsoTime(value, name) {
  requireString(value, name);
  invariant(!Number.isNaN(Date.parse(value)), `${name} must be an ISO timestamp`);
  return value;
}

export function assertCanonicalId(value, kind = 'canonicalId') {
  requireString(value, kind);
  invariant(/^[a-z][a-z0-9-]{1,31}_[a-z0-9]{12,64}$/.test(value), `${kind} must be a stable opaque canonical id`);
  return value;
}

export function validateAuthorizationRequest(input) {
  const value = requireObject(input, 'authorization request');
  invariant(value.schemaVersion === INSTITUTIONAL_SCHEMA_VERSION, 'authorization request schemaVersion mismatch');
  assertCanonicalId(value.requestId, 'requestId');
  const principal = requireObject(value.principal, 'principal');
  assertCanonicalId(principal.id, 'principal.id');
  if (principal.workloadIdentityId != null) assertCanonicalId(principal.workloadIdentityId, 'principal.workloadIdentityId');
  requireString(value.institutionalRole, 'institutionalRole');
  assertCanonicalId(value.legalEntityId, 'legalEntityId');
  const resource = requireObject(value.resource, 'resource');
  assertCanonicalId(resource.id, 'resource.id');
  requireString(resource.type, 'resource.type');
  requireString(value.action, 'action');
  requireString(value.capability, 'capability');
  requireString(value.environment, 'environment');
  requireString(value.dataClass, 'dataClass');
  requireString(value.riskClass, 'riskClass');
  requireEnum(value.reversibility, ['REVERSIBLE', 'COMPENSATABLE', 'IRREVERSIBLE'], 'reversibility');
  requireEnum(value.maximumAutonomy, AUTONOMY_LEVELS, 'maximumAutonomy');
  requireBoolean(value.emergencyMode, 'emergencyMode');
  requireArray(value.evidenceObligations, 'evidenceObligations').forEach((entry, index) => requireString(entry, `evidenceObligations[${index}]`));
  const approvals = requireObject(value.approvalRequirements, 'approvalRequirements');
  requireBoolean(approvals.required, 'approvalRequirements.required');
  requireArray(approvals.approvers, 'approvalRequirements.approvers');
  invariant(Number.isInteger(approvals.quorum) && approvals.quorum >= 0, 'approvalRequirements.quorum must be a non-negative integer');
  requireBoolean(approvals.separationOfDuties, 'approvalRequirements.separationOfDuties');
  if (approvals.required) invariant(approvals.quorum > 0, 'required approval must have a positive quorum');
  if (value.delegatedAuthorityId != null) assertCanonicalId(value.delegatedAuthorityId, 'delegatedAuthorityId');
  if (value.expiresAt != null) requireIsoTime(value.expiresAt, 'expiresAt');
  if (value.amount != null) {
    const amount = requireObject(value.amount, 'amount');
    invariant(Number.isInteger(amount.minorUnits) && amount.minorUnits >= 0, 'amount.minorUnits must be a non-negative integer');
    invariant(/^[A-Z]{3}$/.test(requireString(amount.currency, 'amount.currency')), 'amount.currency must be ISO-4217 uppercase');
  }
  if (value.counterpartyId != null) assertCanonicalId(value.counterpartyId, 'counterpartyId');
  return value;
}

export function createAuthorizationDecision(request, result, options = {}) {
  validateAuthorizationRequest(request);
  requireEnum(result, AUTHORIZATION_RESULTS, 'authorization result');
  const decision = {
    schemaVersion: INSTITUTIONAL_SCHEMA_VERSION,
    requestId: request.requestId,
    result,
    policyVersion: requireString(options.policyVersion, 'policyVersion'),
    decidedAt: requireIsoTime(options.decidedAt, 'decidedAt'),
    reasons: requireArray(options.reasons || [], 'reasons'),
    evidenceRequired: request.evidenceObligations,
    approvalRequired: result === 'REQUIRES_APPROVAL',
  };
  if (result === 'PERMIT' && request.approvalRequirements.required) {
    throw new Error('fail-closed: request requiring approval cannot receive direct PERMIT');
  }
  return Object.freeze(decision);
}

export function assertEffectfulExecutionAuthorized(request, authorizationDecision, now = new Date().toISOString()) {
  validateAuthorizationRequest(request);
  requireObject(authorizationDecision, 'authorizationDecision');
  invariant(authorizationDecision.requestId === request.requestId, 'authorization decision request mismatch');
  invariant(authorizationDecision.result === 'PERMIT', `effectful execution forbidden for authorization result ${authorizationDecision.result}`);
  if (request.expiresAt != null) invariant(Date.parse(now) <= Date.parse(request.expiresAt), 'authorization request expired');
  return true;
}

export function createDecisionObject(input) {
  const value = requireObject(input, 'decision');
  const requiredApprovers = requireObject(value.requiredApprovers, 'requiredApprovers');
  requireArray(requiredApprovers.identities, 'requiredApprovers.identities');
  invariant(Number.isInteger(requiredApprovers.quorum) && requiredApprovers.quorum >= 0, 'requiredApprovers.quorum must be non-negative');
  requireBoolean(requiredApprovers.separationOfDuties, 'requiredApprovers.separationOfDuties');
  const decision = {
    schemaVersion: INSTITUTIONAL_SCHEMA_VERSION,
    decisionId: assertCanonicalId(value.decisionId, 'decisionId'),
    state: 'REQUESTED',
    requestedAction: requireString(value.requestedAction, 'requestedAction'),
    principalId: assertCanonicalId(value.principalId, 'principalId'),
    resourceId: assertCanonicalId(value.resourceId, 'resourceId'),
    rationale: requireString(value.rationale, 'rationale'),
    alternatives: requireArray(value.alternatives || [], 'alternatives'),
    evidenceRefs: requireArray(value.evidenceRefs || [], 'evidenceRefs'),
    exposures: {
      financial: requireString(value.exposures?.financial ?? 'NONE', 'exposures.financial'),
      legal: requireString(value.exposures?.legal ?? 'NONE', 'exposures.legal'),
      privacy: requireString(value.exposures?.privacy ?? 'NONE', 'exposures.privacy'),
      security: requireString(value.exposures?.security ?? 'NONE', 'exposures.security'),
      safety: requireString(value.exposures?.safety ?? 'NONE', 'exposures.safety'),
    },
    blastRadius: requireString(value.blastRadius, 'blastRadius'),
    reversibility: requireEnum(value.reversibility, ['REVERSIBLE', 'COMPENSATABLE', 'IRREVERSIBLE'], 'reversibility'),
    deadline: value.deadline == null ? null : requireIsoTime(value.deadline, 'deadline'),
    expiresAt: value.expiresAt == null ? null : requireIsoTime(value.expiresAt, 'expiresAt'),
    requiredAuthority: requireString(value.requiredAuthority, 'requiredAuthority'),
    requiredApprovers,
    approvals: [],
    emergencyOverride: value.emergencyOverride ?? null,
    execution: null,
    postcondition: null,
    receiptId: null,
    supersededBy: null,
    denialReason: null,
    history: [{ state: 'REQUESTED', at: requireIsoTime(value.requestedAt, 'requestedAt') }],
  };
  return decision;
}

export function transitionDecision(decision, nextState, evidence = {}) {
  const current = requireObject(decision, 'decision');
  requireEnum(current.state, DECISION_STATES, 'decision.state');
  requireEnum(nextState, DECISION_STATES, 'nextState');
  invariant(DECISION_TRANSITIONS[current.state].has(nextState), `invalid decision transition ${current.state} -> ${nextState}`);
  const at = requireIsoTime(evidence.at, 'evidence.at');
  const next = structuredClone(current);

  if (nextState === 'AUTHORIZED') {
    const approvals = requireArray(evidence.approvals, 'evidence.approvals');
    invariant(approvals.length >= current.requiredApprovers.quorum, 'authorization quorum not satisfied');
    if (current.requiredApprovers.identities.length > 0) {
      for (const approval of approvals) invariant(current.requiredApprovers.identities.includes(approval.principalId), 'approval from unauthorized principal');
    }
    next.approvals = approvals;
  }
  if (nextState === 'DENIED') next.denialReason = requireString(evidence.reason, 'evidence.reason');
  if (nextState === 'SUPERSEDED') next.supersededBy = assertCanonicalId(evidence.supersededBy, 'evidence.supersededBy');
  if (nextState === 'EXECUTED') {
    const execution = requireObject(evidence.execution, 'evidence.execution');
    assertCanonicalId(execution.principalId, 'execution.principalId');
    requireString(execution.reference, 'execution.reference');
    if (current.requiredApprovers.separationOfDuties) {
      invariant(!current.approvals.some((approval) => approval.principalId === execution.principalId), 'separation of duties violated by executor');
    }
    next.execution = execution;
  }
  if (nextState === 'POSTCONDITION_VERIFIED') {
    const postcondition = requireObject(evidence.postcondition, 'evidence.postcondition');
    invariant(postcondition.verified === true, 'postcondition must be positively verified');
    requireString(postcondition.reference, 'postcondition.reference');
    next.postcondition = postcondition;
  }
  if (nextState === 'RECEIPT_PERSISTED') next.receiptId = assertCanonicalId(evidence.receiptId, 'evidence.receiptId');
  if (nextState === 'CLOSED') {
    invariant(current.receiptId, 'decision cannot close without a persisted receipt');
    invariant(current.postcondition?.verified === true, 'decision cannot close without verified postcondition');
  }

  next.state = nextState;
  next.history.push({ state: nextState, at });
  return next;
}

export function validateInstitutionalEvent(input) {
  const value = requireObject(input, 'institutional event');
  invariant(value.specversion === '1.0', 'event specversion must be CloudEvents 1.0');
  invariant(value.schemaVersion === INSTITUTIONAL_SCHEMA_VERSION, 'event schemaVersion mismatch');
  requireString(value.id, 'event.id');
  requireString(value.type, 'event.type');
  requireString(value.source, 'event.source');
  requireIsoTime(value.time, 'event.time');
  requireEnum(value.category, EVENT_CATEGORIES, 'event.category');
  assertCanonicalId(value.producerId, 'event.producerId');
  assertCanonicalId(value.actorId, 'event.actorId');
  assertCanonicalId(value.affectedEntityId, 'event.affectedEntityId');
  requireString(value.correlationId, 'event.correlationId');
  if (value.causationId != null) requireString(value.causationId, 'event.causationId');
  requireString(value.sensitivity, 'event.sensitivity');
  requireString(value.retentionClass, 'event.retentionClass');
  requireArray(value.evidenceRefs || [], 'event.evidenceRefs');
  requireString(value.idempotencyKey, 'event.idempotencyKey');
  requireEnum(value.replayClassification, REPLAY_CLASSIFICATIONS, 'event.replayClassification');
  requireObject(value.data ?? {}, 'event.data');
  return value;
}

export function recordEventDelivery(event, deliveryState) {
  validateInstitutionalEvent(event);
  const state = requireObject(deliveryState, 'deliveryState');
  invariant(state.eventIds instanceof Set && state.idempotencyKeys instanceof Set, 'deliveryState must contain eventIds and idempotencyKeys Sets');
  if (state.eventIds.has(event.id) || state.idempotencyKeys.has(event.idempotencyKey)) {
    return { accepted: false, reason: 'DUPLICATE' };
  }
  state.eventIds.add(event.id);
  state.idempotencyKeys.add(event.idempotencyKey);
  return { accepted: true, reason: 'FIRST_DELIVERY' };
}

export function assertReplayAllowed(event, options = {}) {
  validateInstitutionalEvent(event);
  if (event.replayClassification === 'NO_REPLAY') throw new Error('event replay forbidden');
  if (event.replayClassification === 'COMPENSATED_REPLAY') {
    invariant(options.compensationVerified === true, 'compensated replay requires verified compensation boundary');
  }
  return true;
}

export function classifyEventFailure({ retryable, attempt, maxAttempts }) {
  requireBoolean(retryable, 'retryable');
  invariant(Number.isInteger(attempt) && attempt >= 1, 'attempt must be a positive integer');
  invariant(Number.isInteger(maxAttempts) && maxAttempts >= 1, 'maxAttempts must be a positive integer');
  if (!retryable || attempt >= maxAttempts) return 'DEAD_LETTER';
  return 'RETRY';
}

export function validateEvidenceReceipt(input) {
  const value = requireObject(input, 'evidence receipt');
  invariant(value.schemaVersion === EVIDENCE_RECEIPT_SCHEMA_VERSION, 'evidence receipt schemaVersion mismatch');
  assertCanonicalId(value.evidenceId, 'evidenceId');
  requireString(value.capability, 'capability');
  requireString(value.source, 'source');
  requireString(value.environment, 'environment');
  requireString(value.exactVersion, 'exactVersion');
  requireString(value.authoritativeSource, 'authoritativeSource');
  assertCanonicalId(value.actorId, 'actorId');
  requireIsoTime(value.observedAt, 'observedAt');
  requireArray(value.implementationEvidence || [], 'implementationEvidence');
  requireArray(value.testEvidence || [], 'testEvidence');
  requireArray(value.authorizationEvidence || [], 'authorizationEvidence');
  requireArray(value.observabilityEvidence || [], 'observabilityEvidence');
  requireArray(value.recoveryEvidence || [], 'recoveryEvidence');
  requireArray(value.artifactRefs || [], 'artifactRefs');
  requireArray(value.providerReceiptIds || [], 'providerReceiptIds');
  requireArray(value.hashes || [], 'hashes');
  requireArray(value.limitations || [], 'limitations');
  requireString(value.documentationRef, 'documentationRef');
  requireString(value.verificationResult, 'verificationResult');
  requireEnum(value.productionAcceptanceStatus, ['NOT_APPLICABLE', 'PENDING', 'REJECTED', 'ACCEPTED'], 'productionAcceptanceStatus');
  if (value.policyDecisionId != null) assertCanonicalId(value.policyDecisionId, 'policyDecisionId');
  return value;
}

export function assertRequiredEvidencePersisted({ required, persisted }) {
  requireBoolean(required, 'required');
  requireBoolean(persisted, 'persisted');
  if (required && !persisted) throw new Error('fail-closed: required evidence was not persisted');
  return true;
}

export function transitionKillSwitch(currentLevel, targetLevel, authorization = {}) {
  requireEnum(currentLevel, KILL_SWITCH_LEVELS, 'currentLevel');
  requireEnum(targetLevel, KILL_SWITCH_LEVELS, 'targetLevel');
  requireBoolean(authorization.authorized, 'authorization.authorized');
  invariant(authorization.authorized, 'kill-switch transition requires explicit authority');
  const currentIndex = KILL_SWITCH_LEVELS.indexOf(currentLevel);
  const targetIndex = KILL_SWITCH_LEVELS.indexOf(targetLevel);
  if (targetIndex < currentIndex) {
    invariant(authorization.restorationAuthorized === true, 'restoration requires separate explicit authority');
  }
  return targetLevel;
}

export function writesAllowedAtKillSwitchLevel(level) {
  requireEnum(level, KILL_SWITCH_LEVELS, 'level');
  return KILL_SWITCH_LEVELS.indexOf(level) < KILL_SWITCH_LEVELS.indexOf('ENVIRONMENT_WRITE_FREEZE');
}
