#!/usr/bin/env node
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const appRoot = 'apps/urai-admin/app';
const failures = [];

const expectedRoutePaths = [
  'page.jsx',
  'login/page.jsx',
  'status/page.jsx',
  'privacy/page.jsx',
  'terms/page.jsx',
  'admin/page.jsx',
  'admin/users/page.jsx',
  'admin/jobs/page.jsx',
  'admin/audit/page.jsx',
  'admin/privacy-requests/page.jsx',
  'admin/system/page.jsx',
  'admin/releases/page.jsx',
  'admin/governance/page.jsx',
  'admin/communications/page.jsx',
  'admin/analytics/page.jsx'
];

const optionalRoutePaths = [
  'admin/projects/page.jsx',
  'admin/feature-flags/page.jsx',
  'admin/job-runs/page.jsx',
  'admin/dead-letters/page.jsx',
  'admin/policies/page.jsx',
  'admin/settings/page.jsx'
];

for (const route of expectedRoutePaths) {
  const path = join(appRoot, route);
  if (!existsSync(path)) failures.push(`missing expected route file: ${path}`);
}

for (const route of optionalRoutePaths) {
  const path = join(appRoot, route);
  if (!existsSync(path)) console.warn(`WARN: optional route not yet implemented: ${path}`);
}

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...collectFiles(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
}

const files = collectFiles(appRoot).filter((path) => /\.(js|jsx|ts|tsx)$/.test(path));
const joined = files.map((path) => readFileSync(path, 'utf8')).join('\n').toLowerCase();

for (const requiredText of [
  'admin',
  'audit',
  'users',
  'privacy',
  'system',
  'release',
  'governance',
  'communications',
  'analytics'
]) {
  if (!joined.includes(requiredText)) failures.push(`app source missing required admin concept: ${requiredText}`);
}

if (failures.length) {
  console.error('Admin route contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Admin route contract passed.');
