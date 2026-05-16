import assert from 'node:assert/strict';
import { AnalyticsEventInputSchema, redactJsonValue } from '@urai/analytics-core';
import { demoMetrics, recentEvents } from '../src/lib/demo-data';

const now = new Date().toISOString();
const event = AnalyticsEventInputSchema.parse({
  eventId: 'evt_smoke_1',
  eventName: 'page.viewed',
  organizationId: 'org_demo',
  workspaceId: 'wrk_demo',
  timestamp: now,
  consent: {
    granted: true,
    categories: ['necessary', 'product_analytics'],
    policyVersion: 'v1',
    capturedAt: now
  },
  properties: { route: '/app', token: 'secret-value' }
});

assert.equal(event.organizationId, 'org_demo');
assert.equal(event.workspaceId, 'wrk_demo');
assert.equal(event.retentionClass, 'standard_13m');

const redacted = redactJsonValue(event.properties);
assert.equal((redacted.value as any).token, '[REDACTED]');
assert.ok(demoMetrics.totalEvents > 0);
assert.ok(recentEvents.length >= 1);

console.log('URAI Analytics app smoke tests passed');
