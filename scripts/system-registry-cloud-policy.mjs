import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

function fail(message) {
  throw new Error(message);
}

function parseCredentialJson(raw, label) {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    fail(`${label} is not valid JSON.`);
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${label} must contain a JSON object.`);
  }
  return value;
}

function projectFromServiceAccountEmail(value) {
  if (typeof value !== 'string') return '';
  const match = value.match(/@([a-z][a-z0-9-]{4,28}[a-z0-9])\.iam\.gserviceaccount\.com$/);
  return match?.[1] || '';
}

function projectFromImpersonationUrl(value) {
  if (typeof value !== 'string' || !value) return '';
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  const match = decoded.match(/serviceAccounts\/([^/:]+)(?::generateAccessToken)?$/);
  return projectFromServiceAccountEmail(match?.[1] || '');
}

function credentialProjectId(credential) {
  const identityProjects = new Set();
  const emailProject = projectFromServiceAccountEmail(credential.client_email);
  if (emailProject) identityProjects.add(emailProject);
  const impersonationProject = projectFromImpersonationUrl(credential.service_account_impersonation_url);
  if (impersonationProject) identityProjects.add(impersonationProject);

  if (identityProjects.size === 0) {
    fail('Cloud credential does not expose a project-bound service account identity through client_email or service_account_impersonation_url.');
  }
  if (identityProjects.size !== 1) {
    fail(`Cloud credential contains conflicting service-account project identities: ${[...identityProjects].sort().join(', ')}.`);
  }

  const identityProject = [...identityProjects][0];
  if (typeof credential.project_id === 'string' && credential.project_id && credential.project_id !== identityProject) {
    fail(`Cloud credential project_id ${credential.project_id} conflicts with service-account identity project ${identityProject}.`);
  }
  return identityProject;
}

function confinedReceiptPath(value) {
  if (typeof value !== 'string' || !value.trim()) {
    fail('Cloud apply requires URAI_ADMIN_SEED_RECEIPT_PATH.');
  }
  const raw = value.trim().replaceAll('\\', '/');
  if (path.posix.isAbsolute(raw) || raw.includes('\0')) {
    fail('URAI_ADMIN_SEED_RECEIPT_PATH must be a relative JSON path under docs/release-evidence/.');
  }
  const normalized = path.posix.normalize(raw);
  if (normalized.startsWith('../') || normalized === '..' || !normalized.startsWith('docs/release-evidence/')) {
    fail('URAI_ADMIN_SEED_RECEIPT_PATH must stay under docs/release-evidence/.');
  }
  if (!normalized.endsWith('.json')) {
    fail('URAI_ADMIN_SEED_RECEIPT_PATH must end in .json.');
  }
  return normalized;
}

function requireDirectoryWithoutSymlink(target, label, {
  existsSyncFn,
  lstatSyncFn,
  mkdirSyncFn,
}) {
  if (!existsSyncFn(target)) mkdirSyncFn(target, { mode: 0o700 });
  const metadata = lstatSyncFn(target);
  if (metadata.isSymbolicLink()) fail(`${label} must not be a symbolic link.`);
  if (!metadata.isDirectory()) fail(`${label} must be a directory.`);
}

export function prepareConfinedRegistryCloudReceiptTarget({
  receiptPath,
  repoRoot,
  existsSyncFn = existsSync,
  lstatSyncFn = lstatSync,
  mkdirSyncFn = mkdirSync,
  realpathSyncFn = realpathSync,
} = {}) {
  const normalizedReceiptPath = confinedReceiptPath(receiptPath);
  if (typeof repoRoot !== 'string' || !repoRoot.trim()) {
    fail('Cloud receipt preparation requires the exact repository root.');
  }

  let realRoot;
  try {
    realRoot = realpathSyncFn(repoRoot);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`Repository root could not be resolved: ${reason}`);
  }

  const evidenceRoot = path.resolve(realRoot, 'docs', 'release-evidence');
  const targetPath = path.resolve(realRoot, ...normalizedReceiptPath.split('/'));
  const relativeToEvidence = path.relative(evidenceRoot, targetPath);
  if (!relativeToEvidence || relativeToEvidence.startsWith('..') || path.isAbsolute(relativeToEvidence)) {
    fail('Cloud receipt target must resolve to a file below docs/release-evidence/.');
  }

  let current = realRoot;
  for (const segment of normalizedReceiptPath.split('/').slice(0, -1)) {
    current = path.join(current, segment);
    requireDirectoryWithoutSymlink(current, `Cloud receipt directory ${path.relative(realRoot, current)}`, {
      existsSyncFn,
      lstatSyncFn,
      mkdirSyncFn,
    });
  }

  if (existsSyncFn(targetPath)) {
    const metadata = lstatSyncFn(targetPath);
    if (metadata.isSymbolicLink()) fail('Cloud receipt target must not be a symbolic link.');
    fail('Cloud receipt target already exists; use a fresh immutable receipt path.');
  }

  return {
    absolutePath: targetPath,
    relativePath: normalizedReceiptPath,
    repositoryRoot: realRoot,
  };
}

export function writeConfinedRegistryCloudReceipt({
  receiptPath,
  content,
  repoRoot,
  existsSyncFn = existsSync,
  lstatSyncFn = lstatSync,
  mkdirSyncFn = mkdirSync,
  realpathSyncFn = realpathSync,
  writeFileSyncFn = writeFileSync,
} = {}) {
  if (typeof content !== 'string') fail('Cloud receipt content must be a string.');
  const prepared = prepareConfinedRegistryCloudReceiptTarget({
    receiptPath,
    repoRoot,
    existsSyncFn,
    lstatSyncFn,
    mkdirSyncFn,
    realpathSyncFn,
  });

  try {
    writeFileSyncFn(prepared.absolutePath, content, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`Cloud receipt could not be created exclusively: ${reason}`);
  }

  const written = lstatSyncFn(prepared.absolutePath);
  if (written.isSymbolicLink() || !written.isFile()) {
    fail('Cloud receipt target must be a newly created regular file.');
  }
  return prepared.absolutePath;
}

export function validateRegistryCloudAuthority({
  env = process.env,
  projectId,
  readFileSyncFn = readFileSync,
} = {}) {
  if (typeof projectId !== 'string' || !projectId) {
    fail('Cloud authority validation requires an exact target project id.');
  }

  const inline = env.FIREBASE_SERVICE_ACCOUNT_KEY || '';
  const credentialPath = env.GOOGLE_APPLICATION_CREDENTIALS || '';
  if (inline && credentialPath) {
    fail('Cloud apply must use exactly one credential source, not both FIREBASE_SERVICE_ACCOUNT_KEY and GOOGLE_APPLICATION_CREDENTIALS.');
  }
  if (!inline && !credentialPath) {
    fail('Cloud apply requires an explicit project-bound credential source.');
  }

  let credential;
  let credentialSource;
  if (inline) {
    credential = parseCredentialJson(inline, 'FIREBASE_SERVICE_ACCOUNT_KEY');
    credentialSource = 'inline-service-account-json';
  } else {
    let raw;
    try {
      raw = readFileSyncFn(credentialPath, 'utf8');
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      fail(`GOOGLE_APPLICATION_CREDENTIALS could not be read: ${reason}`);
    }
    credential = parseCredentialJson(raw, 'GOOGLE_APPLICATION_CREDENTIALS');
    credentialSource = 'credential-file';
  }

  const boundProjectId = credentialProjectId(credential);
  if (boundProjectId !== projectId) {
    fail(`Cloud credential project ${boundProjectId} does not match target ${projectId}.`);
  }

  return {
    credential,
    credentialSource,
    credentialProjectId: boundProjectId,
    receiptPath: confinedReceiptPath(env.URAI_ADMIN_SEED_RECEIPT_PATH || ''),
  };
}
