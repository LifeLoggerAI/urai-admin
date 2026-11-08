import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseQaSnapshot, qaLogSummary, qaDiffSummary, safeQaTag } from '../src/lib/qa/safe-snapshot-summary.mjs';

const sha = (c) => c.repeat(64);
const snapshot = (data = {}) => Buffer.from(JSON.stringify({
  links: { 'https://admin.example/path?access_token=private#frag': 404 },
  console: ['private user token', { raw: 'secret' }],
  screenshots: { dashboard_normal: sha('a') },
  ...data,
}));

test('QA logs expose only path/status and count, never secrets, query or console text', () => {
  const result = qaLogSummary(parseQaSnapshot(snapshot()));
  assert.deepEqual(result.brokenLinks, [{ path: '/path', status: 404 }]);
  assert.equal(result.consoleErrorCount, 2);
  assert.deepEqual(result.consoleErrors, []);
  assert.doesNotMatch(JSON.stringify(result), /private|token|admin\.example|frag/);
});

test('legacy navigation-error status has a minimized path', () => {
  const item = parseQaSnapshot(snapshot({ links: { 'https://admin.example/path?private=1': 'NAV_ERR' } }));
  assert.deepEqual(item.links, [{ path: '/path', status: 'NAV_ERR' }]);
});

test('QA diff produces only relative internal image names and stable public keys', () => {
  const prev = parseQaSnapshot(snapshot());
  const current = parseQaSnapshot(snapshot({ screenshots: { dashboard_normal: sha('b') } }));
  const result = qaDiffSummary(prev, current, 'previous', 'current');
  assert.equal(result.visualRegressions[0].key, 'dashboard_normal');
  for (const k of ['prev', 'curr', 'diff']) {
    assert.ok(!result.visualRegressions[0][k].startsWith('/'));
    assert.doesNotMatch(result.visualRegressions[0][k], /private|https?:|\.\./);
  }
});

test('QA snapshot rejects malformed screenshot keys and hashes', () => {
  for (const screenshots of [{ '../escape': sha('a') }, { safe: 'not-a-sha' }]) {
    assert.throws(() => parseQaSnapshot(snapshot({ screenshots })));
  }
});

test('QA snapshot rejects invalid structure and excessive entries', () => {
  for (const obj of [null, [], { links: [] }, { console: {} }]) {
    assert.throws(() => parseQaSnapshot(Buffer.from(JSON.stringify(obj))));
  }
  const tooMany = Object.fromEntries(Array.from({ length: 5001 }, (_, i) => ['k' + i, sha('a')]));
  assert.throws(() => parseQaSnapshot(snapshot({ screenshots: tooMany })));
});

test('QA tag admits only bounded opaque references', () => {
  for (const good of ['release_1', 'v1-2']) assert.equal(safeQaTag(good), true);
  for (const bad of ['', '../private', 'x'.repeat(81), 'run?secret=1', null]) assert.equal(safeQaTag(bad), false);
});
