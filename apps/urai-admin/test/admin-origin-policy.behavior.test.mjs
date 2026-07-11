#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const sourceUrl = new URL('../src/lib/admin/require-admin-session.ts', import.meta.url);
const filename = fileURLToPath(sourceUrl);
const source = await readFile(sourceUrl, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
  fileName: filename,
  reportDiagnostics: true,
});

const diagnostics = (transpiled.diagnostics ?? []).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
assert.equal(
  diagnostics.length,
  0,
  `admin origin policy transpilation failed: ${diagnostics
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    .join('; ')}`,
);

const module = { exports: {} };
const fakeZ = {
  ZodError: class ZodError extends Error {},
  object() {
    return { parse() { throw new Error('zod parse is not used by origin policy tests'); } };
  },
  string() {
    return { min() { return {}; } };
  },
};

function fakeRequire(specifier) {
  if (specifier === 'next/server') {
    return {
      NextRequest: class NextRequest {},
      NextResponse: {
        json() {
          throw new Error('NextResponse.json is not used by origin policy tests');
        },
      },
    };
  }
  if (specifier === 'zod') return { z: fakeZ };
  if (specifier === '@/lib/firebase/admin') {
    return { auth: {}, firestore: {}, writeAuditLog: async () => {} };
  }
  throw new Error(`Unexpected dependency while loading admin origin policy: ${specifier}`);
}

const wrapper = vm.runInThisContext(
  `(function (exports, require, module, __filename, __dirname) {${transpiled.outputText}\n})`,
  { filename },
);
wrapper(module.exports, fakeRequire, module, filename, fileURLToPath(new URL('../src/lib/admin/', import.meta.url)));

const { AdminAuthError, requireSameOrigin } = module.exports;
assert.equal(typeof requireSameOrigin, 'function', 'requireSameOrigin must remain exported');
assert.equal(typeof AdminAuthError, 'function', 'AdminAuthError must remain exported');

const ENV_KEYS = [
  'NODE_ENV',
  'URAI_ADMIN_PRODUCTION_URL',
  'URAI_ADMIN_ALLOWED_ORIGINS',
  'URAI_ADMIN_BASE_URL',
];

function withEnv(values, callback) {
  const previous = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try {
    return callback();
  } finally {
    for (const key of ENV_KEYS) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

function request({
  method = 'POST',
  origin = null,
  fetchSite = null,
  requestOrigin = 'https://admin.example',
  forwardedHost = null,
  forwardedProto = null,
} = {}) {
  const headers = new Map([
    ['origin', origin],
    ['sec-fetch-site', fetchSite],
    ['x-forwarded-host', forwardedHost],
    ['x-forwarded-proto', forwardedProto],
  ]);
  return {
    method,
    nextUrl: { origin: requestOrigin },
    headers: {
      get(name) {
        return headers.get(String(name).toLowerCase()) ?? null;
      },
    },
  };
}

const passed = [];
function expectAllowed(name, env, req) {
  withEnv(env, () => assert.doesNotThrow(() => requireSameOrigin(req), name));
  passed.push(name);
}

function expectRejected(name, env, req, status, message) {
  withEnv(env, () => {
    assert.throws(
      () => requireSameOrigin(req),
      (error) => error instanceof AdminAuthError
        && error.status === status
        && error.message === message,
      name,
    );
  });
  passed.push(name);
}

expectAllowed(
  'safe GET bypasses mutation-origin enforcement',
  { NODE_ENV: 'production' },
  request({ method: 'GET' }),
);
expectAllowed(
  'configured HTTPS production origin is accepted and normalized',
  { NODE_ENV: 'production', URAI_ADMIN_PRODUCTION_URL: 'https://admin.example/login?source=gate' },
  request({ origin: 'https://admin.example', fetchSite: 'same-origin' }),
);
expectAllowed(
  'comma-separated protected production origin is accepted',
  {
    NODE_ENV: 'production',
    URAI_ADMIN_PRODUCTION_URL: 'https://admin.example',
    URAI_ADMIN_ALLOWED_ORIGINS: ' https://ops.example/path , https://admin-backup.example ',
  },
  request({ origin: 'https://ops.example' }),
);
expectRejected(
  'production fails closed without configured origin authority',
  { NODE_ENV: 'production' },
  request({ origin: 'https://admin.example' }),
  503,
  'Admin origin allowlist is not configured',
);
expectRejected(
  'production rejects malformed configured origins',
  { NODE_ENV: 'production', URAI_ADMIN_PRODUCTION_URL: 'not a url' },
  request({ origin: 'https://admin.example' }),
  503,
  'Admin origin allowlist contains an invalid URL',
);
expectRejected(
  'production rejects non-HTTPS configured origins',
  { NODE_ENV: 'production', URAI_ADMIN_PRODUCTION_URL: 'http://admin.example' },
  request({ origin: 'http://admin.example' }),
  503,
  'Production admin origins must use HTTPS',
);
expectRejected(
  'mutation requires an Origin header',
  { NODE_ENV: 'production', URAI_ADMIN_PRODUCTION_URL: 'https://admin.example' },
  request({ origin: null }),
  403,
  'Origin header required',
);
expectRejected(
  'cross-site browser metadata is rejected even for an allowed origin',
  { NODE_ENV: 'production', URAI_ADMIN_PRODUCTION_URL: 'https://admin.example' },
  request({ origin: 'https://admin.example', fetchSite: 'cross-site' }),
  403,
  'Cross-site admin request rejected',
);
expectRejected(
  'request-derived and forwarded host values cannot create production authority',
  { NODE_ENV: 'production', URAI_ADMIN_PRODUCTION_URL: 'https://admin.example' },
  request({
    origin: 'https://evil.example',
    requestOrigin: 'https://evil.example',
    forwardedHost: 'admin.example',
    forwardedProto: 'https',
  }),
  403,
  'Admin request origin is not allowed',
);
expectAllowed(
  'development accepts the exact loopback request origin',
  { NODE_ENV: 'development' },
  request({ origin: 'http://localhost:3000', requestOrigin: 'http://localhost:3000' }),
);
expectAllowed(
  'development accepts the exact IPv6 loopback request origin',
  { NODE_ENV: 'development' },
  request({ origin: 'http://[::1]:3000', requestOrigin: 'http://[::1]:3000' }),
);
expectRejected(
  'development does not trust a non-loopback request origin by default',
  { NODE_ENV: 'development' },
  request({ origin: 'https://evil.example', requestOrigin: 'https://evil.example' }),
  403,
  'Admin request origin is not allowed',
);
expectRejected(
  'development loopback trust is exact-origin rather than wildcard-port trust',
  { NODE_ENV: 'development' },
  request({ origin: 'http://localhost:4000', requestOrigin: 'http://localhost:3000' }),
  403,
  'Admin request origin is not allowed',
);
expectAllowed(
  'non-production smoke target may be explicitly configured',
  { NODE_ENV: 'test', URAI_ADMIN_BASE_URL: 'https://admin-staging.example/smoke' },
  request({ origin: 'https://admin-staging.example', requestOrigin: 'https://runner.invalid' }),
);

console.log(`[PASS] admin origin policy behavior (${passed.length} cases)`);
