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
const adminSessionGuard = requireFile('apps/urai-admin/src/lib/admin/require-admin-session.ts');
const collectionRoute = requireFile('apps/urai-admin/src/app/api/admin/collection/route.ts');
const routeContracts = requireFile('scripts/test-admin-route-contracts.mjs');
const deployScript = requireFile('scripts/deploy-production.sh');
requireFile('scripts/preflight-production.sh');
requireFile('scripts/smoke-test.sh');
requireFile('scripts/verify-production-live.sh');
requireFile('scripts/test-firestore-rules-contract.mjs');
requireFile('scripts/test-system-registry-contract.mjs');
requireFile('docs/DEPLOYMENT_RUNBOOK.md');
requireFile('docs/EVIDENCE_LOG.md');
requireFile('docs/URAI_ADMIN_STANDALONE_READINESS.md');

requireScript(packageJson, 'clean:legacy', 'clean-functions-legacy.sh');
requireScript(packageJson, 'security:gate', 'security-gate.sh');
requireScript(packageJson, 'typecheck', 'pnpm clean:legacy');
requireScript(packageJson, 'lint', 'pnpm clean:legacy');
requireScript(packageJson, 'test', 'pnpm security:gate');
requireScript(packageJson, 'build', 'pnpm security:gate');
requireScript(packageJson, 'preflight', 'pnpm build');
requireScript(packageJson, 'release:lock', 'pnpm verify:release');
requireScript(packageJson, 'verify:release', 'scripts/verify-release.mjs');
requireScript(packageJson, 'deploy', 'deploy:production');
requireScript(packageJson, 'deploy:production', 'scripts/deploy-production.sh');
requireScript(packageJson, 'preflight:production', 'preflight-production.sh');
requireScript(packageJson, 'verify:production', 'verify-production-live.sh');
requireScript(packageJson, 'smoke-test', 'smoke-test.sh');

if (firebaseJson?.functions?.[0]?.runtime !== 'nodejs20') {
  fail('firebase.json functions runtime must be nodejs20');
}

if (firebaseJson?.hosting?.source !== 'apps/urai-admin') {
  fail('firebase.json hosting.source must be apps/urai-admin');
}

const rewrites = firebaseJson?.hosting?.rewrites;
if (!Array.isArray(rewrites) || !rewrites.some((rewrite) => rewrite?.source === '**' && rewrite?.function === 'nextServer')) {
  fail('firebase.json hosting rewrites must route ** to nextServer');
}

if (firebaserc?.projects?.default !== 'urai-4dc1d') {
  fail('.firebaserc default project must be urai-4dc1d');
}

if (firebaserc?.projects?.admin !== 'urai-4dc1d') {
  fail('.firebaserc admin alias must be urai-4dc1d');
}

requireIncludes(firestoreRules, 'request.auth.token.admin == true', 'firestore.rules must require admin custom claim');
requireIncludes(firestoreRules, 'allow read, write: if false;', 'firestore.rules must keep default deny');
requireIncludes(storageRules, 'allow read, write: if false;', 'storage.rules must keep default deny');
requireIncludes(adminSessionGuard, 'verifySessionCookie(sessionCookie, true)', 'admin sessions must verify revoked Firebase session cookies');
requireIncludes(adminSessionGuard, 'Cache-Control', 'admin auth errors must carry Cache-Control');
requireIncludes(adminSessionGuard, 'no-store', 'admin auth errors must be no-store');
requireIncludes(collectionRoute, 'privacyRequests', 'admin collection API must include privacyRequests');
requireIncludes(collectionRoute, 'SENSITIVE_KEY_PATTERN', 'admin collection API must redact sensitive fields');
requireIncludes(collectionRoute, 'Cache-Control', 'admin collection API must set cache headers');
requireIncludes(collectionRoute, 'no-store', 'admin collection API must be no-store');
requireIncludes(routeContracts, 'privacyRequests', 'route contract must cover privacyRequests');
requireIncludes(routeContracts, 'noStoreHeaders', 'route contract must cover admin auth no-store behavior');
requireIncludes(deployScript, 'firebase deploy', 'deploy-production.sh must call firebase deploy');
requireIncludes(deployScript, '-P urai-4dc1d', 'deploy-production.sh must target urai-4dc1d');
requireIncludes(deployScript, 'pnpm build', 'deploy-production.sh must build before deploy');
requireIncludes(deployScript, 'pnpm preflight:production', 'deploy-production.sh must run production preflight before deploy');

const deploymentCriticalText = [
  readFileSync('package.json', 'utf8'),
  readFileSync('firebase.json', 'utf8'),
  readFileSync('.firebaserc', 'utf8'),
  deployScript,
  readFileSync('scripts/preflight-production.sh', 'utf8'),
].join('\n');

if (deploymentCriticalText.includes('urai-8025b')) {
  fail('Found legacy Firebase project urai-8025b in deployment-critical files');
}

if (packageJson?.scripts?.deploy === 'firebase deploy --only hosting,functions,firestore,storage -P urai-4dc1d') {
  warn('deploy script still uses direct Firebase command; prefer deploy:production wrapper');
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
