import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
const preflight = readFileSync('scripts/preflight-production.sh', 'utf8');
const rollback = readFileSync('scripts/rollback-production.sh', 'utf8');

const failures = [];
const requireMatch = (source, pattern, label) => {
  if (!pattern.test(source)) failures.push(`missing ${label}`);
};
const forbidMatch = (source, pattern, label) => {
  if (pattern.test(source)) failures.push(`forbidden ${label}`);
};

requireMatch(workflow, /id-token:\s*write/, 'OIDC id-token permission');
requireMatch(workflow, /GCP_WIF_PROVIDER/, 'GCP_WIF_PROVIDER variable');
requireMatch(workflow, /GCP_DEPLOY_SERVICE_ACCOUNT/, 'GCP_DEPLOY_SERVICE_ACCOUNT variable');
requireMatch(workflow, /workload_identity_provider:/, 'workload_identity_provider auth input');
requireMatch(workflow, /service_account:/, 'service_account auth input');
requireMatch(workflow, /create_credentials_file:\s*true/, 'temporary ADC credential file');
requireMatch(workflow, /persist-credentials:\s*false/, 'GitHub checkout credential isolation');
requireMatch(workflow, /workflow_dispatch:/, 'manual deployment dispatch');

forbidMatch(workflow, /\$\{\{\s*secrets\.FIREBASE_TOKEN\s*\}\}/, 'FIREBASE_TOKEN secret interpolation');
forbidMatch(workflow, /\$\{\{\s*secrets\.FIREBASE_SERVICE_ACCOUNT_KEY\s*\}\}/, 'FIREBASE_SERVICE_ACCOUNT_KEY secret interpolation');
forbidMatch(workflow, /credentials_json\s*:/, 'credentials_json authentication');
forbidMatch(workflow, /--token(?:\s|=)/, 'Firebase CLI --token authentication');

requireMatch(preflight, /GOOGLE_APPLICATION_CREDENTIALS/, 'WIF\/ADC preflight check');
forbidMatch(preflight, /require_env\s+"FIREBASE_TOKEN"/, 'FIREBASE_TOKEN preflight requirement');

requireMatch(rollback, /GOOGLE_APPLICATION_CREDENTIALS/, 'WIF\/ADC rollback check');
forbidMatch(rollback, /--token(?:\s|=)/, 'rollback --token authentication');
forbidMatch(rollback, /FIREBASE_TOKEN is required/, 'rollback FIREBASE_TOKEN requirement');

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  throw new Error(`URAI_ADMIN_WIF_DEPLOY_AUTH_CONTRACT ${failures.length} checks failed`);
}

console.log('[PASS] URAI_ADMIN_WIF_DEPLOY_AUTH_CONTRACT');
