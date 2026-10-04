import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const moduleSource = await readFile(new URL('../src/institutionalControlPlane.ts', import.meta.url), 'utf8');
const indexSource = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

for (const collection of [
  'institutionalDecisions',
  'institutionalEvidenceReceipts',
  'institutionalEvents',
  'institutionalEventIdempotency',
  'institutionalDeliveryAttempts',
  'institutionalDeadLetters',
  'institutionalReplayRequests',
  'institutionalControlState',
  'institutionalKillSwitchTransitions',
]) {
  assert.match(moduleSource, new RegExp(collection), `runtime must bind collection ${collection}`);
}

assert.match(moduleSource, /runTransaction/, 'institutional runtime persistence must use Firestore transactions');
assert.match(moduleSource, /createHash\('sha256'\)/, 'institutional runtime must use stable SHA-256 fingerprints');
assert.match(moduleSource, /conflicting decision already exists/, 'decision identity conflicts must fail closed');
assert.match(moduleSource, /authorization quorum not satisfied/, 'decision transitions must enforce approval quorum');
assert.match(moduleSource, /separation of duties violated by executor/, 'decision transitions must enforce separation of duties');
assert.match(moduleSource, /postcondition must be positively verified/, 'decision transitions must require positive postcondition evidence');
assert.match(moduleSource, /referenced evidence receipt does not exist/, 'receipt transition must verify durable receipt existence');
assert.match(moduleSource, /evidence receipt is not bound to this decision/, 'receipt transition must bind receipt to exact decision');
assert.match(moduleSource, /DUPLICATE_EVENT_ID/, 'event delivery must reject duplicate event IDs');
assert.match(moduleSource, /DUPLICATE_IDEMPOTENCY_KEY/, 'event delivery must reject duplicate idempotency keys');
assert.match(moduleSource, /DEAD_LETTER/, 'runtime must persist terminal event failures');
assert.match(moduleSource, /event replay forbidden/, 'NO_REPLAY events must remain fail closed');
assert.match(moduleSource, /compensated replay requires persisted compensation evidence/, 'compensated replay must require durable evidence');
assert.match(moduleSource, /receipt\.verificationResult !== 'PASS'/, 'compensation evidence must be positively verified');
assert.match(moduleSource, /executionAuthorized: false/, 'replay requests must never self-authorize execution');
assert.match(moduleSource, /requiresSeparateAuthorization: true/, 'replay requests must require a separate authorization decision');
assert.match(moduleSource, /DEFAULT_FAIL_CLOSED_KILL_SWITCH = 'ENVIRONMENT_WRITE_FREEZE'/, 'missing kill-switch state must fail closed');
assert.match(moduleSource, /restoration requires separately authorized restoration/, 'kill-switch restoration must require separate authority');
assert.match(moduleSource, /globalEffectfulWritesAllowed/, 'runtime readiness must expose effectful-write readiness as a boolean');
assert.match(moduleSource, /writesAllowedAtKillSwitchLevel/, 'effectful write authority must be derived from kill-switch level');

assert.match(indexSource, /createInstitutionalControlPlaneStore\(db\)/, 'Admin Functions must bind the institutional store to the real Firestore runtime');
assert.match(indexSource, /export\s+const\s+institutionalControlPlaneReadiness\s*=\s*functions\.https\.onRequest/, 'Admin Functions must expose control-plane readiness');
assert.match(indexSource, /result\.ready \? 200 : 503/, 'control-plane readiness must fail closed with 503');
assert.match(indexSource, /Cache-Control['"],\s*['"]no-store/, 'control-plane readiness must not be cached');
assert.doesNotMatch(indexSource, /GOOGLE_APPLICATION_CREDENTIALS/, 'control-plane readiness must not expose credential paths');
assert.match(pkg.scripts?.lint ?? '', /src\/\*\*\/\*\.ts/, 'Functions lint must cover imported institutional runtime modules');
assert.match(pkg.scripts?.test ?? '', /institutional-control-plane-runtime-source\.test\.mjs/, 'Functions test gate must include institutional runtime source checks');

console.log('institutional control-plane runtime source contract: PASS');
