import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function read(pathname) {
  return readFile(new URL(`../${pathname}`, import.meta.url), 'utf8');
}

const route = await read('src/app/api/admin/set-flag/route.ts');
const client = await read('src/app/admin/feature-flags/FeatureFlagActions.tsx');
const workflow = await read('src/lib/admin/execute-institutional-feature-flag.ts');

assert.match(route, /requireAdminMutationSession\(request, \['owner', 'admin'\]\)/, 'feature flag mutation must require an authenticated trusted-origin mutation session');
assert.match(route, /operationId:\s*z\.string\(\)\.uuid\(\)/, 'feature flag mutation must require a retry-stable operation ID');
assert.match(route, /executeInstitutionalFeatureFlag/, 'feature flag route must use the institutional executor');
assert.match(route, /Cache-Control.*no-store/s, 'feature flag mutation responses must be non-cacheable');
assert.doesNotMatch(route, /requireAdminSession\(/, 'feature flag mutation must not bypass the same-origin mutation guard');

assert.match(client, /crypto\.randomUUID\(\)/, 'feature flag UI must create one operation ID per confirmation attempt');
assert.match(client, /operationId,\s*\n\s*flagId/, 'feature flag UI must bind the operation ID into the request body');
assert.match(client, /setOperationId\(null\)/, 'feature flag UI must clear completed or cancelled operation IDs');

for (const collection of [
  'institutionalDecisions',
  'institutionalEvidenceReceipts',
  'institutionalEvents',
  'institutionalEventIdempotency',
  'institutionalControlState',
]) {
  assert.match(workflow, new RegExp(collection), `institutional feature flag workflow must bind ${collection}`);
}
assert.match(workflow, /DEFAULT_FAIL_CLOSED_KILL_SWITCH = 'ENVIRONMENT_WRITE_FREEZE'/, 'missing kill-switch state must fail closed');
assert.match(workflow, /currentIndex >= freezeIndex/, 'environment-write freeze and stronger levels must stop the effectful mutation');
assert.match(workflow, /L2_ALLOWLISTED_REVERSIBLE_ACTION/, 'first institutional executor must remain explicitly L2 allowlisted and reversible');
assert.match(workflow, /quorum:\s*0/, 'low-risk L2 action must not fabricate a human approval requirement');
assert.match(workflow, /outcome:\s*'PERMIT'/, 'authenticated allowlisted action must record an explicit policy result');
assert.match(workflow, /state:\s*'REQUESTED'/, 'decision history must begin with REQUESTED');
assert.match(workflow, /state:\s*'AUTHORIZED'/, 'decision history must record AUTHORIZED');
assert.match(workflow, /state:\s*'EXECUTED'/, 'decision history must record EXECUTED');
assert.match(workflow, /state:\s*'POSTCONDITION_VERIFIED'/, 'decision history must record positive postcondition verification');
assert.match(workflow, /state:\s*'RECEIPT_PERSISTED'/, 'decision history must record receipt persistence');
assert.match(workflow, /state:\s*'CLOSED'/, 'decision history must close only after receipt persistence');
assert.match(workflow, /decision remains EXECUTED for controlled recovery/, 'ambiguous postcondition failures must not be reported as completed');
assert.match(workflow, /stateFromSnapshot\(await flagRef\.get\(\)\)/, 'executor must read back the real feature flag after the effectful transaction');
assert.match(workflow, /verificationResult:\s*'PASS'/, 'receipt must record positive verification only after readback');
assert.match(workflow, /replayClassification:\s*'SAFE_REPLAY'/, 'reversible idempotent feature flag event must declare safe replay semantics');
assert.match(workflow, /requestFingerprint/, 'operation ID reuse with a different request must fail closed');
assert.match(workflow, /eventIdempotencyRef/, 'event emission must have a durable idempotency boundary');
assert.match(workflow, /institutionalDecisionId/, 'existing Admin audit evidence must bind the institutional decision ID');
assert.doesNotMatch(workflow, /FIREBASE_PRIVATE_KEY|GOOGLE_APPLICATION_CREDENTIALS_JSON|credential\.cert/, 'institutional executor must not introduce long-lived credential authority');

console.log('institutional feature flag workflow source contract: PASS');
