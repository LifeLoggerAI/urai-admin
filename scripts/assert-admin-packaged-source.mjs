#!/usr/bin/env node
// Read-only release guard. No Firebase client, credentials, deployment or network.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COPY_PATHS = ['src', 'next.config.js', 'next.config.mjs', 'public', 'app', 'pages', 'styles', 'tailwind.config.js', 'tailwind.config.ts', 'postcss.config.js', 'postcss.config.mjs', 'tsconfig.json'];

function readJson(filename) {
  return JSON.parse(readFileSync(filename, 'utf8'));
}

function filesUnder(root, relative, found) {
  const location = path.join(root, relative);
  if (!existsSync(location)) return;
  const metadata = lstatSync(location);
  assert.ok(!metadata.isSymbolicLink(), `Symlink is not permitted in packaged source: ${relative}`);
  if (metadata.isFile()) {
    assert.ok(!relative.endsWith('.map') && !relative.endsWith('.tsbuildinfo'), `Unexpected generated source: ${relative}`);
    found.push(relative);
    return;
  }
  assert.ok(metadata.isDirectory(), `Not a regular packaged source path: ${relative}`);
  for (const entry of readdirSync(location).sort()) filesUnder(root, path.join(relative, entry), found);
}

function sha(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function verifyAdminPackagedSource({ cwd = process.cwd() } = {}) {
  const root = path.resolve(cwd);
  const app = path.join(root, 'apps', 'urai-admin');
  const packaged = path.join(root, 'functions', '.generated', 'urai-admin');
  const runtimeSource = readFileSync(path.join(root, 'functions', 'src', 'index.ts'), 'utf8');
  assert.ok(runtimeSource.includes("join(__dirname, '..', '.generated', 'urai-admin')"), 'Functions must resolve the generated Admin runtime');
  assert.match(runtimeSource, /next\(\{\s*dev:\s*isDev,\s*dir:\s*packagedNextAppDir\s*\}\)/, 'Functions must load the selected generated runtime');
  assert.ok(!runtimeSource.includes('functions/apps/urai-admin'), 'Functions must never select the legacy tracked Admin mirror');
  const activeConfig = readJson(path.join(root, 'functions', 'tsconfig.active.json'));
  assert.deepEqual(activeConfig.files, ['src/index.ts'], 'Active Functions entrypoint must remain explicit');
  assert.equal(readJson(path.join(root, 'functions', 'package.json')).main, 'lib/index.js');
  const firebase = readJson(path.join(root, 'firebase.json'));
  assert.equal(firebase.hosting?.source, 'apps/urai-admin', 'Firebase Hosting must use canonical Admin source');
  assert.ok(firebase.hosting?.rewrites?.some((r) => r.source === '**' && r.function === 'nextServer'), 'Firebase Hosting must rewrite to canonical packaged nextServer');
  const sourcePackage = readJson(path.join(app, 'package.json'));
  const bundledPackage = readJson(path.join(packaged, 'package.json'));
  assert.deepEqual(bundledPackage, {
    ...sourcePackage,
    scripts: { ...sourcePackage.scripts, build: 'next build' },
  }, 'Packaged package.json must differ only by intentional build-script override');

  const canonicalFiles = [];
  const generatedFiles = [];
  for (const entry of COPY_PATHS) {
    filesUnder(app, entry, canonicalFiles);
    filesUnder(packaged, entry, generatedFiles);
  }
  canonicalFiles.sort();
  generatedFiles.sort();
  assert.ok(canonicalFiles.includes('src/lib/admin/require-admin-session.ts'), 'Packaged source must include Admin session authority');
  assert.ok(canonicalFiles.includes('next.config.js') || canonicalFiles.includes('next.config.mjs'), 'Packaged source must include Admin security headers');
  assert.deepEqual(generatedFiles, canonicalFiles, 'Generated runtime source paths must exactly match canonical source paths');
  let bytesVerified = 0;
  const aggregate = createHash('sha256');
  for (const relative of canonicalFiles) {
    const sourceBytes = readFileSync(path.join(app, relative));
    const bundledBytes = readFileSync(path.join(packaged, relative));
    assert.equal(sha(bundledBytes), sha(sourceBytes), `Packaged runtime source differs: ${relative}`);
    bytesVerified += sourceBytes.byteLength;
    aggregate.update(relative).update('\0').update(sourceBytes).update('\0');
  }
  const sourceBuildId = readFileSync(path.join(app, '.next', 'BUILD_ID'), 'utf8');
  const packagedBuildId = readFileSync(path.join(packaged, '.next', 'BUILD_ID'), 'utf8');
  assert.ok(sourceBuildId.trim(), 'Canonical Next BUILD_ID is missing');
  assert.equal(packagedBuildId, sourceBuildId, 'Packaged Next build must match canonical build identity');
  return { filesVerified: canonicalFiles.length, bytesVerified, sourceSha256: aggregate.digest('hex'), nextBuildId: sourceBuildId.trim() };
}

const currentFile = process.argv[1] && path.resolve(process.argv[1]);
if (currentFile === fileURLToPath(import.meta.url)) {
  try {
    let cwd = process.cwd();
    if (process.argv.length > 2) {
      assert.equal(process.argv[2], '--root', 'Only --root <directory> is permitted');
      assert.equal(process.argv.length, 4, 'Only one --root argument is permitted');
      cwd = path.resolve(process.argv[3]);
    }
    const result = verifyAdminPackagedSource({ cwd });
    console.log(`Admin packaged source parity PASS: ${result.filesVerified} files, ${result.bytesVerified} bytes; source SHA256 ${result.sourceSha256}; Next build ${result.nextBuildId}`);
  } catch (error) {
    console.error(`Admin packaged source parity HOLD: ${error.message}`);
    process.exitCode = 1;
  }
}
