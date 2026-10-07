import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/app/api/v1/events/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText.replace(/^import[\s\S]*?from ['"][^'"]+['"];\n/gm, '').replace(/^export /gm, '');

function runtime() {
  const rows = [];
  const query = { where: () => query, limit: () => query, get: async () => ({ docs: [] }) };
  const context = vm.createContext({
    NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) },
    db: { collection: name => ({ add: async value => rows.push({ collection: name, value }) }), collectionGroup: () => query },
    hashIp: () => 'synthetic-ip-hash', hashApiKey: () => 'synthetic-key-hash', timingSafeEqualHex: () => false,
    ApiKeySchema: { safeParse: () => ({ success: false }) },
    process: { env: {} },
  });
  vm.runInContext(`${compiled}\nthis.post = POST;`, context);
  return { post: context.post, rows };
}

for (const authorization of [null, 'Bearer untrusted-key']) {
  test(`rejected ingestion retains content-free audit metadata for ${authorization ? 'invalid' : 'missing'} credentials`, async () => {
    const f = runtime();
    const body = { transcript: 'PRIVATE_TRANSCRIPT_SENT_WITHOUT_AUTH', faceEmotion: 'PRIVATE_EMOTION', gps: 'PRIVATE_LOCATION', password: 'PRIVATE_PASSWORD', consent: { analytics: false } };
    const result = await f.post({ json: async () => body, headers: { get: name => name === 'authorization' ? authorization : null } });
    assert.equal(result.status, authorization ? 403 : 401);
    assert.equal(f.rows.length, 1);
    const audit = f.rows[0].value;
    assert.equal(audit.bodyKind, 'object');
    for (const content of Object.values(body).filter(value => typeof value === 'string')) assert.equal(JSON.stringify(f.rows).includes(content), false);
    assert.equal(Object.hasOwn(audit, 'bodyPreview'), false);
    assert.equal(Object.hasOwn(audit, 'body'), false);
  });
}

test('invalid JSON neither writes an audit payload nor creates an event', async () => {
  const f = runtime();
  const result = await f.post({ json: async () => { throw new SyntaxError('bad payload'); }, headers: { get: () => null } });
  assert.equal(result.status, 400);
  assert.equal(f.rows.length, 0);
});
