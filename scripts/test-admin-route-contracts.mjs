#!/usr/bin/env node
import { existsSync } from 'node:fs';

const required = [
  'apps/urai-admin/src/app/page.tsx',
  'apps/urai-admin/src/app/login/page.tsx',
  'apps/urai-admin/src/app/admin/page.tsx',
  'apps/urai-admin/src/app/admin/users/page.tsx',
  'apps/urai-admin/src/app/admin/system/page.tsx',
  'apps/urai-admin/src/app/api/auth/login/route.ts',
  'apps/urai-admin/src/app/api/auth/logout/route.ts',
  'apps/urai-admin/src/app/api/auth/admin-session/route.ts',
  'apps/urai-admin/src/app/api/admin/users/route.ts'
];

const missing = required.filter((path) => !existsSync(path));

if (missing.length) {
  console.error('Admin route contract failed:');
  for (const path of missing) console.error(`- Missing ${path}`);
  process.exit(1);
}

console.log('OK: Admin route contract passed.');
