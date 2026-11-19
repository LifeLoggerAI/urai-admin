'use strict';
/**
 * R1559 review-only regression tests for the EXACT #122 Mission Coordination source.
 * No host credentials, public endpoint, provider SDK calls, staging, live IAM or
 * real Firestore. This miniature optimistic transaction store is a synthetic
 * contention oracle; only native emulator and two-host staging can prove the
 * actual provider integration.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const requireFromPackage = createRequire(path.resolve(__dirname, '../package.json'));
const ts = require('typescript');
const srcDir = path.resolve(__dirname, '../src');
const cache = new Map();
function loadExactSource(name) {
  if (cache.has(name)) return cache.get(name).exports;
  const code = fs.readFileSync(path.join(srcDir, name), 'utf8');
  const js = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  }).outputText;
  const mod = { exports: {} };
  cache.set(name, mod);
  new Function('require', 'module', 'exports', js)(id => {
    if (id.startsWith('./')) return loadExactSource(id.slice(2) + '.ts');
    if (id === 'firebase-admin/firestore') return {
      FieldValue: { serverTimestamp: () => '__SERVER_TIMESTAMP__' },
    };
    return requireFromPackage(id);
  }, mod, mod.exports);
  return mod.exports;
}
const { InstitutionalMissionCoordination } = loadExactSource('institutionalMissionCoordination.ts');
const { createServerOwnedMissionGrantFence } = loadExactSource('institutionalMissionServerGrantFence.ts');

class Ref {
  constructor(db, path) { this.db = db; this.path = path; }
  doc(id) { return new Ref(this.db, `${this.path}/${id}`); }
  collection(segment) { return new Ref(this.db, `${this.path}/${segment}`); }
  async get() { return this.db.snapshot(this.path); }
}
class OptimisticFirestore {
  constructor(nowMs = 1794905500000) {
    this.nowMs = nowMs;
    this.records = new Map();
    this.versions = new Map();
    this.conflicts = 0;
    this.retries = 0;
    this.commits = 0;
    this.afterRead = null;
    this.barrier = null;
  }
  collection(n) { return new Ref(this, n); }
  snapshot(p) {
    const value = this.records.get(p);
    return {
      exists: value !== undefined,
      data: () => value === undefined ? undefined : structuredClone(value),
      readTime: { toMillis: () => this.nowMs },
    };
  }
  put(p, value) {
    this.records.set(p, structuredClone(value));
    this.versions.set(p, (this.versions.get(p) || 0) + 1);
  }
  get(p) { return structuredClone(this.records.get(p)); }
  holdTwoReads(path) {
    let unlock;
    const promise = new Promise(resolve => { unlock = resolve; });
    this.barrier = { path, seen: 0, release: unlock, promise };
  }
  async runTransaction(fn) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const readVersions = new Map(), writes = [];
      const tx = {
        get: async ref => {
          const p = ref.path;
          if (!readVersions.has(p)) readVersions.set(p, this.versions.get(p) || 0);
          const snapshot = this.snapshot(p);
          if (this.afterRead) this.afterRead(p, snapshot);
          if (this.barrier?.path === p && this.barrier.seen < 2) {
            this.barrier.seen += 1;
            if (this.barrier.seen === 2) this.barrier.release();
            await this.barrier.promise;
          }
          return snapshot;
        },
        set: (ref, data) => writes.push({ op: 'set', p: ref.path, data }),
        update: (ref, data) => writes.push({ op: 'update', p: ref.path, data }),
      };
      const result = await fn(tx);
      if ([...readVersions].some(([p, version]) => (this.versions.get(p) || 0) !== version)) {
        this.conflicts++;
        this.retries++;
        continue;
      }
      for (const w of writes) {
        if (w.op === 'update' && !this.records.has(w.p)) throw Error('update missing');
        this.put(w.p, { ...(this.records.get(w.p) || {}), ...w.data });
      }
      this.commits++;
      return result;
    }
    throw Error('synthetic optimistic conflict retry limit exceeded');
  }
}
const grantPath = id => `institutionalMissionGrants/${id}`;
const taskPath = id => `institutionalMissionTasks/${id}`;
const receiptPath = (id, kind) => `${taskPath(id)}/receipts/${kind}`;
const workerPath = id => `institutionalMissionWorkers/${id}`;
const roles = {
  OPERATOR: ['REGISTER', 'CREATE'],
  WORKER: ['READ', 'CLAIM', 'HEARTBEAT', 'SUBMIT_EVIDENCE'],
  REVIEWER: ['READ', 'VERIFY'],
};
const taskIds = ['task_alpha', 'task_beta', 'task_race', 'task_other', 'task_child',
  'task_lease', 'task_missing', 'task_tampered', 'task_evidence'];
const revision = 'a'.repeat(40);
const sha256 = 'b'.repeat(64);
const evidenceUrl = 'https://github.com/LifeLoggerAI/urai-admin/pull/122';
function grant(db, id, role, overrides = {}) {
  const g = {
    schema: 'urai-mission-grant-v1', actorId: id, issuer: 'issuer',
    audience: 'audience', tenant: 'tenant', role, status: 'ACTIVE',
    allowedActions: roles[role], taskIds,
    issuedAtMs: db.nowMs - 1000, notBeforeMs: db.nowMs - 1000,
    expiresAtMs: db.nowMs + 300000, revokedAtMs: null, ...overrides,
  };
  db.put(grantPath(id), g);
}
const spec = (id, dedupeKey = id, more = {}) => ({
  taskId: id, sourceRevision: revision, sourceUrl: evidenceUrl,
  taskClass: 'SOURCE_AUDIT', dependencyIds: [], dedupeKey, ...more,
});
async function fixture() {
  const db = new OptimisticFirestore();
  grant(db, 'admin_principal', 'OPERATOR');
  grant(db, 'worker_alpha', 'WORKER');
  grant(db, 'worker_beta', 'WORKER');
  grant(db, 'worker_reviewer', 'REVIEWER');
  const fence = createServerOwnedMissionGrantFence(db, {
    issuer: 'issuer', audience: 'audience', tenant: 'tenant',
  });
  const store = new InstitutionalMissionCoordination(db, async () => true, fence);
  await store.registerWorker('admin_principal', 'worker_alpha', ['SOURCE_AUDIT']);
  await store.registerWorker('admin_principal', 'worker_beta', ['SOURCE_AUDIT']);
  await store.registerWorker('admin_principal', 'worker_reviewer', ['SECURITY_REVIEW']);
  await store.registerTask('admin_principal', spec('task_alpha'));
  return { db, store, fence };
}
const hasNoReceipt = (db, id) => assert.equal(db.records.has(receiptPath(id, 'execution')), false);

test('one winner from genuinely overlapping optimistic task claims', async () => {
  const { db, store } = await fixture();
  db.holdTwoReads(taskPath('task_alpha'));
  const [a, b] = await Promise.all([
    store.claimTask('worker_alpha', 'task_alpha', 10),
    store.claimTask('worker_beta', 'task_alpha', 10),
  ]);
  assert.equal([a, b].filter(Boolean).length, 1);
  assert.equal(db.get(taskPath('task_alpha')).leaseEpoch, 1);
  assert.ok(db.conflicts >= 1, 'the oracle must exercise an actual read-write conflict');
});

test('expired lease takeover advances epoch and denies stale heartbeat/evidence', async () => {
  const { db, store } = await fixture();
  const old = await store.claimTask('worker_alpha', 'task_alpha', 10);
  db.nowMs += 10001;
  const successor = await store.claimTask('worker_beta', 'task_alpha', 10);
  assert.equal(successor.leaseEpoch, old.leaseEpoch + 1);
  assert.equal(await store.heartbeat('worker_alpha', 'task_alpha', old.leaseEpoch), false);
  assert.equal(await store.submitEvidence('worker_alpha', 'task_alpha', old.leaseEpoch, evidenceUrl, sha256), false);
  assert.equal(db.get(taskPath('task_alpha')).leaseOwner, 'worker_beta');
  hasNoReceipt(db, 'task_alpha');
});

test('revocation after grant read forces conflict, retry and zero task writes', async () => {
  const { db, store } = await fixture();
  let injected = false;
  const before = db.get(taskPath('task_alpha'));
  db.afterRead = p => {
    if (p !== grantPath('worker_alpha') || injected) return;
    injected = true;
    db.put(p, { ...db.get(p), status: 'REVOKED', revokedAtMs: db.nowMs });
  };
  await assert.rejects(store.claimTask('worker_alpha', 'task_alpha', 10), /DENY/);
  assert.equal(injected, true);
  assert.ok(db.conflicts >= 1);
  assert.deepEqual(db.get(taskPath('task_alpha')), before);
  hasNoReceipt(db, 'task_alpha');
});

test('duplicate registration is idempotent; conflicting task and dedupe key denied', async () => {
  const { db, store } = await fixture();
  assert.equal((await store.registerTask('admin_principal', spec('task_alpha'))).duplicate, true);
  await assert.rejects(store.registerTask('admin_principal', spec('task_alpha', 'different_key')), /conflicting/);
  const competing = await Promise.allSettled([
    store.registerTask('admin_principal', spec('task_beta', 'same_key')),
    store.registerTask('admin_principal', spec('task_other', 'same_key')),
  ]);
  assert.equal(competing.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal(competing.filter(x => x.status === 'rejected').length, 1);
  assert.ok(db.conflicts >= 1);
  const contenders = [taskPath('task_beta'), taskPath('task_other')];
  assert.equal(contenders.filter(p => db.records.has(p)).length, 1);
});

test('missing, malformed, expired and revoked worker identities deny claims', async () => {
  const { db, store, fence } = await fixture();
  assert.throws(() => new InstitutionalMissionCoordination(db, async () => true, async () => {}), /DENY/);
  assert.throws(() => new InstitutionalMissionCoordination(new OptimisticFirestore(), async () => true, fence), /DENY/);
  await assert.rejects(store.claimTask('invalid/path', 'task_alpha', 10), /invalid workerId|invalid actorId/);
  await assert.rejects(store.claimTask('worker_unknown', 'task_alpha', 10), /DENY/);
  grant(db, 'worker_unknown', 'WORKER');
  await assert.rejects(store.claimTask('worker_unknown', 'task_alpha', 10), /unregistered/);
  const saved = db.get(grantPath('worker_alpha'));
  db.put(grantPath('worker_alpha'), { ...saved, expiresAtMs: db.nowMs });
  await assert.rejects(store.claimTask('worker_alpha', 'task_alpha', 10), /DENY/);
  db.put(grantPath('worker_alpha'), { ...saved, status: 'REVOKED', revokedAtMs: db.nowMs });
  await assert.rejects(store.claimTask('worker_alpha', 'task_alpha', 10), /DENY/);
  hasNoReceipt(db, 'task_alpha');
  assert.equal(db.get(taskPath('task_alpha')).state, 'READY');
});

test('evidence becomes verifying, independent review accepts once, no self-review', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  assert.equal(await store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256), true);
  await assert.rejects(store.verifyEvidence('worker_alpha', 'task_alpha', revision, sha256, 'PASS'), /DENY|independent/);
  await assert.rejects(store.verifyEvidence('worker_reviewer', 'task_alpha', revision, 'c'.repeat(64), 'PASS'), /changed/);
  const accepted = await store.verifyEvidence('worker_reviewer', 'task_alpha', revision, sha256, 'PASS');
  assert.equal(accepted.state, 'ACCEPTED');
  assert.equal(db.get(receiptPath('task_alpha', 'verification')).externalCertification, false);
  await assert.rejects(store.verifyEvidence('worker_reviewer', 'task_alpha', revision, sha256, 'PASS'), /not submitted|already recorded/);
  assert.equal(db.get(taskPath('task_alpha')).state, 'ACCEPTED');
});

test('evidence reviewer grant revoked before verification denies without acceptance', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  await store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256);
  db.put(grantPath('worker_reviewer'), { ...db.get(grantPath('worker_reviewer')), status: 'REVOKED', revokedAtMs: db.nowMs });
  await assert.rejects(store.verifyEvidence('worker_reviewer', 'task_alpha', revision, sha256, 'PASS'), /DENY/);
  assert.equal(db.get(taskPath('task_alpha')).state, 'VERIFYING');
  assert.equal(db.records.has(receiptPath('task_alpha', 'verification')), false);
});

test('fail closed when lease expiry is malformed during heartbeat and evidence submission', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  db.put(taskPath('task_alpha'), { ...db.get(taskPath('task_alpha')), leaseExpiresAtMs: 'nonsense' });
  assert.equal(await store.heartbeat('worker_alpha', 'task_alpha', claim.leaseEpoch, 10), false);
  assert.equal(await store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256), false);
  hasNoReceipt(db, 'task_alpha');
});

test('exact lease expiry instant excludes old worker and permits takeover', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  db.nowMs = claim.expiresAtMs;
  assert.equal(await store.heartbeat('worker_alpha', 'task_alpha', claim.leaseEpoch, 10), false);
  const next = await store.claimTask('worker_beta', 'task_alpha', 10);
  assert.equal(next.leaseEpoch, 2);
  hasNoReceipt(db, 'task_alpha');
});

test('verification rejects an execution receipt inconsistent with task metadata', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  await store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256);
  db.put(receiptPath('task_alpha', 'execution'), { ...db.get(receiptPath('task_alpha', 'execution')), sha256: 'c'.repeat(64) });
  await assert.rejects(store.verifyEvidence('worker_reviewer', 'task_alpha', revision, sha256, 'PASS'), /receipt|changed|integrity|mismatch/);
  assert.equal(db.records.has(receiptPath('task_alpha', 'verification')), false);
});

test('worker registry revoked after transaction read aborts claim and retries', async () => {
  const { db, store } = await fixture();
  let injected = false;
  db.afterRead = p => {
    if (p !== workerPath('worker_alpha') || injected) return;
    injected = true;
    db.put(p, { ...db.get(p), status: 'REVOKED' });
  };
  await assert.rejects(store.claimTask('worker_alpha', 'task_alpha', 10), /unregistered/);
  assert.ok(db.conflicts >= 1);
  assert.equal(db.get(taskPath('task_alpha')).state, 'READY');
});

test('reviewer grant revoked mid-verification transaction cannot commit acceptance', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  await store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256);
  let injected = false;
  db.afterRead = p => {
    if (p !== grantPath('worker_reviewer') || injected) return;
    injected = true;
    db.put(p, { ...db.get(p), status: 'REVOKED', revokedAtMs: db.nowMs });
  };
  await assert.rejects(store.verifyEvidence('worker_reviewer', 'task_alpha', revision, sha256, 'PASS'), /DENY/);
  assert.ok(db.conflicts >= 1);
  assert.equal(db.get(taskPath('task_alpha')).state, 'VERIFYING');
  assert.equal(db.records.has(receiptPath('task_alpha', 'verification')), false);
});

test('two simultaneous submissions persist exactly one execution receipt', async () => {
  const { db, store } = await fixture();
  const claim = await store.claimTask('worker_alpha', 'task_alpha', 10);
  db.holdTwoReads(taskPath('task_alpha'));
  const results = await Promise.all([
    store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256),
    store.submitEvidence('worker_alpha', 'task_alpha', claim.leaseEpoch, evidenceUrl, sha256),
  ]);
  assert.deepEqual(results.sort(), [false, true]);
  assert.ok(db.conflicts >= 1);
  assert.equal(db.get(taskPath('task_alpha')).state, 'VERIFYING');
  assert.equal(db.get(receiptPath('task_alpha', 'execution')).sha256, sha256);
});

test('missing server readTime fails closed without extending a lease', async () => {
  const { db, store } = await fixture();
  const prior = db.snapshot.bind(db);
  db.snapshot = p => {
    const snapshot = prior(p);
    if (p === taskPath('task_alpha')) delete snapshot.readTime;
    return snapshot;
  };
  await assert.rejects(store.claimTask('worker_alpha', 'task_alpha', 10), /server readTime unavailable/);
  assert.equal(db.get(taskPath('task_alpha')).state, 'READY');
});
