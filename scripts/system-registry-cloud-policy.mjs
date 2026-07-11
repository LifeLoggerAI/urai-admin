import { readFileSync } from 'node:fs';
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
  const candidates = new Set();
  if (typeof credential.project_id === 'string' && credential.project_id) {
    candidates.add(credential.project_id);
  }
  const emailProject = projectFromServiceAccountEmail(credential.client_email);
  if (emailProject) candidates.add(emailProject);
  const impersonationProject = projectFromImpersonationUrl(credential.service_account_impersonation_url);
  if (impersonationProject) candidates.add(impersonationProject);
  if (candidates.size === 0) {
    fail('Cloud credential does not expose a project-bound service account identity.');
  }
  if (candidates.size !== 1) {
    fail(`Cloud credential contains conflicting project identities: ${[...candidates].sort().join(', ')}.`);
  }
  return [...candidates][0];
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
