#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { verifyAdminPackagedSource } from './assert-admin-packaged-source.mjs';

function fixture(run) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'urai-admin-packaging-'));
  const put = (relative, content) => {
    const filename = path.join(root, relative);
    mkdirSync(path.dirname(filename), { recursive: true });
    writeFileSync(filename, content);
  };
  const appPkg = { name: 'fixture-admin', scripts: { build: 'next build --profile', test: 'node --test' }, dependencies: { next: '15.5.27' } };
  const canonical = 'apps/urai-admin/';
  const packaged = 'functions/.generated/urai-admin/';
  const runtime = "const packagedNextAppDir = join(__dirname, '..', '.generated', 'urai-admin');\nconst nextApp = next({ dev: isDev, dir: packagedNextAppDir });";
  put('functions/src/index.ts', runtime);
  put('functions/tsconfig.active.json', JSON.stringify({ files: ['src/index.ts'] }));
  put('functions/package.json', JSON.stringify({ main: 'lib/index.js' }));
  put('firebase.json', JSON.stringify({ hosting: { source: 'apps/urai-admin', rewrites: [{ source: '**', function: 'nextServer' }] } }));
  put(canonical + 'package.json', JSON.stringify(appPkg));
  put(packaged + 'package.json', JSON.stringify({ ...appPkg, scripts: { ...appPkg.scripts, build: 'next build' } }));
  for (const p of [canonical, packaged]) {
    put(p + 'src/lib/admin/require-admin-session.ts', 'session authority fixture');
    put(p + 'src/app/api/admin/collection/route.ts', 'filtered collection fixture');
    put(p + 'next.config.js', 'module.exports = { reactStrictMode: true }');
    put(p + '.next/BUILD_ID', 'fake-next-build');
  }
  try { return run({ root, put, canonical, packaged }); }
  finally { rmSync(root, { recursive: true, force: true }); }
}

test('identical canonical and generated source verifies without requiring legacy mirror parity', () => fixture(({ root, put }) => {
  put('functions/apps/urai-admin/src/lib/admin/require-admin-session.ts', 'old insecure legacy mirror - intentionally different');
  const result = verifyAdminPackagedSource({ cwd: root });
  assert.equal(result.filesVerified, 3);
  assert.ok(result.bytesVerified > 0);
}));

test('modified packaged Admin authority is rejected', () => fixture(({ root, put, packaged }) => {
  put(packaged + 'src/lib/admin/require-admin-session.ts', 'weaker authority');
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /source differs/);
}));

test('modified packaged security headers are rejected', () => fixture(({ root, put, packaged }) => {
  put(packaged + 'next.config.js', 'module.exports = {}');
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /source differs/);
}));

test('missing generated source is rejected', () => fixture(({ root, packaged }) => {
  rmSync(path.join(root, packaged, 'src/app/api/admin/collection/route.ts'));
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /paths must exactly match/);
}));

test('extra stale generated source is rejected', () => fixture(({ root, put, packaged }) => {
  put(packaged + 'src/app/api/admin/unexpected/route.ts', 'stale endpoint');
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /paths must exactly match/);
}));

test('stale Next build identity is rejected', () => fixture(({ root, put, packaged }) => {
  put(packaged + '.next/BUILD_ID', 'stale-next-build');
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /build must match/);
}));

test('Functions entrypoint reverting to tracked legacy mirror is rejected', () => fixture(({ root, put }) => {
  put('functions/src/index.ts', "const packagedNextAppDir = join(__dirname, '..', 'apps', 'urai-admin');\nconst nextApp = next({ dev: isDev, dir: packagedNextAppDir });");
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /generated Admin runtime/);
}));

test('Firebase Hosting source redirection is rejected', () => fixture(({ root, put }) => {
  put('firebase.json', JSON.stringify({ hosting: { source: 'functions/apps/urai-admin', rewrites: [{ source: '**', function: 'nextServer' }] } }));
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /canonical Admin source/);
}));

test('packaged symlinked source file is rejected', () => fixture(({ root, packaged }) => {
  const canonical = path.join(root, 'apps/urai-admin/src/lib/admin/require-admin-session.ts');
  const target = path.join(root, packaged, 'src/lib/admin/require-admin-session.ts');
  rmSync(target);
  symlinkSync(canonical, target);
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /Symlink is not permitted/);
}));

test('unexpected packaged package.json scripts or dependencies are rejected', () => fixture(({ root, put, packaged }) => {
  put(packaged + 'package.json', JSON.stringify({ name: 'fixture-admin', scripts: { build: 'next build' }, dependencies: { next: 'bad-version' } }));
  assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /package.json must differ only/);
}));
