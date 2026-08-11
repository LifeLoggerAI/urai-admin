import { existsSync, readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
const preflight = readFileSync('scripts/preflight-production.sh', 'utf8');
const rollback = readFileSync('scripts/rollback-production.sh', 'utf8');
const gitignore = readFileSync('.gitignore', 'utf8');
const runtimeAuthPaths = [
  'apps/urai-admin/src/config/firebase-admin.ts',
  'functions/apps/urai-admin/src/config/firebase-admin.ts',
  'packages/governance-sdk/src/firebase.ts',
];
const forbiddenTrackedEnvPaths = [
  '.env.local',
  'apps/urai-admin/.env.local',
];
const governanceSdk = readFileSync('packages/governance-sdk/src/firebase.ts', 'utf8');

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
requireMatch(gitignore, /^gha-creds-\*\.json$/m, 'generated WIF ADC credential ignore');
requireMatch(gitignore, /^\.env\.\*$/m, 'local env wildcard ignore');

for (const path of forbiddenTrackedEnvPaths) {
  if (existsSync(path)) failures.push(`forbidden tracked local env file: ${path}`);
}

forbidMatch(workflow, /\$\{\{\s*secrets\.FIREBASE_TOKEN\s*\}\}/, 'FIREBASE_TOKEN secret interpolation');
forbidMatch(workflow, /\$\{\{\s*secrets\.FIREBASE_SERVICE_ACCOUNT_KEY\s*\}\}/, 'FIREBASE_SERVICE_ACCOUNT_KEY secret interpolation');
forbidMatch(workflow, /credentials_json\s*:/, 'credentials_json authentication');
forbidMatch(workflow, /--token(?:\s|=)/, 'Firebase CLI --token authentication');

requireMatch(preflight, /GOOGLE_APPLICATION_CREDENTIALS/, 'WIF\/ADC preflight check');
forbidMatch(preflight, /require_env\s+"FIREBASE_TOKEN"/, 'FIREBASE_TOKEN preflight requirement');

requireMatch(rollback, /GOOGLE_APPLICATION_CREDENTIALS/, 'WIF\/ADC rollback check');
forbidMatch(rollback, /--token(?:\s|=)/, 'rollback --token authentication');
forbidMatch(rollback, /FIREBASE_TOKEN is required/, 'rollback FIREBASE_TOKEN requirement');

requireMatch(workflow, /corepack pnpm exec firebase deploy --only hosting,functions,firestore,storage -P urai-4dc1d/, 'worktree-local ADC-compatible rollback deploy command');
requireMatch(workflow, /verify-production-live\.sh/, 'post-rollback live verification');
forbidMatch(workflow, /URAI_ADMIN_DEPLOY_MARKER=.*pnpm run deploy:production/, 'historical rollback deploy script invocation');

for (const path of runtimeAuthPaths) {
  const source = readFileSync(path, 'utf8');
  requireMatch(source, /initializeApp\(/, `${path} Firebase Admin initialization`);
  forbidMatch(source, /credential\.cert\s*\(/, `${path} certificate credential construction`);
  forbidMatch(source, /FIREBASE_PRIVATE_KEY/, `${path} private-key environment fallback`);
  forbidMatch(source, /FIREBASE_CLIENT_EMAIL/, `${path} client-email environment fallback`);
  forbidMatch(source, /ServiceAccount/, `${path} service-account parameter contract`);
}

requireMatch(governanceSdk, /const CENTRAL_PROJECT_ID = 'urai-4dc1d'/, 'governance SDK explicit central project');
requireMatch(governanceSdk, /const CENTRAL_APP_NAME = 'urai-admin-governance'/, 'governance SDK named app');
requireMatch(governanceSdk, /admin\.credential\.applicationDefault\(\)/, 'governance SDK ADC credential');
requireMatch(governanceSdk, /projectId:\s*CENTRAL_PROJECT_ID/, 'governance SDK pinned project initialization');
requireMatch(governanceSdk, /admin\.app\(CENTRAL_APP_NAME\)/, 'governance SDK named app reuse');
requireMatch(governanceSdk, /centralApp\.firestore\(\)/, 'governance SDK named Firestore instance');

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  throw new Error(`URAI_ADMIN_WIF_DEPLOY_AUTH_CONTRACT ${failures.length} checks failed`);
}

console.log('[PASS] URAI_ADMIN_WIF_DEPLOY_AUTH_CONTRACT');
