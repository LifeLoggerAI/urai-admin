import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AnalyticsEventInputSchema, redactJsonValue } from '@urai/analytics-core';
import { apiKeys, demoMetrics, recentEvents } from '../src/lib/demo-data';

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

assert.equal(demoMetrics.environment, 'preview');
assert.ok(demoMetrics.id.includes('_preview_'));
assert.ok(apiKeys.every((key) => key.status === 'fixture'));
assert.ok(apiKeys.every((key) => key.prefix === 'urai_demo'));
assert.ok(apiKeys.every((key) => !/production|live/i.test(`${key.id} ${key.name} ${key.prefix} ${key.status}`)));

console.log('URAI Analytics app smoke tests passed');


const appRoot = resolve(process.cwd());
const homeSource = readFileSync(resolve(appRoot, 'src/app/page.tsx'), 'utf8');
const privacySource = readFileSync(resolve(appRoot, 'src/app/privacy/page.tsx'), 'utf8');
const termsSource = readFileSync(resolve(appRoot, 'src/app/terms/page.tsx'), 'utf8');
const robotsSource = readFileSync(resolve(appRoot, 'src/app/robots.ts'), 'utf8');
const appLayoutSource = readFileSync(resolve(appRoot, 'src/app/app/layout.tsx'), 'utf8');
const globalsSource = readFileSync(resolve(appRoot, 'src/app/globals.css'), 'utf8');

assert.doesNotMatch(homeSource, /Live workspace snapshot|sold as a SaaS/i);
assert.match(homeSource, /Demo data — not production telemetry/);
assert.doesNotMatch(privacySource, /placeholder/i);
assert.doesNotMatch(termsSource, /placeholder/i);
assert.match(robotsSource, /disallow: \['\/app'/);
assert.match(appLayoutSource, /index:\s*false/);
assert.match(globalsSource, /:focus-visible/);
assert.match(globalsSource, /prefers-reduced-motion/);
assert.match(globalsSource, /text-size-adjust:\s*100%/);
