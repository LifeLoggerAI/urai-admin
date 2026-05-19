import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const rootPkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
const packager = await readFile(new URL('../../scripts/package-next-for-functions.sh', import.meta.url), 'utf8');

assert.match(source, /export\s+const\s+aggregateAnalytics\b/, 'aggregateAnalytics must remain exported');
assert.match(source, /analytics_events_raw_\$\{dateStr\}/, 'aggregateAnalytics must read daily raw analytics collections');
assert.match(source, /analytics_aggregates/, 'aggregateAnalytics must write aggregate analytics documents');
assert.match(source, /analytics_job_runs/, 'aggregateAnalytics must write job run status records');
assert.match(source, /status:\s*["']failed["']/, 'aggregateAnalytics must persist failed job status');
assert.match(source, /export\s+const\s+nextServer\b/, 'nextServer must remain exported for Firebase Hosting rewrites');
assert.match(source, /functions\.https\.onRequest/, 'nextServer must be an HTTPS request handler');
assert.match(source, /from\s+['"]next['"]/, 'nextServer requires the Next runtime package');
assert.match(source, /packagedNextAppDir/, 'nextServer must resolve the packaged Next app directory');
assert.match(source, /join\(__dirname,\s*['"]\.\.['"],\s*['"]apps['"],\s*['"]urai-admin['"]\)/, 'nextServer must point at functions/apps/urai-admin after build');
assert.match(source, /dir:\s*packagedNextAppDir/, 'nextServer must run from the packaged app directory');

assert.match(rootPkg.scripts?.build ?? '', /package-next-for-functions\.sh/, 'root build must package Next before building Functions');
assert.match(packager, /apps\/urai-admin\/\.next/, 'packager must require the app Next build output');
assert.match(packager, /functions\/apps\/urai-admin/, 'packager must stage the app under functions/apps/urai-admin');
assert.match(packager, /rm -rf "\$\{FUNCTIONS_APP_DIR\}"/, 'packager must clean the staged app before copying');

for (const dependency of ['next', 'react', 'react-dom', 'firebase-admin', 'firebase-functions']) {
  assert.ok(pkg.dependencies?.[dependency], `functions package must include runtime dependency: ${dependency}`);
}

console.log('functions source contract checks passed');