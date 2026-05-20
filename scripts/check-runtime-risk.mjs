#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';

const failures = [];
const warnings = [];
const migrationGateDate = new Date('2026-09-15T00:00:00Z');
const decommissionDate = new Date('2026-10-31T00:00:00Z');
const now = process.env.URAI_RUNTIME_CHECK_DATE ? new Date(`${process.env.URAI_RUNTIME_CHECK_DATE}T00:00:00Z`) : new Date();

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

function readJson(path) {
  const content = requireFile(path);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`Invalid JSON in ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

console.log('--- Checking URAI Admin runtime risk ---');

const firebaseJson = readJson('firebase.json');
const functionsPackage = readJson('functions/package.json');
const plan = requireFile('docs/runtime-upgrade-plan.txt');
const packageJson = readJson('package.json');

const firebaseRuntime = firebaseJson?.functions?.[0]?.runtime;
const functionsNodeEngine = functionsPackage?.engines?.node;
const firebaseFunctionsVersion = functionsPackage?.dependencies?.['firebase-functions'];

if (!plan.includes('2026-09-15')) {
  fail('runtime upgrade plan must include the internal migration deadline');
}

if (!plan.includes('2026-10-31')) {
  fail('runtime upgrade plan must include the Firebase decommission date');
}

if (!firebaseRuntime || typeof firebaseRuntime !== 'string') {
  fail('firebase.json must declare a Functions runtime');
}

const runtimeMajor = firebaseRuntime?.match(/nodejs(\d+)/)?.[1];
if (!runtimeMajor) {
  fail(`Unable to parse Firebase Functions runtime: ${firebaseRuntime}`);
}

if (runtimeMajor && String(functionsNodeEngine) !== runtimeMajor) {
  fail(`functions/package.json node engine (${functionsNodeEngine}) must match firebase.json runtime (${firebaseRuntime})`);
}

if (firebaseRuntime === 'nodejs20') {
  warn('Node.js 20 is currently configured and has a planned migration gate.');
  if (now >= migrationGateDate) {
    fail('Node.js 20 is still configured on or after the internal migration gate date 2026-09-15');
  }
}

if (now >= decommissionDate && firebaseRuntime === 'nodejs20') {
  fail('Node.js 20 reached the Firebase decommission date 2026-10-31');
}

if (firebaseFunctionsVersion === '^5.0.1') {
  warn('firebase-functions is still on the known old ^5.0.1 line.');
  if (now >= migrationGateDate) {
    fail('firebase-functions remains on ^5.0.1 on or after the internal migration gate date 2026-09-15');
  }
}

const scripts = packageJson?.scripts ?? {};
if (!String(scripts['check:runtime'] ?? '').includes('check-runtime-risk.mjs')) {
  fail('package.json must expose check:runtime');
}
if (!String(scripts['release:lock'] ?? '').includes('check:runtime')) {
  fail('release:lock must include check:runtime');
}

if (warnings.length) {
  console.warn('Runtime risk warnings:');
  for (const message of warnings) console.warn(`- ${message}`);
}

if (failures.length) {
  console.error('Runtime risk check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Runtime risk is documented and within the guarded migration window.');
