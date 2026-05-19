#!/usr/bin/env node
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const appRoot = 'apps/urai-admin/app';
const failures = [];

const expectedRoutePaths = [
  'page.tsx',
  'login/page.tsx',
  'privacy/page.tsx',
  'terms/page.tsx',
  'admin/page.tsx',
  'admin/users/page.tsx',
  'admin/projects/page.tsx',
  'admin/feature-flags/page.tsx',
  'admin/jobs/page.tsx',
  'admin/job-runs/page.tsx',
  'admin/dead-letters/page.tsx',
  'admin/system/page.tsx',
  'admin/audit/page.tsx',
  'admin/policies/page.tsx',
  'admin/settings/page.tsx'
];

for (const route of expectedRoutePaths) {
  const path = join(appRoot, route);
  if (!existsSync(path)) failures.push(`missing expected route file: ${path}`);
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

const files = collectFiles(appRoot).filter((path) => /\.(ts|tsx)$/.test(path));
const joined = files.map((path) => readFileSync(path, 'utf8')).join('\n');

for (const requiredText of ['admin', 'audit', 'users', 'settings']) {
  if (!joined.toLowerCase().includes(requiredText)) failures.push(`app source missing required admin concept: ${requiredText}`);
}

if (failures.length) {
  console.error('Admin route contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Admin route contract passed.');
