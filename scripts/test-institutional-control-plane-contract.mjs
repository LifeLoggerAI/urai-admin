#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  INSTITUTIONAL_SCHEMA_VERSION,
  EVIDENCE_RECEIPT_SCHEMA_VERSION,
  createAuthorizationDecision,
  assertEffectfulExecutionAuthorized,
  createDecisionObject,
  transitionDecision,
  validateInstitutionalEvent,
  recordEventDelivery,
  assertReplayAllowed,
  classifyEventFailure,
  validateEvidenceReceipt,
  assertRequiredEvidencePersisted,
  transitionKillSwitch,
  writesAllowedAtKillSwitchLevel,
} from './institutional-control-plane-contract.mjs';

const now = '2026-09-12T23:59:00.000Z';
const later = '2026-09-13T00:05:00.000Z';
const id = (kind, suffix) => `${kind}_${suffix.padEnd(12, '0')}`;

const authRequest = {
  schemaVersion: INSTITUTIONAL_SCHEMA_VERSION,
  requestId: id('req', 'abc123'),
  principal: { id: id('person', 'adam123'), workloadIdentityId: id('workload', 'gha123') },
  institutionalRole: 'steward',
  legalEntityId: id('entity', 'labs123'),
  resource: { id: id('repo', 'admin123'), type: 'repository' },
  action: 'write_branch', capability: 'repository_change', environment: 'development', dataClass: 'internal',
  amount: null, counterpartyId: null, riskClass: 'LOW', reversibility: 'REVERSIBLE', maximumAutonomy: 'L3',
  expiresAt: '2026-09-13T01:00:00.000Z',
  approvalRequirements: { required: false, approvers: [], quorum: 0, separationOfDuties: false },
  evidenceObligations: ['commit_sha', 'test_result'], emergencyMode: false,
};

const permit = createAuthorizationDecision(authRequest, 'PERMIT', { policyVersion: 'policy-2026-09-12', decidedAt: now, reasons: ['low-risk reversible branch write'] });
assert.equal(assertEffectfulExecutionAuthorized(authRequest, permit, later), true);
assert.throws(() => assertEffectfulExecutionAuthorized(authRequest, { ...permit, result: 'DENY' }, later), /forbidden/);
assert.throws(() => assertEffectfulExecutionAuthorized(authRequest, { ...permit, result: 'REQUIRES_APPROVAL' }, later), /forbidden/);
assert.throws(() => assertEffectfulExecutionAuthorized({ ...authRequest, expiresAt: '2026-09-12T23:00:00.000Z' }, permit, later), /expired/);
assert.throws(() => createAuthorizationDecision({ ...authRequest, approvalRequirements: { required: true, approvers: ['steward'], quorum: 1, separationOfDuties: true } }, 'PERMIT', { policyVersion: 'p1', decidedAt: now, reasons: [] }), /fail-closed/);

let decision = createDecisionObject({
  decisionId: id('decision', 'launch123'), requestedAction: 'publish candidate', principalId: id('person', 'adam123'), resourceId: id('release', 'candidate1'),
  rationale: 'bounded release decision', alternatives: ['hold'], evidenceRefs: ['evd-1'],
  exposures: { financial: 'LOW', legal: 'LOW', privacy: 'LOW', security: 'LOW', safety: 'LOW' },
  blastRadius: 'single release candidate', reversibility: 'REVERSIBLE', deadline: null, expiresAt: null,
  requiredAuthority: 'release steward + independent reviewer',
  requiredApprovers: { identities: [id('person', 'reviewer1')], quorum: 1, separationOfDuties: true }, emergencyOverride: null, requestedAt: now,
});
assert.throws(() => transitionDecision(decision, 'CLOSED', { at: later }), /invalid decision transition/);
assert.throws(() => transitionDecision(decision, 'AUTHORIZED', { at: later, approvals: [] }), /quorum/);
decision = transitionDecision(decision, 'AUTHORIZED', { at: later, approvals: [{ principalId: id('person', 'reviewer1'), evidenceRef: 'review-1' }] });
assert.throws(() => transitionDecision(decision, 'EXECUTED', { at: later, execution: { principalId: id('person', 'reviewer1'), reference: 'run-1' } }), /separation of duties/);
decision = transitionDecision(decision, 'EXECUTED', { at: later, execution: { principalId: id('person', 'executor1'), reference: 'run-1' } });
assert.throws(() => transitionDecision(decision, 'POSTCONDITION_VERIFIED', { at: later, postcondition: { verified: false, reference: 'check-1' } }), /positively verified/);
decision = transitionDecision(decision, 'POSTCONDITION_VERIFIED', { at: later, postcondition: { verified: true, reference: 'check-1' } });
decision = transitionDecision(decision, 'RECEIPT_PERSISTED', { at: later, receiptId: id('evidence', 'receipt1') });
decision = transitionDecision(decision, 'CLOSED', { at: later });
assert.equal(decision.state, 'CLOSED');

