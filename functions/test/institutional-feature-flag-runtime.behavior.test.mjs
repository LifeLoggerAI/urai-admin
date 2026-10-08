import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

// The production task implementation runs; only its Firestore transport is a
// transactional local double. These receipts do not claim deployed automation.
const source = await readFile(new URL('../../apps/urai-admin/src/lib/admin/execute-institutional-feature-flag.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.equal((compiled.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0);
const hooks = registerHooks({ resolve(specifier, context, next) {
  if (specifier === '@/lib/firebase/admin') {
    return { url: 'data:text/javascript,export const firestore = globalThis.__uraiOperationalTestDatabase;', shortCircuit: true };
  }
  return next(specifier, context);
} });

function database() {
  const records = new Map();
  const snapshot = (path) => ({ exists: records.has(path), data: () => records.has(path) ? structuredClone(records.get(path)) : undefined });
  const reference = (path) => ({ path, get: async () => snapshot(path), collection: (name) => collection(`${path}/${name}`) });
  const collection = (path) => ({ doc: (id) => reference(`${path}/${id}`) });
  return {
    records, collection, transactionCount: 0, afterCommit: undefined,
    async runTransaction(callback) {
      const pending = new Map(); let writesStarted = false;
      const result = await callback({
        get: async (ref) => { assert.equal(writesStarted, false, 'all reads precede writes'); return snapshot(ref.path); },
        set: (ref, value, options) => {
          writesStarted = true;
          pending.set(ref.path, structuredClone(options?.merge ? { ...(records.get(ref.path) ?? {}), ...value } : value));
        },
      });
      for (const [path, value] of pending) records.set(path, value);
      this.transactionCount += 1;
      this.afterCommit?.(this.transactionCount);
      return result;
    },
  };
}

const db = database(); globalThis.__uraiOperationalTestDatabase = db;
const { executeInstitutionalFeatureFlag } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
hooks.deregister(); delete globalThis.__uraiOperationalTestDatabase;

const input = {
  actor: { uid: 'test-owner', role: 'owner' },
  operationId: 'local-non-consequential-flag-task', flagId: 'local-test-flag', enabled: true,
};

function reset(level) {
  db.records.clear(); db.transactionCount = 0; db.afterCommit = undefined;
  if (level) db.records.set('institutionalControlState/global', { level, version: 1 });
}

test('authorized reversible task persists flag, postcondition, event and closed decision; duplicate is idempotent', async () => {
  reset('NORMAL');
  const result = await executeInstitutionalFeatureFlag(input);
  assert.equal(result.success, true); assert.equal(result.duplicate, false);
  assert.equal(db.records.get('featureFlags/local-test-flag').enabled, true);
  const decision = [...db.records.values()].find((x) => x.decisionId === result.decisionId && x.state);
  assert.equal(decision.state, 'CLOSED');
  assert.deepEqual(decision.history.map((x) => x.state), ['REQUESTED', 'AUTHORIZED', 'EXECUTED', 'POSTCONDITION_VERIFIED', 'RECEIPT_PERSISTED', 'CLOSED']);
  const receipt = [...db.records.values()].find((x) => x.evidenceId === result.evidenceId && x.verificationResult);
  assert.equal(receipt.verificationResult, 'PASS'); assert.equal(receipt.postcondition.observed.enabled, true);
  assert.equal([...db.records.keys()].filter((p) => p.startsWith('institutionalEvents/')).length, 1);
  const before = structuredClone([...db.records]);
  assert.equal((await executeInstitutionalFeatureFlag(input)).duplicate, true);
  assert.deepEqual([...db.records], before);
});

test('viewer, missing kill switch and frozen state deny effectful task without writes', async () => {
  reset('NORMAL'); await assert.rejects(executeInstitutionalFeatureFlag({ ...input, actor: { uid: 'test-viewer', role: 'viewer' } }), /owner or admin authority/);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  reset(); await assert.rejects(executeInstitutionalFeatureFlag(input), /not configured/); assert.equal(db.records.size, 0);
  reset('ENVIRONMENT_WRITE_FREEZE'); const before = structuredClone([...db.records]);
  await assert.rejects(executeInstitutionalFeatureFlag(input), /frozen/); assert.deepEqual([...db.records], before);
});

test('kill switch changed after reservation stops actual mutation and retains recoverable decision', async () => {
  reset('NORMAL');
  db.afterCommit = (count) => { if (count === 1) db.records.set('institutionalControlState/global', { level: 'ENVIRONMENT_WRITE_FREEZE', version: 2 }); };
  await assert.rejects(executeInstitutionalFeatureFlag(input), /frozen/);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  assert.equal([...db.records.values()].find((x) => x.decisionId && x.state)?.state, 'AUTHORIZED');
  assert.equal([...db.records.keys()].some((p) => p.startsWith('institutionalEvidenceReceipts/')), false);
});
