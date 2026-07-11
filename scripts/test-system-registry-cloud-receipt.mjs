#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  validateRegistryCloudAuthority,
  writeConfinedRegistryCloudReceipt,
} from './system-registry-cloud-policy.mjs';

const PROJECT = 'urai-admin-staging';
const credential = JSON.stringify({
  type: 'service_account',
  project_id: PROJECT,
  client_email: `registry-deployer@${PROJECT}.iam.gserviceaccount.com`,
});
const roots = [];

function createRoot() {
  const root = mkdtempSync(path.join(os.tmpdir(), 'urai-admin-cloud-receipt-'));
  roots.push(root);
  return root;
}

function authority(receiptPath) {
  return validateRegistryCloudAuthority({
    env: {
      FIREBASE_SERVICE_ACCOUNT_KEY: credential,
      URAI_ADMIN_SEED_RECEIPT_PATH: receiptPath,
    },
    projectId: PROJECT,
  });
}

try {
  {
    const seedSource = readFileSync(new URL('./seed-system-registry.mjs', import.meta.url), 'utf8');
    const preflightIndex = seedSource.indexOf('preparedCloudReceipt = prepareConfinedRegistryCloudReceiptTarget');
    const initializeIndex = seedSource.indexOf('admin.initializeApp');
    const mutationIndex = seedSource.indexOf('await batch.commit()');
    const receiptWriteIndex = seedSource.indexOf('const writtenPath = writeConfinedRegistryCloudReceipt');
    assert.ok(preflightIndex >= 0, 'seed child must invoke immutable receipt preflight');
    assert.ok(initializeIndex > preflightIndex, 'receipt preflight must occur before Firebase initialization');
    assert.ok(mutationIndex > initializeIndex, 'registry mutation must occur after receipt preflight');
    assert.ok(receiptWriteIndex > mutationIndex, 'receipt content must be written only after mutation read-back');
    console.log('OK: receipt target preflight precedes Firebase initialization and mutation');
  }

  {
    const repoRoot = createRoot();
    const policy = authority('docs/release-evidence/cloud/run-001.json');
    const absolutePath = writeConfinedRegistryCloudReceipt({
      receiptPath: policy.receiptPath,
      content: '{"ok":true}\n',
      repoRoot,
    });
    assert.equal(
      absolutePath,
      path.join(repoRoot, 'docs', 'release-evidence', 'cloud', 'run-001.json'),
    );
    assert.equal(readFileSync(absolutePath, 'utf8'), '{"ok":true}\n');
    assert.throws(
      () => writeConfinedRegistryCloudReceipt({
        receiptPath: policy.receiptPath,
        content: '{"replacement":true}\n',
        repoRoot,
      }),
      /already exists; use a fresh immutable receipt path/,
    );
    console.log('OK: fresh receipt is created once and cannot be overwritten');
  }

  assert.throws(
    () => authority('docs/release-evidence/../../outside.json'),
    /must stay under docs\/release-evidence/,
  );
  assert.throws(
    () => authority('/tmp/outside.json'),
    /relative JSON path under docs\/release-evidence/,
  );
  assert.throws(
    () => authority('docs/release-evidence/not-json.txt'),
    /must end in \.json/,
  );
  console.log('OK: lexical traversal, absolute paths and non-JSON receipts are rejected');

  {
    const repoRoot = createRoot();
    const outside = createRoot();
    mkdirSync(path.join(repoRoot, 'docs'));
    symlinkSync(outside, path.join(repoRoot, 'docs', 'release-evidence'), 'dir');
    assert.throws(
      () => writeConfinedRegistryCloudReceipt({
        receiptPath: 'docs/release-evidence/run.json',
        content: '{}\n',
        repoRoot,
      }),
      /must not be a symbolic link/,
    );
    console.log('OK: symlinked evidence directory is rejected');
  }

  {
    const repoRoot = createRoot();
    const outside = createRoot();
    mkdirSync(path.join(repoRoot, 'docs', 'release-evidence'), { recursive: true });
    symlinkSync(outside, path.join(repoRoot, 'docs', 'release-evidence', 'nested'), 'dir');
    assert.throws(
      () => writeConfinedRegistryCloudReceipt({
        receiptPath: 'docs/release-evidence/nested/run.json',
        content: '{}\n',
        repoRoot,
      }),
      /must not be a symbolic link/,
    );
    console.log('OK: symlinked intermediate receipt directory is rejected');
  }

  {
    const repoRoot = createRoot();
    const outsideRoot = createRoot();
    const outsideFile = path.join(outsideRoot, 'outside.json');
    writeFileSync(outsideFile, '{"outside":true}\n');
    mkdirSync(path.join(repoRoot, 'docs', 'release-evidence'), { recursive: true });
    symlinkSync(outsideFile, path.join(repoRoot, 'docs', 'release-evidence', 'run.json'), 'file');
    assert.throws(
      () => writeConfinedRegistryCloudReceipt({
        receiptPath: 'docs/release-evidence/run.json',
        content: '{}\n',
        repoRoot,
      }),
      /target must not be a symbolic link/,
    );
    assert.equal(readFileSync(outsideFile, 'utf8'), '{"outside":true}\n');
    console.log('OK: symlinked receipt file is rejected without changing its target');
  }

  {
    const repoRoot = createRoot();
    mkdirSync(path.join(repoRoot, 'docs'), { recursive: true });
    writeFileSync(path.join(repoRoot, 'docs', 'release-evidence'), 'not-a-directory');
    assert.throws(
      () => writeConfinedRegistryCloudReceipt({
        receiptPath: 'docs/release-evidence/run.json',
        content: '{}\n',
        repoRoot,
      }),
      /must be a directory/,
    );
    console.log('OK: non-directory receipt path component is rejected');
  }

  console.log('PASS: system registry cloud receipt confinement and immutability');
} finally {
  for (const root of roots.reverse()) rmSync(root, { recursive: true, force: true });
}
