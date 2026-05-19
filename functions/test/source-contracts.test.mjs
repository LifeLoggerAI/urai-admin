import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

assert.match(source, /export\s+const\s+aggregateAnalytics\b/, 'aggregateAnalytics must remain exported');
assert.match(source, /analytics_events_raw_\$\{dateStr\}/, 'aggregateAnalytics must read daily raw analytics collections');
assert.match(source, /analytics_aggregates/, 'aggregateAnalytics must write aggregate analytics documents');
assert.match(source, /analytics_job_runs/, 'aggregateAnalytics must write job run status records');
assert.match(source, /status:\s*["']failed["']/, 'aggregateAnalytics must persist failed job status');
assert.match(source, /export\s+const\s+nextServer\b/, 'nextServer must remain exported for Firebase Hosting rewrites');
assert.match(source, /functions\.https\.onRequest/, 'nextServer must be an HTTPS request handler');
assert.match(source, /from\s+['"]next['"]/, 'nextServer requires the Next runtime package');

for (const dependency of ['next', 'react', 'react-dom', 'firebase-admin', 'firebase-functions']) {
  assert.ok(pkg.dependencies?.[dependency], `functions package must include runtime dependency: ${dependency}`);
}

console.log('functions source contract checks passed');