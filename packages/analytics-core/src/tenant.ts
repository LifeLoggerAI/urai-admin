import type { ApiKey, TenantScope } from './schemas';

export function assertApiKeyTenantScope(apiKey: ApiKey, scope: TenantScope): { ok: true } | { ok: false; reason: string } {
  if (apiKey.status !== 'active') return { ok: false, reason: 'api_key_not_active' };
  if (apiKey.organizationId !== scope.organizationId) return { ok: false, reason: 'organization_scope_mismatch' };
  if (apiKey.workspaceId !== scope.workspaceId) return { ok: false, reason: 'workspace_scope_mismatch' };
  if (apiKey.environment !== scope.environment) return { ok: false, reason: 'environment_scope_mismatch' };
  if (!apiKey.scopes.includes('events:write') && !apiKey.scopes.includes('admin')) return { ok: false, reason: 'missing_events_write_scope' };
  if (apiKey.expiresAt && new Date(apiKey.expiresAt).getTime() < Date.now()) return { ok: false, reason: 'api_key_expired' };
  return { ok: true };
}

export function tenantPath(scope: TenantScope): string {
  return `organizations/${scope.organizationId}/workspaces/${scope.workspaceId}`;
}

export function rawEventCollectionName(date = new Date()): string {
  return `analytics_events_raw_${date.toISOString().slice(0, 10)}`;
}

export function aggregateDocumentId(scope: TenantScope, date: string): string {
  return `${scope.organizationId}_${scope.workspaceId}_${scope.environment}_${date}`;
}
