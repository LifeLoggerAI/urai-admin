import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire, registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

// Actual executor and canonical reauthorization run. Firestore/Auth transports
// and the Next request/response facade are explicit local doubles. The loaded
// emulator receipt separately exercises the actual Next route and Firebase SDK.
const source = await readFile(new URL('../../apps/urai-admin/src/lib/admin/execute-institutional-feature-flag.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.equal((compiled.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0);
const sessionSource = await readFile(new URL('../../apps/urai-admin/src/lib/admin/require-admin-session.ts', import.meta.url), 'utf8');
const sessionCompiled = ts.transpileModule(sessionSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.equal((sessionCompiled.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0);
const routeSource = await readFile(new URL('../../apps/urai-admin/src/app/api/admin/set-flag/route.ts', import.meta.url), 'utf8');
const routeCompiled = ts.transpileModule(routeSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.equal((routeCompiled.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0);
const executorUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
const sessionUrl = `data:text/javascript;base64,${Buffer.from(sessionCompiled.outputText).toString('base64')}`;
// Resolve the guard's declared application dependency, not a different workspace
// Zod version that happens to be visible from the Functions test directory.
const require = createRequire(new URL('../../apps/urai-admin/package.json', import.meta.url));
const zodUrl = pathToFileURL(require.resolve('zod')).href;
const hooks = registerHooks({ resolve(specifier, context, next) {
  if (specifier === '@/lib/firebase/admin') {
    return { url: 'data:text/javascript,export const firestore = globalThis.__uraiOperationalTestDatabase; export const auth = globalThis.__uraiOperationalTestAuth; export const writeRequiredAuditLog = async () => { throw new Error("unexpected audit exchange"); };', shortCircuit: true };
  }
  if (specifier === '@/lib/admin/execute-institutional-feature-flag') return { url: executorUrl, shortCircuit: true };
  if (specifier === '@/lib/admin/require-admin-session') return { url: sessionUrl, shortCircuit: true };
  if (specifier === 'next/server') return { url: 'data:text/javascript,export class NextRequest {}; export class NextResponse { static json(body, options) { return { body, ...options }; } }', shortCircuit: true };
  if (specifier === 'zod') return { url: zodUrl, shortCircuit: true };
  return next(specifier, context);
} });

function database() {
  const records = new Map();
  const snapshot = (path) => ({ exists: records.has(path), data: () => records.has(path) ? structuredClone(records.get(path)) : undefined });
  const reference = (path) => ({ path, get: async () => {
    if (db.readFailure && path.startsWith('adminUsers/')) throw db.readFailure;
    return snapshot(path);
  }, collection: (name) => collection(`${path}/${name}`) });
  const collection = (path) => ({ doc: (id) => reference(`${path}/${id}`) });
  return {
    records, collection, transactionCount: 0, afterCommit: undefined, readFailure: undefined,
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
const sdk = { user: null, signed: null, revoked: false, afterUserRead: undefined, checks: 0,
  verificationFailure: undefined, verificationFailureAt: 1, accountReadFailure: undefined };
const firebaseError = code => Object.assign(new Error('owned synthetic authentication failure'), { code });
globalThis.__uraiOperationalTestAuth = {
  async verifySessionCookie(cookie, checkRevoked) {
    assert.equal(cookie, 'owned-local-session'); assert.equal(checkRevoked, true); sdk.checks += 1;
    if (sdk.verificationFailure && sdk.checks === sdk.verificationFailureAt) throw sdk.verificationFailure;
    if (sdk.revoked) throw firebaseError('auth/session-cookie-revoked');
    if (!sdk.user) throw firebaseError('auth/user-not-found');
    if (sdk.user.disabled) throw firebaseError('auth/user-disabled');
    return structuredClone(sdk.signed);
  },
  async getUser(uid) {
    if (sdk.accountReadFailure) throw sdk.accountReadFailure;
    if (!sdk.user || sdk.user.uid !== uid) throw firebaseError('auth/user-not-found');
    const user = structuredClone(sdk.user); sdk.afterUserRead?.(); return user;
  },
};
const { executeInstitutionalFeatureFlag } = await import(executorUrl);
const { AdminAuthError, revalidateAdminMutationSession } = await import(sessionUrl);
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(routeCompiled.outputText).toString('base64')}`);
hooks.deregister(); delete globalThis.__uraiOperationalTestDatabase; delete globalThis.__uraiOperationalTestAuth;

const request = {
  method: 'POST', nextUrl: new URL('http://127.0.0.1:3000/api/admin/set-flag'),
  headers: new Headers({ origin: 'http://127.0.0.1:3000', 'sec-fetch-site': 'same-origin' }),
  cookies: { get: name => name === '__session' ? { value: 'owned-local-session' } : undefined },
};

const input = {
  actor: { uid: 'test-owner', role: 'owner', roleVersion: 0 },
  operationId: 'local-non-consequential-flag-task', flagId: 'local-test-flag', enabled: true,
  revalidateActor: () => revalidateAdminMutationSession(request, input.actor),
};

function reset(level) {
  db.records.clear(); db.transactionCount = 0; db.afterCommit = undefined; db.readFailure = undefined;
  db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner', roleVersion: 0 });
  sdk.user = { uid: 'test-owner', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 0 } };
  sdk.signed = { uid: 'test-owner', admin: true, role: 'owner', roleVersion: 0 };
  sdk.revoked = false; sdk.afterUserRead = undefined; sdk.checks = 0;
  sdk.verificationFailure = undefined; sdk.verificationFailureAt = 1; sdk.accountReadFailure = undefined;
  if (level) db.records.set('institutionalControlState/global', { level, version: 1 });
}

for (const code of ['auth/argument-error', 'auth/session-cookie-expired', 'auth/session-cookie-revoked', 'auth/user-disabled', 'auth/user-not-found']) {
  test(code + ' from session verification remains a typed caller authentication failure', async () => {
    reset('NORMAL'); sdk.verificationFailure = firebaseError(code);
    const before = structuredClone([...db.records]);
    await assert.rejects(executeInstitutionalFeatureFlag(input), error => error instanceof AdminAuthError && error.status === 401);
    assert.deepEqual([...db.records], before);
  });
}

for (const [name, fail] of [
  ['datastore transport unavailable', () => { db.readFailure = Object.assign(new Error('owned datastore outage'), { code: 14, status: 503 }); return db.readFailure; }],
  ['datastore status401 without an authentication code', () => { db.readFailure = Object.assign(new Error('owned datastore failure'), { status: 401 }); return db.readFailure; }],
  ...['auth/internal-error', 'auth/insufficient-permission', 'auth/invalid-credential', 'auth/project-not-found'].map(code => [code + ' from initial verification', () => { sdk.verificationFailure = firebaseError(code); return sdk.verificationFailure; }]),
  ['unknown verification transport failure', () => { sdk.verificationFailure = new Error('owned transport outage'); return sdk.verificationFailure; }],
  ['auth/internal-error from final verification', () => { sdk.verificationFailure = firebaseError('auth/internal-error'); sdk.verificationFailureAt = 2; return sdk.verificationFailure; }],
  ['auth/internal-error from current account read', () => { sdk.accountReadFailure = firebaseError('auth/internal-error'); return sdk.accountReadFailure; }],
  ['argument-error from account read is not an invalid cookie', () => { sdk.accountReadFailure = firebaseError('auth/argument-error'); return sdk.accountReadFailure; }],
]) {
  test(name + ' preserves the backend error without writes', async () => {
    reset('NORMAL'); const expected = fail(); const before = structuredClone([...db.records]);
    await assert.rejects(executeInstitutionalFeatureFlag(input), error => error === expected);
    assert.deepEqual([...db.records], before);
  });
}

test('deleted account observed only during fresh account read returns a typed401 without writes', async () => {
  reset('NORMAL'); sdk.accountReadFailure = firebaseError('auth/user-not-found');
  const before = structuredClone([...db.records]);
  await assert.rejects(executeInstitutionalFeatureFlag(input), error => error instanceof AdminAuthError && error.status === 401);
  assert.deepEqual([...db.records], before);
});

test('reauthorization preserves the existing trusted-origin403', async () => {
  reset('NORMAL');
  const crossSite = { ...request, headers: new Headers({ origin: 'http://127.0.0.1:3000', 'sec-fetch-site': 'cross-site' }) };
  await assert.rejects(revalidateAdminMutationSession(crossSite, input.actor), error => error instanceof AdminAuthError && error.status === 403);
  assert.equal(sdk.checks, 0);
});

test('reauthorization preserves configured-origin service503', async () => {
  reset('NORMAL'); const previous = process.env.URAI_ADMIN_ALLOWED_ORIGINS;
  process.env.URAI_ADMIN_ALLOWED_ORIGINS = 'owned-invalid-origin';
  try {
    await assert.rejects(revalidateAdminMutationSession(request, input.actor), error => error instanceof AdminAuthError && error.status === 503);
    assert.equal(sdk.checks, 0);
  } finally {
    if (previous === undefined) delete process.env.URAI_ADMIN_ALLOWED_ORIGINS;
    else process.env.URAI_ADMIN_ALLOWED_ORIGINS = previous;
  }
});

test('backend failure after reservation retains its exact authorized decision without flag effect', async () => {
  reset('NORMAL'); const expected = firebaseError('auth/internal-error');
  db.afterCommit = count => { if (count === 1) sdk.accountReadFailure = expected; };
  await assert.rejects(executeInstitutionalFeatureFlag(input), error => error === expected);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  assert.equal([...db.records.values()].find(x => x.decisionId && x.state)?.state, 'AUTHORIZED');
  assert.equal([...db.records.keys()].some(p => p.startsWith('auditLogs/') || p.startsWith('institutionalEvidenceReceipts/')), false);
});

for (const [name, fail] of [
  ['datastore outage', () => { db.readFailure = Object.assign(new Error('private backend details'), { code: 14 }); }],
  ['Auth service failure', () => { sdk.verificationFailure = firebaseError('auth/internal-error'); }],
  ['current account service failure', () => { sdk.accountReadFailure = firebaseError('auth/internal-error'); }],
]) {
  test('actual consuming route returns sanitized500 for ' + name, async () => {
    reset('NORMAL'); fail(); const before = structuredClone([...db.records]);
    const messages = []; const original = console.error; console.error = (...args) => messages.push(args);
    try {
      const result = await POST({ ...request, json: async () => ({ operationId: '57591f05-ff6d-47bb-9470-2fb80c3e13c0', flagId: input.flagId, enabled: true }) });
      assert.equal(result.status, 500);
      assert.deepEqual(result.body, { success: false, error: 'Failed to update feature flag' });
      assert.equal(result.headers['Cache-Control'], 'no-store');
      assert.deepEqual(messages, [['Failed to update feature flag']]);
      assert.deepEqual([...db.records], before);
    } finally { console.error = original; }
  });
}

test('actual consuming route retains revoked-session401 without backend logging', async () => {
  reset('NORMAL'); sdk.revoked = true; const messages = []; const original = console.error;
  console.error = (...args) => messages.push(args);
  try {
    const result = await POST({ ...request, json: async () => assert.fail('revoked requests never parse a mutation') });
    assert.equal(result.status, 401); assert.equal(result.headers['Cache-Control'], 'no-store');
    assert.deepEqual(messages, []); assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  } finally { console.error = original; }
});

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
  assert.doesNotMatch(JSON.stringify([...db.records]), /owned-local-session|revalidateActor/);
  const before = structuredClone([...db.records]);
  assert.equal((await executeInstitutionalFeatureFlag(input)).duplicate, true);
  assert.deepEqual([...db.records], before);
});

test('viewer, missing kill switch and frozen state deny effectful task without writes', async () => {
  reset('NORMAL'); await assert.rejects(executeInstitutionalFeatureFlag({ ...input, actor: { uid: 'test-viewer', role: 'viewer' } }), /owner or admin authority/);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  reset(); const unconfigured = structuredClone([...db.records]);
  await assert.rejects(executeInstitutionalFeatureFlag(input), /not configured/); assert.deepEqual([...db.records], unconfigured);
  reset('ENVIRONMENT_WRITE_FREEZE'); const before = structuredClone([...db.records]);
  await assert.rejects(executeInstitutionalFeatureFlag(input), /frozen/); assert.deepEqual([...db.records], before);
});

for (const [name, withdraw] of [
  ['inactive membership', () => db.records.set('adminUsers/test-owner', { isActive: false, role: 'owner', roleVersion: 0 })],
  ['withdrawn member role', () => db.records.set('adminUsers/test-owner', { isActive: true, role: 'viewer', roleVersion: 1 })],
  ['deleted membership', () => db.records.delete('adminUsers/test-owner')],
  ['same-role incarnation', () => db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner', roleVersion: 1 })],
  ['pending role mutation', () => db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner', roleVersion: 0, roleMutation: { id: 'local-pending' } })],
  ['pending active mutation', () => db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner', roleVersion: 0, activeMutation: { id: 'local-pending' } })],
  ['disabled Auth account', () => { sdk.user.disabled = true; }],
  ['deleted Auth account', () => { sdk.user = null; }],
  ['revoked original session', () => { sdk.revoked = true; }],
  ['withdrawn current Auth admin claim', () => { sdk.user.customClaims.admin = false; }],
  ['changed current Auth incarnation', () => { sdk.user.customClaims.roleVersion = 1; }],
]) {
  test(name + ' after reservation denies flag effect and retains the authorized decision', async () => {
    reset('NORMAL');
    db.afterCommit = count => { if (count === 1) withdraw(); };
    await assert.rejects(executeInstitutionalFeatureFlag(input), /authority changed|Unauthorized|Forbidden/);
    assert.equal(db.records.has('featureFlags/local-test-flag'), false);
    assert.equal([...db.records.values()].find(x => x.decisionId && x.state)?.state, 'AUTHORIZED');
    assert.equal([...db.records.keys()].some(p => p.startsWith('institutionalEvidenceReceipts/')), false);
    assert.equal([...db.records.keys()].some(p => p.startsWith('auditLogs/')), false);
  });
}

test('withdrawal after effect prevents publication/closure and retains exact committed audit for controlled recovery', async () => {
  reset('NORMAL'); db.afterCommit = count => { if (count === 2) sdk.revoked = true; };
  await assert.rejects(executeInstitutionalFeatureFlag(input), /Unauthorized/);
  assert.equal(db.records.get('featureFlags/local-test-flag').enabled, true);
  assert.equal([...db.records.values()].find(x => x.decisionId && x.state)?.state, 'EXECUTED');
  assert.equal([...db.records.keys()].filter(p => p.startsWith('auditLogs/')).length, 1);
  assert.equal([...db.records.keys()].some(p => p.startsWith('institutionalEvidenceReceipts/') || p.startsWith('institutionalEvents/')), false);
});

test('revocation during current account read is checked again with the original session', async () => {
  reset('NORMAL'); sdk.afterUserRead = () => { sdk.revoked = true; };
  await assert.rejects(executeInstitutionalFeatureFlag(input), /Unauthorized/);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  assert.equal(db.records.has('institutionalControlState/global'), true);
  assert.equal([...db.records.keys()].some(p => p.startsWith('institutionalDecisions/')), false);
  assert.equal(sdk.checks, 2);
});

test('legacy absent versions retain canonical zero behavior without claims repair', async () => {
  reset('NORMAL'); delete sdk.signed.roleVersion; delete sdk.user.customClaims.roleVersion;
  db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner' });
  assert.equal((await executeInstitutionalFeatureFlag(input)).success, true);
  assert.equal(sdk.user.customClaims.roleVersion, undefined);
  assert.equal(db.records.get('adminUsers/test-owner').roleVersion, undefined);
});

test('malformed positive membership version denies execution rather than becoming legacy zero', async () => {
  reset('NORMAL'); db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner', roleVersion: '1' });
  await assert.rejects(executeInstitutionalFeatureFlag(input), /Invalid.*authority version/);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
});

const hash = value => createHash('sha256').update(value).digest('hex');
for (const state of ['CLOSED', 'AUTHORIZED', 'EXECUTED']) {
  test('legacy ' + state + ' operation with an unbound predecessor fingerprint fails closed after incarnation change', async () => {
    reset('NORMAL');
    sdk.signed.roleVersion = 1; sdk.user.customClaims.roleVersion = 1;
    db.records.set('adminUsers/test-owner', { isActive: true, role: 'owner', roleVersion: 1 });
    const currentInput = { ...input, actor: { ...input.actor, roleVersion: 1 } };
    currentInput.revalidateActor = () => revalidateAdminMutationSession(request, currentInput.actor);
    // Exact base448 fingerprint fields; the predecessor did not bind role/version.
    const oldRequest = { actorUid: input.actor.uid, operationId: input.operationId, flagId: input.flagId, enabled: input.enabled, rollout: 'PRESERVE' };
    const oldFingerprint = hash(JSON.stringify(Object.fromEntries(Object.entries(oldRequest).sort(([a], [b]) => a.localeCompare(b)))));
    const decisionId = 'admin-feature-flag:' + input.operationId;
    const path = 'institutionalDecisions/' + hash('decision\u0000' + decisionId);
    db.records.set(path, { schemaVersion: 'urai-institutional-control-plane-1', decisionId, state, requestFingerprint: oldFingerprint });
    const before = structuredClone([...db.records]);
    await assert.rejects(executeInstitutionalFeatureFlag(currentInput), error => error.status === 409 && /controlled reconciliation/.test(error.message));
    assert.deepEqual([...db.records], before);
  });
}

test('kill switch changed after reservation stops actual mutation and retains recoverable decision', async () => {
  reset('NORMAL');
  db.afterCommit = (count) => { if (count === 1) db.records.set('institutionalControlState/global', { level: 'ENVIRONMENT_WRITE_FREEZE', version: 2 }); };
  await assert.rejects(executeInstitutionalFeatureFlag(input), /frozen/);
  assert.equal(db.records.has('featureFlags/local-test-flag'), false);
  assert.equal([...db.records.values()].find((x) => x.decisionId && x.state)?.state, 'AUTHORIZED');
  assert.equal([...db.records.keys()].some((p) => p.startsWith('institutionalEvidenceReceipts/')), false);
});
