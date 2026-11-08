import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readGuardedQaFile } from '../src/lib/qa/guarded-artifact-read.mjs';

const IMAGE = ['.png', '.jpg', '.jpeg', '.webp'];

async function fixture(callback) {
  const home = await mkdtemp(path.join(os.tmpdir(), 'urai-qa-boundary-'));
  const root = path.join(home, 'deploy_screenshots');
  const logRoot = path.join(home, 'deploy_logs');
  const diffRoot = path.join(home, 'deploy_diffs');
  await Promise.all([mkdir(root), mkdir(logRoot), mkdir(diffRoot)]);
  const image = path.join(root, 'accepted.png');
  const outside = path.join(home, 'private.png');
  const log = path.join(logRoot, 'snapshot.json');
  await Promise.all([writeFile(image, Buffer.from('only-synthetic-qa-image')), writeFile(outside, Buffer.from('private-synthetic-no-read')), writeFile(log, '{}')]);
  try {
    await callback({ home, root, logRoot, diffRoot, image, outside, log });
  } finally {
    await rm(home, { recursive: true, force: true });
  }
}

const imageRead = (homeDir, requestedPath, maxBytes) => readGuardedQaFile({
  homeDir, requestedPath, allowedDirectories: ['deploy_screenshots', 'deploy_diffs'],
  allowedExtensions: IMAGE, ...(maxBytes === undefined ? {} : { maxBytes }),
});

const denial = async (operation) => assert.rejects(operation);

test('regular QA image reads are accepted, with stable MIME extension', async () => fixture(async ({ home, image }) => {
  const result = await imageRead(home, image);
  assert.equal(result.extension, '.png');
  assert.equal(result.bytes.toString('utf8'), 'only-synthetic-qa-image');
}));

test('authorized deploy_diffs regular image reads are accepted', async () => fixture(async ({ home, diffRoot }) => {
  const image = path.join(diffRoot, 'diff.jpg');
  await writeFile(image, 'synthetic-diff');
  assert.equal((await imageRead(home, image)).extension, '.jpg');
}));

test('non-QA private file is rejected regardless of extension', async () => fixture(async ({ home, outside }) => {
  await denial(() => imageRead(home, outside));
}));

test('sibling prefix and traversal are rejected', async () => fixture(async ({ home }) => {
  const sibling = path.join(home, 'deploy_screenshots_private');
  await mkdir(sibling);
  await writeFile(path.join(sibling, 'secret.png'), 'private');
  await denial(() => imageRead(home, path.join(sibling, 'secret.png')));
  await denial(() => imageRead(home, path.join(home, 'deploy_screenshots', '..', 'private.png')));
}));

test('non-image extension is rejected', async () => fixture(async ({ home, root }) => {
  const file = path.join(root, 'test.json');
  await writeFile(file, '{}');
  await denial(() => imageRead(home, file));
}));

test('file symlink to outside private file is rejected', async () => fixture(async ({ home, root, outside }) => {
  const link = path.join(root, 'linked.png');
  await symlink(outside, link);
  await denial(() => imageRead(home, link));
}));

test('file symlink to another image within QA root is rejected', async () => fixture(async ({ home, root, image }) => {
  const link = path.join(root, 'linked.png');
  await symlink(image, link);
  await denial(() => imageRead(home, link));
}));

test('nested directory symlink cannot escape to outside QA root', async () => fixture(async ({ home, root, outside }) => {
  const links = path.join(root, 'escape');
  await symlink(home, links, 'dir');
  await denial(() => imageRead(home, path.join(links, path.basename(outside))));
}));

test('symlinked QA root is rejected', async () => fixture(async ({ home, root, outside }) => {
  const rootLink = path.join(home, 'deploy_diffs');
  await rm(rootLink, { recursive: true, force: true });
  await symlink(path.dirname(outside), rootLink, 'dir');
  await denial(() => imageRead(home, path.join(rootLink, path.basename(outside))));
}));

test('oversize and nonregular files are rejected', async () => fixture(async ({ home, image, root }) => {
  await denial(() => imageRead(home, image, 5));
  const fakeDir = path.join(root, 'folder.png');
  await mkdir(fakeDir);
  await denial(() => imageRead(home, fakeDir));
}));

test('QA logs may read JSON from the logs root, but cannot use image policy', async () => fixture(async ({ home, log }) => {
  const bytes = await readGuardedQaFile({ homeDir: home, requestedPath: log, allowedDirectories: ['deploy_logs'], allowedExtensions: ['.json'], maxBytes: 1024 });
  assert.equal(bytes.bytes.toString(), '{}');
  await denial(() => imageRead(home, log));
}));

test('invalid root policies and empty input are rejected', async () => fixture(async ({ home, image }) => {
  await denial(() => readGuardedQaFile({ homeDir: home, requestedPath: image, allowedDirectories: ['../'], allowedExtensions: IMAGE }));
  await denial(() => imageRead(home, ''));
});
