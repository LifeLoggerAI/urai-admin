import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

// Compile the REAL protected-session source into an isolated test module.
// Neither Firebase credentials nor network access are used.
const sourceUrl = new URL('../src/lib/admin/require-admin-session.ts', import.meta.url);
const filename = fileURLToPath(sourceUrl);
const source = readFileSync(sourceUrl, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  fileName: filename,
  reportDiagnostics: true,
});
const diagnostics = (transpiled.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
assert.deepEqual(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')), []);

function harness({
  token = { uid: 'proof-owner', email: 'proof@urai.invalid', admin: true, role: 'owner', roleVersion: 2 },
  account = { uid: 'proof-owner', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 2 } },
  member = { role: 'owner', isActive: true, roleVersion: 2 },
  getUserError = null,
} = {}) {
  const count = { cookie: 0, account: 0, membership: 0 };
  const auth = {
    async verifySessionCookie() { count.cookie++; return token; },
    async getUser() { count.account++; if (getUserError) throw getUserError; return account; },
  };
  const firestore = {
    collection(collection) {
      assert.equal(collection, 'adminUsers');
      return {
        doc(uid) {
          assert.equal(uid, token.uid);
          return {
            async get() {
              count.membership++;
              return { exists: true, data: () => member };
            },
          };
        },
      };
    },
  };
  function fakeRequire(name) {
    if (name === 'next/server') {
      return { NextResponse: { json() { throw new Error('Unexpected HTTP response'); } } };
    }
    if (name === 'zod') {
      return { z: { object() { return { parse() { throw new Error('Unexpected session exchange'); } }; },
        string() { return { min() { return {}; } }; }, ZodError: class ZodError extends Error {} } };
    }
    if (name === '@/lib/firebase/admin') {
      return { auth, firestore, writeRequiredAuditLog() { throw new Error('Unexpected audit write'); } };
    }
    throw new Error('Unexpected import: ' + name);
  }
  const module = { exports: {} };
  const wrapper = vm.runInThisContext(
    '(function(exports,require,module,__filename,__dirname){' + transpiled.outputText + '\n})',
    { filename },
  );
  wrapper(module.exports, fakeRequire, module, filename, fileURLToPath(new URL('../src/lib/admin/', import.meta.url)));
  const request = { cookies: { get(name) { assert.equal(name, '__session'); return { value: 'synthetic-cookie' }; } } };
  return { count, run: () => module.exports.requireAdminSession(request, ['owner', 'admin', 'viewer']) };
}

async function denied(title, args, status, expectedReads = 0) {
  await test(title, async () => {
    const f = harness(args);
    await assert.rejects(f.run, (e) => e?.status === status);
    assert.equal(f.count.membership, expectedReads, 'denial must occur before a privileged Firestore lookup');
  });
}

test('current signed owner claims and canonical role permit protected read', async () => {
  const f = harness();
  const result = await f.run();
  assert.equal(result.uid, 'proof-owner');
  assert.equal(result.role, 'owner');
  assert.equal(f.count.account, 1);
  assert.equal(f.count.membership, 1);
});

await denied('current Auth admin:false blocks old signed owner cookie', {
  account: { uid: 'proof-owner', disabled: false, customClaims: { admin: false, role: 'owner', roleVersion: 2 } },
}, 403);
await denied('current Auth role downgrade blocks old owner cookie', {
  account: { uid: 'proof-owner', disabled: false, customClaims: { admin: true, role: 'viewer', roleVersion: 2 } },
}, 403);
await denied('current Auth role incarnation mismatch blocks old cookie', {
  account: { uid: 'proof-owner', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 3 } },
}, 403);
await denied('missing current Auth custom claims denies privileged read', {
  account: { uid: 'proof-owner', disabled: false, customClaims: undefined },
}, 403);
await denied('disabled current Auth account denies privileged read', {
  account: { uid: 'proof-owner', disabled: true, customClaims: { admin: true, role: 'owner', roleVersion: 2 } },
}, 403);
await denied('different current Auth UID denies privileged read', {
  account: { uid: 'different-user', disabled: false, customClaims: { admin: true, role: 'owner', roleVersion: 2 } },
}, 403);
await denied('deleted Auth account maps to unauthorized without privileged read', {
  getUserError: Object.assign(new Error('synthetic missing user'), { code: 'auth/user-not-found' }),
}, 401);

test('Auth infrastructure failures fail closed without becoming successful reads', async () => {
  const f = harness({ getUserError: new Error('synthetic backend unavailable') });
  await assert.rejects(f.run, /synthetic backend unavailable/);
  assert.equal(f.count.membership, 0);
});

test('stale cookie admin:false is denied before current account lookup', async () => {
  const f = harness({ token: { uid: 'proof-owner', admin: false, role: 'owner', roleVersion: 2 } });
  await assert.rejects(f.run, (e) => e?.status === 403);
  assert.equal(f.count.account, 0);
  assert.equal(f.count.membership, 0);
});
