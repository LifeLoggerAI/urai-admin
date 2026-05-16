import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

const requireAdminSession = await read('src/lib/admin/require-admin-session.ts');
assert.match(requireAdminSession, /verifySessionCookie\(sessionCookie,\s*true\)/, 'admin sessions must verify revocation-aware Firebase session cookies');
assert.match(requireAdminSession, /adminUsers/, 'admin sessions must check the adminUsers collection');
assert.match(requireAdminSession, /isActive\s*!==\s*true/, 'inactive admin users must be rejected');
assert.match(requireAdminSession, /adminUser\?\.role\s*!==\s*role/, 'custom claim role must match adminUsers role');

const collectionRoute = await read('src/app/api/admin/collection/route.ts');
assert.match(collectionRoute, /const\s+COLLECTIONS\s*=/, 'collection route must use an explicit allow-list');
assert.match(collectionRoute, /auditLogs:\s*\{[^}]*orderBy:\s*'createdAt'/s, 'audit logs must order by the canonical createdAt field');
assert.match(collectionRoute, /SENSITIVE_KEY_PATTERN/, 'generic collection reads must define sensitive key redaction');
assert.match(collectionRoute, /REDACTED/, 'generic collection reads must redact secret-like fields');
assert.doesNotMatch(collectionRoute, /collection\(collectionKey\)/, 'collection route must not query arbitrary client-provided collection names');

const roleRoute = await read('src/app/api/admin/users/[uid]/role/route.ts');
assert.match(roleRoute, /requireAdminSession\(req,\s*\['owner'\]\)/, 'role mutation must require owner role');
assert.match(roleRoute, /Cannot change your own role/, 'role mutation must prevent self-demotion');
assert.match(roleRoute, /writeAuditLog/, 'role mutation must write an audit log');

console.log('app admin source contract checks passed');
