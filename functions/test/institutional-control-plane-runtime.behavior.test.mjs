import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import { createDecisionObject, transitionDecision as transitionContractDecision } from '../../scripts/institutional-control-plane-contract.mjs';

// Executes the actual source module. Only the Firestore transport is replaced;
// this is local behavioral evidence, not a cloud/emulator operation receipt.
const source = await readFile(new URL('../src/institutionalControlPlane.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.equal((compiled.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0);
const { createInstitutionalControlPlaneStore, writesAllowedAtKillSwitchLevel } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`
);

function createDatabase() {
  const records = new Map();
  const snapshot = (path) => ({ exists: records.has(path), data: () => records.has(path) ? structuredClone(records.get(path)) : undefined });
  const reference = (path) => ({ path, get: async () => snapshot(path), collection: (name) => collection(`${path}/${name}`) });
  const collection = (path) => ({ doc: (id) => reference(`${path}/${id}`) });
  return {
    records,
    collection,
    async runTransaction(callback) {
      const pending = new Map();
      let writesStarted = false;
      const result = await callback({
        get: async (ref) => { assert.equal(writesStarted, false, 'Firestore requires all reads before writes'); return snapshot(ref.path); },
        set: (ref, value) => { writesStarted = true; pending.set(ref.path, structuredClone(value)); },
      });
      for (const [path, value] of pending) records.set(path, value);
      return result;
    },
  };
}

const at = '2026-10-08T08:00:00.000Z';
const principalA = 'person_reviewer1000';
const principalB = 'person_reviewer2000';
const executor = 'person_executor1000';

function decision(suffix = 'ordinary') {
  return createDecisionObject({
    decisionId: `decision_${suffix.padEnd(12, '0')}`,
    requestedAction: 'Prepare internal operational evidence',
    principalId: executor,
    resourceId: 'release_test10000000',
    rationale: 'Non-consequential controlled local demonstration',
    blastRadius: 'local in-memory test',
    reversibility: 'REVERSIBLE',
    requiredAuthority: 'Two distinct approved reviewers',
    requiredApprovers: { identities: [principalA, principalB], quorum: 2, separationOfDuties: true },
    requestedAt: at,
  });
}

test('contract quorum cannot be satisfied by repeated approval from one principal', () => {
  assert.throws(() => transitionContractDecision(decision('contract'), 'AUTHORIZED', {
    at, approvals: [{ principalId: principalA, evidenceRef: 'review-1' }, { principalId: principalA, evidenceRef: 'review-2' }],
  }), /duplicate approval principal|quorum/);
});

test('actual persisted runtime rejects duplicate principals without authorizing or partially writing', async () => {
  const db = createDatabase(); const store = createInstitutionalControlPlaneStore(db); const item = decision('runtime');
  await store.persistDecision(item);
  const before = structuredClone([...db.records]);
  await assert.rejects(store.transitionDecision(item.decisionId, 'AUTHORIZED', {
    at, approvals: [{ principalId: principalA, evidenceRef: 'review-1' }, { principalId: principalA, evidenceRef: 'review-2' }],
  }), /duplicate approval principal|quorum/);
  assert.deepEqual([...db.records], before);
});

test('distinct admitted approvals authorize; same reviewer cannot execute; valid executor retains a closed evidence receipt', async () => {
  const db = createDatabase(); const store = createInstitutionalControlPlaneStore(db); const item = decision('complete');
  await store.persistDecision(item);
  await store.transitionDecision(item.decisionId, 'AUTHORIZED', {
    at, approvals: [{ principalId: principalA, evidenceRef: 'review-1' }, { principalId: principalB, evidenceRef: 'review-2' }],
  });
  await assert.rejects(store.transitionDecision(item.decisionId, 'EXECUTED', { at, execution: { principalId: principalA, reference: 'task-1' } }), /separation of duties/);
  await store.transitionDecision(item.decisionId, 'EXECUTED', { at, execution: { principalId: executor, reference: 'task-1' } });
  await assert.rejects(store.transitionDecision(item.decisionId, 'POSTCONDITION_VERIFIED', { at, postcondition: { verified: false, reference: 'check-1' } }), /positively verified/);
  await store.transitionDecision(item.decisionId, 'POSTCONDITION_VERIFIED', { at, postcondition: { verified: true, reference: 'check-1' } });
  await assert.rejects(store.transitionDecision(item.decisionId, 'RECEIPT_PERSISTED', { at, receiptId: 'evidence_missing1000' }), /does not exist/);
  await store.persistEvidenceReceipt({ schemaVersion: 'urai-evidence-receipt-1', evidenceId: 'evidence_complete100', verificationResult: 'PASS', policyDecisionId: item.decisionId });
  await store.transitionDecision(item.decisionId, 'RECEIPT_PERSISTED', { at, receiptId: 'evidence_complete100' });
  assert.equal((await store.transitionDecision(item.decisionId, 'CLOSED', { at })).state, 'CLOSED');
  assert.equal([...db.records.values()].find((x) => x.decisionId === item.decisionId && x.state)?.state, 'CLOSED');
});

test('unauthorized and missing approval principals fail before persistence', async () => {
  for (const approvals of [
    [{ principalId: principalA }, { principalId: 'person_foreign1000' }],
    [{ principalId: principalA }, {}],
    [{ principalId: principalA }],
  ]) {
    const db = createDatabase(); const store = createInstitutionalControlPlaneStore(db); const item = decision('denied');
    await store.persistDecision(item); const before = structuredClone([...db.records]);
    await assert.rejects(store.transitionDecision(item.decisionId, 'AUTHORIZED', { at, approvals }), /unauthorized principal|principalId|quorum/);
    assert.deepEqual([...db.records], before);
  }
});

test('kill switch defaults to freeze and restoration needs separate authority', async () => {
  const db = createDatabase(); const store = createInstitutionalControlPlaneStore(db);
  assert.equal((await store.getKillSwitchState()).level, 'ENVIRONMENT_WRITE_FREEZE');
  assert.equal((await store.readRuntimeReadiness({ projectIdentityPresent: true, revisionPresent: true })).ready, false);
  await assert.rejects(store.transitionKillSwitch('NORMAL', { authorized: true, restorationAuthorized: false, actorId: executor, reason: 'test recovery' }), /separately authorized/);
  await store.transitionKillSwitch('NORMAL', { authorized: true, restorationAuthorized: true, actorId: executor, reason: 'test-only authorized restoration' });
  assert.equal((await store.readRuntimeReadiness({ projectIdentityPresent: true, revisionPresent: true })).ready, true);
  await store.transitionKillSwitch('ENVIRONMENT_WRITE_FREEZE', { authorized: true, restorationAuthorized: false, actorId: executor, reason: 'controlled stop' });
  assert.equal(writesAllowedAtKillSwitchLevel((await store.getKillSwitchState()).level), false);
  assert.equal((await store.readRuntimeReadiness({ projectIdentityPresent: true, revisionPresent: true })).ready, false);
  assert.equal([...db.records.keys()].filter((path) => path.startsWith('institutionalKillSwitchTransitions/')).length, 2);
});
