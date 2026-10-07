import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import {
  AnalyticsEventInputSchema, ApiKeySchema, assertAnalyticsConsent,
  assertApiKeyTenantScope, rawEventCollectionName, redactJsonValue,
} from '../../../packages/analytics-core/src/index.ts';

const source = readFileSync(new URL('../src/app/api/v1/events/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText.replace(/^import[\s\S]*?from ['"][^'"]+['"];\n/gm, '').replace(/^export /gm, '');

function fixture() {
  const rows = [];
  let now = Date.now();
  class ClockDate extends Date { static now() { return now; } }
  const keys = ['one', 'two'].map(tenant => ({
    id: `key_${tenant}`, organizationId: `org_${tenant}`, workspaceId: `wrk_${tenant}`,
    name: 'Synthetic key', prefix: 'urai_live', secretHash: 'x'.repeat(64),
    status: 'active', scopes: ['events:write'], environment: 'production',
    createdAt: new Date().toISOString(),
  }));
  const ref = path => ({ path, set: async value => rows.push({ path, value }), collection: name => collection(`${path}/${name}`) });
  const collection = path => ({
    doc: id => ref(`${path}/${id}`),
    add: async value => rows.push({ path: `${path}/audit`, value }),
  });
  let selected = 'one';
  const query = { where: () => query, limit: () => query, get: async () => ({ docs: keys.filter(key => key.id === `key_${selected}`).map(key => ({ id: key.id, data: () => key })) }) };
  const context = vm.createContext({
    NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) },
    db: {
      collection, collectionGroup: () => query,
      runTransaction: async callback => callback({
        get: async () => ({ exists: false }),
        set: (target, value) => rows.push({ path: target.path, value }),
      }),
    },
    hashIp: () => 'synthetic-ip-hash', hashApiKey: () => 'x'.repeat(64), timingSafeEqualHex: () => true,
    AnalyticsEventInputSchema, ApiKeySchema, assertAnalyticsConsent, assertApiKeyTenantScope,
    rawEventCollectionName, redactJsonValue,
    process: { env: {} }, Date: ClockDate,
  });
  vm.runInContext(`${compiled}\nthis.post = POST; this.limit = rateLimit; this.keyCount = () => memoryRateLimit.size;`, context);
  return {
    limit: context.limit, keyCount: context.keyCount, advance: milliseconds => { now += milliseconds; },
    rows, post: async (tenant, privacyClass = 'customer') => {
      selected = tenant;
      return context.post({
        json: async () => ({
          eventId: 'same_global_event_id', eventName: 'urai.passive_signal.received',
          organizationId: `org_${tenant}`, workspaceId: `wrk_${tenant}`,
          timestamp: new Date().toISOString(), privacyClass,
          userId: 'private_user', properties: { transcript: 'PRIVATE_MEMORY', gps: 'PRIVATE_LOCATION', emotion: 'PRIVATE_HEALTH' },
          consent: { granted: true, categories: ['necessary', 'product_analytics'], policyVersion: 'v1' },
        }),
        headers: { get: name => name === 'authorization' ? `Bearer urai_live_${tenant}` : null },
      });
    },
  };
}

for (const privacyClass of ['customer', 'public', 'passive_signal', 'health_adjacent', 'derived_ai_insight']) {
  test(`client consent cannot authorize ${privacyClass} retention without a canonical consumer`, async () => {
    const f = fixture(); const result = await f.post('one', privacyClass);
    assert.equal(result.status, 503);
    assert.equal(result.body.error, 'canonical_ingest_unavailable');
    assert.equal(f.rows.some(row => !row.path.startsWith('analyticsAuditLogs/')), false);
    assert.equal(JSON.stringify(f.rows).includes('PRIVATE_'), false);
  });
}

test('the same client event ID in two tenants never creates or aliases an unbound event', async () => {
  const f = fixture();
  for (const tenant of ['one', 'two']) assert.equal((await f.post(tenant)).status, 503);
  assert.equal(f.rows.some(row => !row.path.startsWith('analyticsAuditLogs/')), false);
  assert.equal(JSON.stringify(f.rows).includes('private_user'), false);
});

test('process-local abuse state is bounded and admits new keys only after old windows expire', () => {
  const f = fixture();
  for (let i = 0; i < 10_000; i += 1) assert.equal(f.limit(`synthetic-digest-${i}`).ok, true);
  assert.equal(f.limit('overflow-digest').ok, false);
  assert.equal(f.keyCount(), 10_000);
  f.advance(60_001);
  assert.equal(f.limit('fresh-digest').ok, true);
  assert.equal(f.keyCount(), 1);
});
