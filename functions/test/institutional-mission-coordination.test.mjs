import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const typescript = readFileSync(new URL('../src/institutionalMissionCoordination.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(typescript, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error).length ?? 0, 0);

const loader = { exports: {} };
const mockRequire = (name) => name === 'firebase-admin/firestore'
  ? { FieldValue: { serverTimestamp: () => '__SERVER_TIMESTAMP__' } }
  : require(name);
new Function('require', 'module', 'exports', compiled.outputText)(
  mockRequire, loader, loader.exports,
);
const { InstitutionalMissionCoordination } = loader.exports;

// This fake serializes transactions to exercise the contract only. It is NOT
// a Firestore emulator, network authorization test, multi-host certification,
// server-authoritative timestamp proof or provider admission control.
class Ref {
  constructor(db, path) { this.db = db; this.path = path; }
  collection(segment) { return new Ref(this.db, this.path + '/' + segment); }
  doc(id) { return new Ref(this.db, this.path + '/' + id); }
  async get() { return this.db.snapshot(this.path); }
}
class FakeFirestore {
  data = new Map();
  queue = Promise.resolve();
  collection(name) { return new Ref(this, name); }
  snapshot(path) {
    const value = this.data.get(path);
    return { exists: value !== undefined, data: () => value === undefined ? undefined : structuredClone(value) };
  }
  async runTransaction(fn) {
    // In-memory serialization makes a fixture deterministic. Real Firestore
    // must independently demonstrate optimistic transaction contention.
    const run = this.queue.then(async () => {
      const writes = [];
      const tx = {
        get: async (ref) => this.snapshot(ref.path),
        set: (ref, data) => writes.push({ op: 'set', path: ref.path, data }),
        update: (ref, data) => writes.push({ op: 'update', path: ref.path, data }),
      };
      const result = await fn(tx);
      for (const w of writes) {
        if (w.op === 'update' && !this.data.has(w.path)) throw Error('update missing document');
        this.data.set(w.path, structuredClone({ ...(this.data.get(w.path) || {}), ...w.data }));
      }
      return result;
    });
    this.queue = run.catch(() => {});
    return run;
  }
}

const db = new FakeFirestore();
let time = 1794905500000;
const permitted = async () => true;
const store = new InstitutionalMissionCoordination(db, permitted, () => time);
const deny = new InstitutionalMissionCoordination(db);
const git = 'https://github.com/LifeLoggerAI/urai-admin/pull/114';
const rev = 'a'.repeat(40), hash = 'b'.repeat(64);
const taskA = {
  taskId: 'r1436_source_review', sourceRevision: rev, sourceUrl: git,
  taskClass: 'SOURCE_AUDIT', dependencyIds: [], dedupeKey: 'r1436:review:sha-a',
};
let count = 0;
async function check(label, fn) { await fn(); count++; console.log('PASS', String(count).padStart(2, '0'), label); }

await check('absent authorization denies even read', async () => {
  await assert.rejects(deny.readTask('worker_alpha', taskA.taskId), /DENY/);
});
await check('registration of approved capabilities', async () => {
  await store.registerWorker('admin_principal', 'worker_alpha', ['SOURCE_AUDIT']);
  await store.registerWorker('admin_principal', 'worker_beta', ['SOURCE_AUDIT']);
  await store.registerWorker('admin_principal', 'worker_validator', ['SECURITY_REVIEW']);
});
await check('task registration and dedupe', async () => {
  assert.equal((await store.registerTask('admin_principal', taskA)).duplicate, false);
  assert.equal((await store.registerTask('admin_principal', taskA)).duplicate, true);
});
await check('billable/privileged task classes deny', async () => {
  await assert.rejects(store.registerTask('admin_principal',
    { ...taskA, taskId: 'r1436_gpu_job', dedupeKey: 'gpu', taskClass: 'GPU_PROVISION' }), /unapproved/);
});
await check('untrusted evidence URLs rejected', async () => {
  await assert.rejects(store.registerTask('admin_principal',
    { ...taskA, taskId: 'r1436_untrusted', dedupeKey: 'evil', sourceUrl: 'https://evil.example/submit' }),
  /approved metadata-only origin/);
});
await check('two worker claims produce exactly one winner', async () => {
  globalThis.claims = await Promise.all([
    store.claimTask('worker_alpha', taskA.taskId),
    store.claimTask('worker_beta', taskA.taskId),
  ]);
  assert.equal(globalThis.claims.filter(Boolean).length, 1);
  assert.equal(globalThis.claims.find(Boolean).leaseEpoch, 1);
});
const first = globalThis.claims.find(Boolean);
await check('heartbeat renews active lease', async () => {
  assert.equal(await store.heartbeat(first.workerId, taskA.taskId, first.leaseEpoch), true);
});
await check('expired lease rejects heartbeat and is reclaimable', async () => {
  time += 61000;
  assert.equal(await store.heartbeat(first.workerId, taskA.taskId, first.leaseEpoch), false);
  globalThis.recovered = await store.claimTask(first.workerId === 'worker_alpha' ? 'worker_beta' : 'worker_alpha', taskA.taskId);
  assert.equal(globalThis.recovered.leaseEpoch, 2);
});
await check('old generation cannot submit late evidence', async () => {
  assert.equal(await store.submitEvidence(first.workerId, taskA.taskId, 1, git, hash), false);
});
await check('recovery worker submits exact revision receipt once', async () => {
  assert.equal(await store.submitEvidence(globalThis.recovered.workerId, taskA.taskId, 2, git, hash), true);
  assert.equal((await store.readTask('admin_principal', taskA.taskId)).state, 'VERIFYING');
});
await check('stale duplicate cannot resubmit evidence', async () => {
  assert.equal(await store.submitEvidence(globalThis.recovered.workerId, taskA.taskId, 2, git, hash), false);
});
await check('producer cannot independently accept own evidence', async () => {
  await assert.rejects(store.verifyEvidence(globalThis.recovered.workerId, taskA.taskId, rev, hash, 'PASS'),
    /independent reviewer capability|separation of duties/);
});
await check('exact digest required for independent review', async () => {
  await assert.rejects(store.verifyEvidence('worker_validator', taskA.taskId, rev, 'c'.repeat(64), 'PASS'),
    /changed; verification denied/);
});
await check('distinct reviewer accepts evidence as metadata, not certification', async () => {
  assert.equal((await store.verifyEvidence('worker_validator', taskA.taskId, rev, hash, 'PASS')).state, 'ACCEPTED');
  assert.equal((await store.readTask('admin_principal', taskA.taskId)).state, 'ACCEPTED');
});
await check('dependent task requires accepted predecessor', async () => {
  const child = { taskId: 'r1436_followup_review', sourceRevision: rev, sourceUrl: git,
    taskClass: 'SOURCE_AUDIT', dependencyIds: [taskA.taskId], dedupeKey: 'r1436:child:sha-a' };
  await store.registerTask('admin_principal', child);
  assert.equal((await store.claimTask('worker_alpha', child.taskId)).leaseEpoch, 1);
});
await check('unregistered worker cannot claim work', async () => {
  const child2 = { taskId: 'r1436_blocked_review', sourceRevision: rev, sourceUrl: git,
    taskClass: 'SOURCE_AUDIT', dependencyIds: [], dedupeKey: 'r1436:block:sha-a' };
  await store.registerTask('admin_principal', child2);
  await assert.rejects(store.claimTask('worker_unknown', child2.taskId), /unregistered/);
});
console.log('R1436 SYNTHETIC METADATA CONTRACT', count + '/16 PASS',
 'NOT real Firestore, NOT cross-machine, NOT authorized staging');
