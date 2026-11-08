import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

// Exact production session source is transpiled; Firebase, HTTP, audit and
// clock dependencies are synthetic. No live credentials or cloud requests.
const sourceUrl = new URL('../src/lib/admin/require-admin-session.ts', import.meta.url);
const filename = fileURLToPath(sourceUrl);
const source = readFileSync(sourceUrl, 'utf8');
const transpiled = ts.transpileModule(source, {
  fileName: filename,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  reportDiagnostics: true,
});
assert.deepEqual((transpiled.diagnostics ?? []).filter((x) => x.category === ts.DiagnosticCategory.Error), []);

function fixture({
  member = { isActive: true, role: 'owner', roleVersion: 3 },
  account = { uid: 'synthetic-owner', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 3 } },
  token = { uid: 'synthetic-owner', admin: true, role: 'owner', roleVersion: 3, auth_time: Math.floor(Date.now() / 1000), email: 'owner@example.invalid' },
} = {}) {
  const calls = { cookies: 0, audits: 0, writes: 0, verify: 0, account: 0 };
  const auth = {
    async verifyIdToken() { calls.verify++; return token; },
    async getUser() { calls.account++; return account; },
    async createSessionCookie() { calls.cookies++; return 'synthetic-cookie'; },
  };
  const firestore = { collection(name) {
    assert.equal(name, 'adminUsers');
    return { doc(uid) {
      assert.equal(uid, token.uid);
      return { async get() { return { exists: true, data: () => member }; },
        async set() { calls.writes++; } };
    } };
  } };
  const responseJson = (body, options = {}) => {
    const output = { status: options.status ?? 200, body,
      cookies: { set() { calls.cookies++; } } };
    return output;
  };
  const module = { exports: {} };
  const fakeRequire = (name) => {
    if (name === 'next/server') return { NextResponse: { json: responseJson } };
    if (name === 'zod') return { z: {
      object() { return { parse(value) { return value; } }; },
      string() { return { min() { return {}; } }; },
      ZodError: class extends Error {},
    } };
    if (name === '@/lib/firebase/admin') return { auth, firestore,
      async writeRequiredAuditLog() { calls.audits++; } };
    throw new Error('Unexpected dependency: ' + name);
  };
  const runModule = vm.runInThisContext(
    '(function(exports,require,module,__filename,__dirname){' + transpiled.outputText + '\n})',
    { filename },
  );
  runModule(module.exports, fakeRequire, module, filename, fileURLToPath(new URL('../src/lib/admin/', import.meta.url)));
  const request = {
    method: 'POST', nextUrl: { origin: 'http://127.0.0.1:3000' },
    headers: { get(name) { return name === 'origin' ? 'http://127.0.0.1:3000' : name === 'sec-fetch-site' ? 'same-origin' : null; } },
    async json() { return { idToken: 'synthetic-id-token' }; },
  };
  return { calls, run: () => module.exports.exchangeAdminIdToken(request, 'auth.login') };
}

test('matching versioned account and membership exchanges a session', async () => {
  const f = fixture();
  const response = await f.run();
  assert.equal(response.status, 200);
  assert.equal(f.calls.cookies, 2);
  assert.equal(f.calls.audits, 1);
});

for (const [name, override, expected] of [
  ['pending role mutation', { member: { isActive: true, role: 'owner', roleVersion: 3, roleMutation: { id: 'pending' } } }, 403],
  ['pending active mutation', { member: { isActive: true, role: 'owner', roleVersion: 3, activeMutation: { id: 'pending' } } }, 403],
  ['disabled Auth user', { account: { uid: 'synthetic-owner', disabled: true, customClaims: { admin: true, role: 'owner', roleVersion: 3 } } }, 409],
  ['current Auth roleVersion mismatch', { account: { uid: 'synthetic-owner', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 4 } } }, 409],
  ['signed token roleVersion mismatch', { token: { uid: 'synthetic-owner', admin: true, role: 'owner', roleVersion: 2, auth_time: Math.floor(Date.now() / 1000) } }, 409],
  ['wrong current UID', { account: { uid: 'other', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 3 } } }, 409],
]) {
  test('session exchange fails closed on ' + name, async () => {
    const f = fixture(override);
    const response = await f.run();
    assert.equal(response.status, expected);
    assert.equal(f.calls.cookies, 0);
    assert.equal(f.calls.writes, 0);
  });
}
