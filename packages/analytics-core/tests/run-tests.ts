import assert from 'node:assert/strict';
import {
  AnalyticsEventInputSchema,
  assertAnalyticsConsent,
  assertApiKeyTenantScope,
  normalizeEventName,
  redactJsonValue,
  type ApiKey,
  type TenantScope
} from '../src';

const now = new Date().toISOString();

const parsed = AnalyticsEventInputSchema.parse({
  eventId: 'evt_test_1',
  eventName: 'Page Viewed!',
  organizationId: 'org_test',
  workspaceId: 'wrk_test',
  environment: 'production',
  timestamp: now,
  userId: 'user_test',
  sessionId: 'sess_test',
  route: '/app',
  properties: { plan: 'free' },
  consent: {
    granted: true,
    categories: ['necessary', 'product_analytics'],
    policyVersion: 'v1',
    capturedAt: now
  }
});

assert.equal(parsed.eventName, 'page_viewed_');
assert.equal(parsed.retentionClass, 'standard_13m');
assert.equal(normalizeEventName('URAI Mood Updated'), 'urai_mood_updated');
assert.deepEqual(assertAnalyticsConsent(parsed.consent), { ok: true });

const consentFailure = assertAnalyticsConsent({ granted: true, categories: ['necessary'], policyVersion: 'v1' });
assert.equal(consentFailure.ok, false);

const redacted = redactJsonValue({ contact_email: 'person at example dot com', nested: { token: 'secret-value', safe: 'ok' } });
assert.equal((redacted.value as any).contact_email, '[REDACTED]');
assert.equal((redacted.value as any).nested.token, '[REDACTED]');
assert.equal((redacted.value as any).nested.safe, 'ok');
assert.deepEqual(redacted.redactedPaths.sort(), ['properties.contact_email', 'properties.nested.token']);

const apiKey: ApiKey = {
  id: 'key_1',
  organizationId: 'org_test',
  workspaceId: 'wrk_test',
  name: 'Test key',
  prefix: 'urai_live',
  secretHash: 'x'.repeat(64),
  status: 'active',
  scopes: ['events:write'],
  environment: 'production',
  createdAt: now
};
const scope: TenantScope = { organizationId: 'org_test', workspaceId: 'wrk_test', environment: 'production' };
assert.deepEqual(assertApiKeyTenantScope(apiKey, scope), { ok: true });
assert.equal(assertApiKeyTenantScope(apiKey, { ...scope, workspaceId: 'other' }).ok, false);

console.log('URAI Analytics core tests passed');
