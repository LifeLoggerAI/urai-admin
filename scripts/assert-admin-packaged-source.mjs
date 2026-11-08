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

// The packager copies .next, then deliberately removes .next/cache and build
// sourcemaps. Compare every remaining compiled byte, not just BUILD_ID, so a
// mismatched server bundle cannot pass merely because source files agree.
function nextFiles(root, { packaged = false } = {}) {
  const buildDir = path.join(root, '.next');
  const result = [];
  function walk(relative) {
    const location = path.join(root, relative);
    const metadata = lstatSync(location);
    assert.ok(!metadata.isSymbolicLink(), `Next artifact symlink is not permitted: ${relative}`);
    if (metadata.isDirectory()) {
      if (relative === '.next/cache') {
        assert.ok(!packaged, 'Packaged Next cache must be absent');
        return;
      }
      for (const entry of readdirSync(location).sort()) walk(path.join(relative, entry));
      return;
    }
    assert.ok(metadata.isFile(), `Unexpected Next artifact type: ${relative}`);
    if (relative.endsWith('.map') || relative.endsWith('.tsbuildinfo')) {
      assert.ok(!packaged, `Packaged Next generated metadata must be absent: ${relative}`);
      return;
    }
    result.push(relative);
  }
  walk('.next');
  return result.sort();
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
  const functionEntries = Array.isArray(firebase.functions) ? firebase.functions : [firebase.functions];
  assert.equal(functionEntries.length, 1, 'Exactly one Admin Functions source package is permitted');
  assert.equal(functionEntries[0]?.source, 'functions', 'Admin Functions upload must use functions/ as source');
  // firebase-tools v15.24.0 enumerates the whole Functions source tree for the
  // upload archive. Only functions/.generated contains the canonical Next app;
  // tracked functions/apps/urai-admin is obsolete and must be excluded at the
  // directory traversal boundary (and for file-level defense in depth).
  assert.deepEqual(functionEntries[0]?.ignore, [
    'node_modules', '.git', 'firebase-debug.log', 'firebase-debug.*.log',
    '**/functions/apps', '**/functions/apps/**',
  ], 'Functions ignore policy must exclude the legacy tracked Admin mirror without excluding the generated runtime');
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
  const canonicalNext = nextFiles(app);
  const bundledNext = nextFiles(packaged, { packaged: true });
  assert.ok(canonicalNext.includes('.next/BUILD_ID'), 'Next build identity must be included in the audited artifact list');
  assert.ok(canonicalNext.some((p) => p.startsWith('.next/server/')), 'Compiled Next server output is missing');
  assert.deepEqual(bundledNext, canonicalNext, 'Packaged Next compiled artifact paths must exactly match the canonical build');
  let compiledBytesVerified = 0;
  const compiledAggregate = createHash('sha256');
  for (const relative of canonicalNext) {
    const sourceBytes = readFileSync(path.join(app, relative));
    const bundledBytes = readFileSync(path.join(packaged, relative));
    assert.equal(sha(bundledBytes), sha(sourceBytes), `Packaged Next compiled artifact differs: ${relative}`);
    compiledBytesVerified += sourceBytes.byteLength;
    compiledAggregate.update(relative).update('\0').update(sourceBytes).update('\0');
  }
  return {
    filesVerified: canonicalFiles.length,
    bytesVerified,
    sourceSha256: aggregate.digest('hex'),
    compiledFilesVerified: canonicalNext.length,
    compiledBytesVerified,
    compiledSha256: compiledAggregate.digest('hex'),
    nextBuildId: sourceBuildId.trim(),
  };
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
    console.log(`Admin packaged source and compiled Next parity PASS: ${result.filesVerified} source files, ${result.compiledFilesVerified} compiled files; source SHA256 ${result.sourceSha256}; compiled SHA256 ${result.compiledSha256}; Next build ${result.nextBuildId}`);
  } catch (error) {
    console.error(`Admin packaged source parity HOLD: ${error.message}`);
    process.exitCode = 1;
  }
}
