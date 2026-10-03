import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function read(pathname) {
  return readFile(new URL(`../${pathname}`, import.meta.url), 'utf8');
}

const table = await read('src/app/admin/_components/AdminCollectionTable.tsx');
assert.match(table, /role="status"/, 'loading state must expose status semantics');
assert.match(table, /aria-live="polite"/, 'loading state must announce non-urgent changes');
assert.match(table, /aria-busy="true"/, 'loading state must expose busy state');
assert.match(table, /aria-label=\{\x60\$\{collection\} records\x60\}/, 'generated admin tables must have an accessible name');
assert.match(table, /scope="col"/, 'generated table headers must identify column scope');
assert.match(table, /role="alert"/, 'runtime errors must remain assertive alerts');

const globals = await read('src/app/globals.css');
assert.match(globals, /-webkit-text-size-adjust:\s*100%/, 'Admin must preserve browser text scaling');
assert.match(globals, /text-size-adjust:\s*100%/, 'Admin must preserve text scaling');
assert.match(globals, /:focus-visible/, 'Admin must provide a global visible keyboard focus baseline');
assert.match(globals, /prefers-reduced-motion:\s*reduce/, 'Admin must honor reduced-motion preference');
assert.match(globals, /forced-colors:\s*active/, 'Admin must preserve boundaries in forced-colors mode');

console.log('[PASS] URAI Admin accessibility source contract');
