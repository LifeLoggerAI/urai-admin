import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/app/api/admin/invalidate-foundation-config-cache/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  .replace(/^import[\s\S]*?from ['"][^'"]+['"];\n/gm, '').replace(/^export /gm, '');

function fixture({ deniedStatus, isActive = true, canonicalRole = 'admin', failAudit = false } = {}) {
  const writes = [];
  const guardCalls = [];
  const refs = path => ({ path, update: async value => writes.push({ path, value }) });
  class AdminAuthError extends Error { constructor(message, status) { super(message); this.status = status; } }
  const firestore = {
    doc: refs,
    collection: name => ({ doc: id => refs(`${name}/${id ?? 'audit'}`), add: async value => {
      if (failAudit) throw new Error('audit unavailable'); writes.push({ path: `${name}/audit`, value });
    } }),
    runTransaction: async callback => {
      const pending = [];
      await callback({
        get: async ref => ({ exists: true, data: () => ref.path.startsWith('adminUsers/') ? { isActive, role: canonicalRole } : {} }),
        update: (ref, value) => pending.push({ path: ref.path, value }),
        create: (ref, value) => { if (failAudit) throw new Error('audit unavailable'); pending.push({ path: ref.path, value }); },
      });
      writes.push(...pending);
    },
  };
  const context = vm.createContext({
    NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200, headers: options?.headers }) },
    firestore, AdminAuthError, console: { error: () => {} },
    auth: () => ({ verifyIdToken: async () => ({ admin: true, uid: 'stale-body-token' }) }),
    requireAdminMutationSession: async (_request, roles) => {
      guardCalls.push(Array.from(roles));
      if (deniedStatus) throw new AdminAuthError('denied', deniedStatus);
      return { uid: 'canonical-actor', role: 'admin', email: 'actor@example.invalid' };
    },
    adminAuthErrorResponse: error => ({ status: error.status ?? 401, headers: { 'Cache-Control': 'no-store' } }),
  });
  vm.runInContext(`${compiled}\nthis.post = POST;`, context);
  return { post: context.post, writes, guardCalls };
}

const request = { json: async () => ({ idToken: 'a-client-token-cannot-authorize-this-route' }) };
for (const deniedStatus of [401, 403]) {
  test(`cache invalidation rejects canonical session/origin denial (${deniedStatus}) before writes`, async () => {
    const f = fixture({ deniedStatus }); const result = await f.post(request);
    assert.equal(result.status, deniedStatus);
    assert.equal(f.writes.length, 0);
    assert.deepEqual(f.guardCalls, [['owner', 'admin']]);
    assert.equal(result.headers['Cache-Control'], 'no-store');
  });
}

for (const canonical of [{ isActive: false }, { canonicalRole: 'viewer' }]) {
  test(`cache invalidation rechecks ${canonical.isActive === false ? 'offboarding' : 'role changes'} inside the write transaction`, async () => {
    const f = fixture(canonical); const result = await f.post(request);
    assert.equal(result.status, 403);
    assert.equal(f.writes.length, 0);
  });
}

test('cache invalidation and its required audit commit atomically', async () => {
  const f = fixture(); const result = await f.post(request);
  assert.equal(result.status, 200);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.deepEqual(f.writes.map(row => row.path), ['foundationConfig/config', 'auditLogs/audit']);
  assert.equal(f.writes[1].value.actorUid, 'canonical-actor');
  assert.equal(f.writes[1].value.action, 'invalidateFoundationConfigCache');
});

test('audit failure leaves the configuration untouched', async () => {
  const f = fixture({ failAudit: true }); const result = await f.post(request);
  assert.equal(result.status, 500);
  assert.equal(f.writes.length, 0);
});
