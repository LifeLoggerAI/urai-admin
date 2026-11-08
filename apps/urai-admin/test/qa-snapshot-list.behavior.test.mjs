import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { listGuardedQaSnapshotTags } from '../src/lib/qa/guarded-snapshot-list.mjs';

async function fixture(callback) {
  const home = await mkdtemp(path.join(os.tmpdir(), 'urai-qa-list-'));
  const logs = path.join(home, 'deploy_logs');
  await mkdir(logs);
  try { return await callback({ home, logs }); }
  finally { await rm(home, { recursive: true, force: true }); }
}

test('lists only plain snapshot JSON regular files and sorted safe tags', async () => fixture(async ({ home, logs }) => {
  await writeFile(path.join(logs, 'urai-admin_curr_snapshot_b.json'), '{}');
  await writeFile(path.join(logs, 'urai-admin_curr_snapshot_a.json'), '{}');
  await writeFile(path.join(logs, 'private.json'), '{}');
  await mkdir(path.join(logs, 'urai-admin_curr_snapshot_folder.json'));
  assert.deepEqual(await listGuardedQaSnapshotTags(home), ['a', 'b']);
}));

test('does not enumerate a linked snapshot file', async () => fixture(async ({ home, logs }) => {
  const outside = path.join(home, 'private.json');
  await writeFile(outside, '{}');
  await symlink(outside, path.join(logs, 'urai-admin_curr_snapshot_private.json'));
  assert.deepEqual(await listGuardedQaSnapshotTags(home), []);
}));

test('rejects a linked deploy_logs root', async () => fixture(async ({ home, logs }) => {
  const backup = path.join(home, 'backup');
  await mkdir(backup);
  await rm(logs, { recursive: true });
  await symlink(backup, logs, 'dir');
  await assert.rejects(() => listGuardedQaSnapshotTags(home));
}));

test('fails closed on missing or empty HOME', async () => {
  await assert.rejects(() => listGuardedQaSnapshotTags(''));
  await assert.rejects(() => listGuardedQaSnapshotTags(path.join(os.tmpdir(), 'nonexistent-qa-root-20261107')));
});

test('ignores unrecognized snapshot filenames', async () => fixture(async ({ home, logs }) => {
  await writeFile(path.join(logs, 'not-a-snapshot.txt'), '');
  assert.deepEqual(await listGuardedQaSnapshotTags(home), []);
}));
