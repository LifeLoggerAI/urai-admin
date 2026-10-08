// Audit routes expose operational evidence only. Additional metadata fields
// require an explicit source/privacy policy change rather than an arbitrary
// client payload or legacy stored record widening the read boundary.
const SAFE_METADATA_FIELDS = new Set([
  'mutationId', 'requestId', 'operationId', 'jobId', 'deliveryId', 'eventId',
  'collection', 'uid', 'flagKey', 'configId', 'source', 'status', 'outcome',
  'role', 'isActive', 'roleVersion', 'previousRole', 'newRole', 'canonicalRole',
  'previousIsActive', 'newIsActive', 'provider', 'authTime', 'method',
  'before', 'after', 'previous', 'next', 'result', 'action',
  'attempts', 'count', 'changedFields', 'recovered', 'rollbackRequired',
]);
const SENSITIVE_FIELD = /api.?key|auth|token|bearer|secret|credential|password|private.?key|cookie|raw|transcript|prompt|audio|video|image|location|sensory|inference|vector|body|message|content|email|phone/i;

function safeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value ?? null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (Array.isArray(value)) return value.map(safeValue);
  if (typeof value === 'object') return sanitizeAuditMetadata(value as Record<string, unknown>);
  return value;
}

export function sanitizeAuditMetadata(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).flatMap(([key, nested]) => {
    if (SENSITIVE_FIELD.test(key) && key !== 'authTime') return [[key, '[REDACTED]']];
    return SAFE_METADATA_FIELDS.has(key) ? [[key, safeValue(nested)]] : [];
  }));
}

export function sanitizeAuditRecord(value: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ['createdAt', 'ts']) {
    if (key in value) result[key] = safeValue(value[key]);
  }
  for (const key of ['actorUid', 'actorEmail', 'actorRole', 'action', 'targetType', 'targetId']) {
    if (typeof value[key] === 'string') result[key] = value[key];
  }
  if (typeof value.target === 'object' && value.target !== null && !Array.isArray(value.target)) {
    const target = value.target as Record<string, unknown>;
    result.target = Object.fromEntries(['id', 'type'].filter(key => typeof target[key] === 'string').map(key => [key, target[key]]));
  }
  for (const key of ['metadata', 'meta']) {
    const nested = value[key];
    if (typeof nested === 'object' && nested !== null && !Array.isArray(nested)) {
      result[key] = sanitizeAuditMetadata(nested as Record<string, unknown>);
    }
  }
  return result;
}
