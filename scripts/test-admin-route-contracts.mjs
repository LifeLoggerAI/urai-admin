#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const appRoot = 'apps/urai-admin/src/app';
const failures = [];

const expectedRoutes = [
  'page.tsx',
  'login/page.tsx',
  'admin/page.tsx',
  'admin/users/page.tsx',
  'admin/projects/page.tsx',
  'admin/jobs/page.tsx',
  'admin/job-runs/page.tsx',
  'admin/dead-letters/page.tsx',
  'admin/feature-flags/page.tsx',
  'admin/policies/page.tsx',
  'admin/privacy-requests/page.tsx',
  'admin/system/page.tsx',
  'admin/audit/page.tsx',
  'admin/settings/page.tsx',
  'api/health/route.ts',
  'api/auth/login/route.ts',
  'api/auth/logout/route.ts',
  'api/auth/session/route.ts',
  'api/auth/admin-session/route.ts',
  'api/admin/collection/route.ts',
  'api/admin/users/[uid]/role/route.ts',
  'api/admin/set-flag/route.ts',
  'api/admin/set-user-active/route.ts',
  'api/admin/recover-user-mutation/route.ts',
  'api/qa/logs/route.ts',
];

for (const route of expectedRoutes) {
  const pathname = join(appRoot, route);
  if (!existsSync(pathname)) failures.push(`missing expected route file: ${pathname}`);
}

function requireTokens(pathname, tokens) {
  const source = readFileSync(pathname, 'utf8');
  for (const token of tokens) {
    if (!source.includes(token)) failures.push(`${pathname} missing contract token: ${token}`);
  }
}

function forbidTokens(pathname, tokens) {
  const source = readFileSync(pathname, 'utf8');
  for (const token of tokens) {
    if (source.includes(token)) failures.push(`${pathname} contains forbidden contract token: ${token}`);
  }
}

const adminSessionPath = 'apps/urai-admin/src/lib/admin/require-admin-session.ts';
requireTokens(adminSessionPath, [
  'verifySessionCookie(sessionCookie, true)',
  'requireSameOrigin',
  'URAI_ADMIN_ALLOWED_ORIGINS',
  'URAI_ADMIN_PRODUCTION_URL',
  "process.env.NODE_ENV === 'production'",
  'Production admin origins must use HTTPS',
  'Admin origin allowlist is not configured',
  'isLoopbackOrigin',
  'decodedToken.auth_time',
  'MAX_CLOCK_SKEW_SECONDS',
  'refreshRequired: true',
  'tokenClaimsMatch',
  'createSessionCookie(idToken',
  'requireAdminMutationSession',
]);
forbidTokens(adminSessionPath, ['x-forwarded-host', 'x-forwarded-proto']);
requireTokens(join(appRoot, 'api/auth/login/route.ts'), ['exchangeAdminIdToken', 'auth.login']);
requireTokens(join(appRoot, 'api/auth/session/route.ts'), ['exchangeAdminIdToken', 'requireSameOrigin', 'DELETE']);
requireTokens(join(appRoot, 'api/admin/users/[uid]/role/route.ts'), [
  'requireAdminMutationSession',
  'updateAdminRole',
]);
requireTokens('apps/urai-admin/src/lib/admin/update-admin-role.ts', [
  'runTransaction',
  'roleMutation',
  'setCustomUserClaims',
  'revokeRefreshTokens',
  'previousClaims',
  'sessionsRevoked: true',
  'adminUsers.role.update',
  'rollback-required',
  'account remains disabled pending recovery',
]);
requireTokens(join(appRoot, 'api/admin/collection/route.ts'), [
  'COLLECTIONS',
  'privacyRequests',
  'SENSITIVE_KEY_PATTERN',
  'REDACTED',
  'requireAdminSession',
]);
requireTokens(join(appRoot, 'api/health/route.ts'), ['urai-admin', 'Cache-Control', 'no-store']);
requireTokens('.github/workflows/deploy.yml', [
  'URAI_ADMIN_PRODUCTION_URL',
  'URAI_ADMIN_ALLOWED_ORIGINS',
  'Protected admin origin allowlist is empty.',
  'base_url origin',
  'not in the protected admin origin allowlist',
]);
requireTokens('functions/src/index.ts', [
  "defineString('URAI_ADMIN_PRODUCTION_URL')",
  "defineString('URAI_ADMIN_ALLOWED_ORIGINS')",
  'bindAdminOriginEnvironment()',
]);
requireTokens('apps/urai-admin/src/lib/admin/require-admin-session.ts', ['writeRequiredAuditLog']);
requireTokens('apps/urai-admin/src/app/api/admin/set-user-active/route.ts', ['activeMutation', 'roleMutation', 'rollback-required']);
requireTokens('apps/urai-admin/src/app/api/admin/recover-user-mutation/route.ts', ["requireAdminMutationSession(request, ['owner'])", 'recoverAdminMutation']);
requireTokens('apps/urai-admin/src/lib/admin/recover-admin-mutation.ts', ['STALE_MUTATION_MS', 'mutationId', 'rollback-required', 'setCustomUserClaims', 'revokeRefreshTokens', 'transaction.set(auditRef']);
requireTokens('scripts/seed-system-registry.mjs', ['conflictingRegistryRecords', 'Refusing to replace live registry evidence']);

if (failures.length) {
  console.error('Admin route contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Admin route contract passed.');
