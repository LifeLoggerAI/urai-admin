#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function requireFile(path) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    fail(`Missing required file: ${path}`);
    return '';
  }

  return readFileSync(path, 'utf8');
}

function requireJson(path) {
  const content = requireFile(path);
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`Invalid JSON in ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function requireIncludes(content, needle, message) {
  if (!content.includes(needle)) {
    fail(message);
  }
}

function requireScript(packageJson, name, expectedSubstring) {
  const script = packageJson?.scripts?.[name];
  if (typeof script !== 'string' || script.length === 0) {
    fail(`Missing package script: ${name}`);
    return;
  }

  if (expectedSubstring && !script.includes(expectedSubstring)) {
    fail(`Package script ${name} must include: ${expectedSubstring}`);
  }
}

function gitSha() {
  const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : 'unknown';
}

console.log('--- URAI Admin release verification ---');

const packageJson = requireJson('package.json');
const firebaseJson = requireJson('firebase.json');
const firebaserc = requireJson('.firebaserc');
const firestoreRules = requireFile('firestore.rules');
const storageRules = requireFile('storage.rules');
const packageNext = requireFile('scripts/package-next-for-functions.sh');
const launchProduction = requireFile('scripts/launch-production.sh');
const deployProduction = requireFile('scripts/deploy-production.sh');
const smokeTest = requireFile('scripts/smoke-test.sh');
const verifyProduction = requireFile('scripts/verify-production-live.sh');
const preflightProduction = requireFile('scripts/preflight-production.sh');

requireFile('scripts/clean-functions-legacy.sh');
requireFile('scripts/clean-app-generated.sh');
requireFile('scripts/security-gate.sh');
requireFile('scripts/test-firestore-rules-contract.mjs');
requireFile('scripts/test-admin-route-contracts.mjs');
requireFile('apps/urai-admin/src/app/api/admin/users/route.ts');
requireFile('apps/urai-admin/src/app/api/admin/collection/route.ts');
requireFile('functions/src/index.ts');
requireFile('functions/package.json');

requireScript(packageJson, 'clean:legacy', 'clean-functions-legacy.sh');
requireScript(packageJson, 'security:gate', 'security-gate.sh');
requireScript(packageJson, 'lint', 'pnpm clean:legacy');
requireScript(packageJson, 'typecheck', 'pnpm clean:legacy');
requireScript(packageJson, 'test', 'pnpm security:gate');
requireScript(packageJson, 'build', 'package-next-for-functions.sh');
requireScript(packageJson, 'preflight', 'pnpm build');
requireScript(packageJson, 'release:lock', 'pnpm verify:release');
requireScript(packageJson, 'verify:release', 'scripts/verify-release.mjs');
requireScript(packageJson, 'deploy', 'deploy:production');
requireScript(packageJson, 'deploy:production', 'scripts/deploy-production.sh');
requireScript(packageJson, 'preflight:production', 'preflight-production.sh');
requireScript(packageJson, 'launch:production', 'launch-production.sh');
requireScript(packageJson, 'verify:production', 'verify-production-live.sh');
requireScript(packageJson, 'smoke-test', 'smoke-test.sh');

if (firebaseJson?.functions?.[0]?.runtime !== 'nodejs20') {
  fail('firebase.json functions runtime must be nodejs20');
}

const hosting = firebaseJson?.hosting;
if (!hosting) {
  fail('firebase.json must define hosting');
}

const rewrites = hosting?.rewrites;
if (!Array.isArray(rewrites) || !rewrites.some((rewrite) => rewrite?.source === '**' && rewrite?.function === 'nextServer')) {
  fail('firebase.json hosting rewrites must route ** to nextServer');
}

if (firebaserc?.projects?.default !== 'urai-4dc1d') {
  fail('.firebaserc default project must be urai-4dc1d');
}

requireIncludes(firestoreRules, 'allow read, write: if false', 'firestore.rules must keep default deny');
requireIncludes(storageRules, 'allow read, write: if false', 'storage.rules must keep default deny');
requireIncludes(packageNext, 'apps/urai-admin', 'package-next-for-functions.sh must package apps/urai-admin');
requireIncludes(packageNext, '.next', 'package-next-for-functions.sh must package Next build output');
requireIncludes(launchProduction, 'pnpm preflight:production', 'launch-production.sh must run production preflight');
requireIncludes(launchProduction, 'firebase deploy', 'launch-production.sh must deploy through Firebase');
requireIncludes(deployProduction, 'pnpm launch:production', 'deploy-production.sh must delegate to launch:production');
requireIncludes(smokeTest, 'https://urai-admin.web.app', 'smoke-test must target production Hosting URL');
requireIncludes(verifyProduction, 'https://urai-admin.web.app', 'verify-production-live must target production Hosting URL');
requireIncludes(preflightProduction, 'urai-4dc1d', 'preflight-production must enforce urai-4dc1d');

const deploymentCriticalText = [
  readFileSync('package.json', 'utf8'),
  readFileSync('firebase.json', 'utf8'),
  readFileSync('.firebaserc', 'utf8'),
  launchProduction,
  deployProduction,
  preflightProduction,
].join('\n');

if (deploymentCriticalText.includes('urai-8025b')) {
  fail('Found legacy Firebase project urai-8025b in deployment-critical files');
}

if ((packageJson?.scripts?.verifyRelease ?? packageJson?.scripts?.['verify:release'] ?? '').includes('|| echo')) {
  warn('verify:release should fail hard once this verifier is present');
}

if (warnings.length) {
  console.warn('Release verification warnings:');
  for (const message of warnings) console.warn(`- ${message}`);
}

if (failures.length) {
  console.error('Release verification failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`OK: Release verification passed at ${gitSha()}.`);
