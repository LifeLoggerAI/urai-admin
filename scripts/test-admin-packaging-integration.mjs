import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { verifyAdminPackagedSource } from './assert-admin-packaged-source.mjs';

const SOURCE_SHELL = new URL('./package-next-for-functions.sh', import.meta.url);
const ROOT_CONFIG = new URL('../firebase.json', import.meta.url);
const write = (root, p, content) => {
  const f = path.join(root, p);
  mkdirSync(path.dirname(f), { recursive: true });
  writeFileSync(f, content);
};

function fixture(run) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'urai-r887-real-shell-'));
  const app = 'apps/urai-admin/';
  const staged = 'functions/.generated/urai-admin/';
  write(root, 'firebase.json', readFileSync(ROOT_CONFIG));
  mkdirSync(path.join(root, 'scripts'), { recursive: true });
  cpSync(SOURCE_SHELL, path.join(root, 'scripts/package-next-for-functions.sh'));
  write(root, 'functions/src/index.ts',
    "const packagedNextAppDir = join(__dirname, '..', '.generated', 'urai-admin');\nconst nextApp = next({ dev: isDev, dir: packagedNextAppDir });\n");
  write(root, 'functions/package.json', JSON.stringify({ main: 'lib/index.js' }));
  write(root, 'functions/tsconfig.active.json', JSON.stringify({ files: ['src/index.ts'] }));
  write(root, app + 'package.json', JSON.stringify({
    name: 'fixture-admin', private: true,
    scripts: { build: 'next build --profile', test: 'node --test' },
    dependencies: { next: '15.5.27' },
  }));
  write(root, app + 'next.config.js', 'module.exports = { reactStrictMode:true };\n');
  write(root, app + 'src/lib/admin/require-admin-session.ts', 'real-canonical-admin-source-fixture');
  write(root, app + 'src/app/api/admin/collection/route.ts', 'real-canonical-collection-fixture');
  write(root, app + '.next/BUILD_ID', 'mock-build-R887\n');
  write(root, app + '.next/server/app/index.js', 'mock-compiled-server-R887');
  write(root, app + '.next/static/chunks/admin.js', 'mock-compiled-client-R887');
  write(root, app + '.next/cache/webpack/cache.bin', 'cache should be removed');
  write(root, app + '.next/server/app/index.js.map', 'map should be removed');
  write(root, app + '.next/server/app/old.tsbuildinfo', 'metadata should be removed');
  write(root, 'functions/apps/urai-admin/src/lib/admin/require-admin-session.ts', 'stale legacy role guard');
  const packageShell = () => execFileSync('bash',
    [path.join(root, 'scripts/package-next-for-functions.sh')],
    { encoding: 'utf8', timeout: 15000 });
  try {
    return run({ root, app, staged, packageShell, write: (p, c) => write(root, p, c) });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('exact repository packager produces byte-identical source and compiled Next output', () =>
  fixture(({ root, packageShell }) => {
    const out = packageShell();
    assert.match(out, /OK: Packaged Next build/);
    const info = verifyAdminPackagedSource({ cwd: root });
    assert.equal(info.filesVerified, 3);
    assert.equal(info.compiledFilesVerified, 3);
    assert.ok(info.compiledSha256 && info.sourceSha256);
  }));

test('actual packager strips cache, sourcemaps, and tsbuildinfo from bundled Next output', () =>
  fixture(({ root, staged, packageShell }) => {
    packageShell();
    for (const p of ['.next/cache/webpack/cache.bin', '.next/server/app/index.js.map',
      '.next/server/app/old.tsbuildinfo']) {
      assert.equal(existsSync(path.join(root, staged, p)), false, p);
    }
    assert.equal(verifyAdminPackagedSource({ cwd: root }).compiledFilesVerified, 3);
  }));

test('packaged generated runtime remains isolated from divergent tracked legacy mirror', () =>
  fixture(({ root, packageShell }) => {
    packageShell();
    const result = verifyAdminPackagedSource({ cwd: root });
    assert.ok(result.filesVerified > 0);
    assert.equal(existsSync(path.join(root, 'functions/apps/urai-admin/src/lib/admin/require-admin-session.ts')), true);
    assert.equal(existsSync(path.join(root, 'functions/.generated/urai-admin/apps')), false);
  }));

test('actual packager replaces stale generated files rather than mixing builds', () =>
  fixture(({ root, staged, packageShell, write }) => {
    write(staged + 'src/lib/admin/stale.ts', 'old-stale-code');
    write(staged + '.next/server/app/evil.js', 'old-stale-compiled');
    packageShell();
    assert.equal(existsSync(path.join(root, staged, 'src/lib/admin/stale.ts')), false);
    assert.equal(existsSync(path.join(root, staged, '.next/server/app/evil.js')), false);
    assert.ok(verifyAdminPackagedSource({ cwd: root }).compiledFilesVerified > 0);
  }));

test('guard refuses canonical source changed after packaging', () =>
  fixture(({ root, app, packageShell, write }) => {
    packageShell();
    write(app + 'src/lib/admin/require-admin-session.ts', 'changed-after-build');
    assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /source differs/);
  }));

test('guard refuses staged compiled Next modified after packaging', () =>
  fixture(({ root, staged, packageShell, write }) => {
    packageShell();
    write(staged + '.next/server/app/index.js', 'changed-after-package');
    assert.throws(() => verifyAdminPackagedSource({ cwd: root }), /compiled artifact differs/);
  }));

test('packager fails closed when canonical Next build output is missing', () =>
  fixture(({ root, app, packageShell }) => {
    rmSync(path.join(root, app, '.next'), { recursive: true, force: true });
    assert.throws(packageShell, /Command failed/);
  }));

test('packaging contract keeps generated runtime outside the tracked legacy Functions tree', () =>
  fixture(({ root, staged, packageShell }) => {
    const policy = JSON.parse(readFileSync(ROOT_CONFIG, 'utf8')).functions[0];
    assert.equal(policy.source, 'functions');
    assert.ok(policy.ignore.includes('**/functions/apps'));
    assert.ok(policy.ignore.includes('**/functions/apps/**'));
    assert.ok(policy.ignore.includes('**/functions/test'));
    assert.ok(policy.ignore.includes('**/functions/test/**'));
    assert.ok(policy.ignore.includes('**/functions/logAdminAction.ts'));
    packageShell();
    assert.ok(existsSync(path.join(root, staged, '.next/server/app/index.js')));
    assert.ok(existsSync(path.join(root, 'functions/apps/urai-admin/src/lib/admin/require-admin-session.ts')));
    assert.equal(existsSync(path.join(root, staged, 'apps')), false);
    assert.ok(verifyAdminPackagedSource({ cwd: root }).compiledFilesVerified > 0);
  }));