let denied = createDecisionObject({ decisionId: id('decision', 'deny123'), requestedAction: 'unsafe change', principalId: id('person', 'adam123'), resourceId: id('repo', 'admin123'), rationale: 'negative path', alternatives: [], evidenceRefs: [], exposures: {}, blastRadius: 'institution', reversibility: 'IRREVERSIBLE', deadline: null, expiresAt: null, requiredAuthority: 'steward', requiredApprovers: { identities: [], quorum: 0, separationOfDuties: false }, requestedAt: now });
denied = transitionDecision(denied, 'DENIED', { at: later, reason: 'policy denied' });
assert.throws(() => transitionDecision(denied, 'EXECUTED', { at: later }), /invalid decision transition/);

const event = { specversion: '1.0', schemaVersion: INSTITUTIONAL_SCHEMA_VERSION, id: 'evt-001', type: 'urai.registry.changed.v1', source: 'urn:urai:admin', time: now, category: 'DOMAIN', producerId: id('service', 'admin123'), actorId: id('workload', 'gha123'), affectedEntityId: id('system', 'registry1'), correlationId: 'corr-1', causationId: null, sensitivity: 'internal', retentionClass: 'institutional-evidence', evidenceRefs: ['evd-1'], idempotencyKey: 'registry-change:001', replayClassification: 'SAFE_REPLAY', data: { count: 1 } };
assert.equal(validateInstitutionalEvent(event), event);
const deliveryState = { eventIds: new Set(), idempotencyKeys: new Set() };
assert.equal(recordEventDelivery(event, deliveryState).accepted, true);
assert.equal(recordEventDelivery(event, deliveryState).reason, 'DUPLICATE');
assert.equal(assertReplayAllowed(event), true);
assert.throws(() => assertReplayAllowed({ ...event, replayClassification: 'NO_REPLAY', id: 'evt-002', idempotencyKey: 'irreversible:1' }), /forbidden/);
assert.throws(() => assertReplayAllowed({ ...event, replayClassification: 'COMPENSATED_REPLAY', id: 'evt-003', idempotencyKey: 'compensated:1' }), /compensation/);
assert.equal(assertReplayAllowed({ ...event, replayClassification: 'COMPENSATED_REPLAY', id: 'evt-004', idempotencyKey: 'compensated:2' }, { compensationVerified: true }), true);
assert.throws(() => validateInstitutionalEvent({ ...event, schemaVersion: 'future-v2' }), /schemaVersion mismatch/);
assert.equal(classifyEventFailure({ retryable: true, attempt: 1, maxAttempts: 3 }), 'RETRY');
assert.equal(classifyEventFailure({ retryable: true, attempt: 3, maxAttempts: 3 }), 'DEAD_LETTER');
assert.equal(classifyEventFailure({ retryable: false, attempt: 1, maxAttempts: 3 }), 'DEAD_LETTER');

const receipt = { schemaVersion: EVIDENCE_RECEIPT_SCHEMA_VERSION, evidenceId: id('evidence', 'receipt1'), capability: 'institutional authority contract', source: 'urai-admin', environment: 'development', exactVersion: 'sha-placeholder', authoritativeSource: 'GitHub exact commit', actorId: id('workload', 'gha123'), observedAt: now, policyDecisionId: id('decision', 'launch123'), implementationEvidence: ['module'], testEvidence: ['contract-test'], authorizationEvidence: ['branch-only'], observabilityEvidence: ['test-output'], recoveryEvidence: ['revertible branch'], documentationRef: 'docs/INSTITUTIONAL_CONTROL_PLANE_CONTRACT.md', artifactRefs: [], providerReceiptIds: [], hashes: [], verificationResult: 'PASS', productionAcceptanceStatus: 'PENDING', limitations: ['not yet merged or deployed'] };
assert.equal(validateEvidenceReceipt(receipt), receipt);
assert.equal(assertRequiredEvidencePersisted({ required: true, persisted: true }), true);
assert.throws(() => assertRequiredEvidencePersisted({ required: true, persisted: false }), /fail-closed/);
assert.equal(transitionKillSwitch('NORMAL', 'AGENT_DISABLE', { authorized: true, restorationAuthorized: false }), 'AGENT_DISABLE');
assert.throws(() => transitionKillSwitch('AGENT_DISABLE', 'NORMAL', { authorized: true, restorationAuthorized: false }), /restoration/);
assert.equal(transitionKillSwitch('AGENT_DISABLE', 'NORMAL', { authorized: true, restorationAuthorized: true }), 'NORMAL');
assert.equal(writesAllowedAtKillSwitchLevel('CAPABILITY_DISABLE'), true);
assert.equal(writesAllowedAtKillSwitchLevel('ENVIRONMENT_WRITE_FREEZE'), false);
console.log('institutional control-plane contract: PASS');
