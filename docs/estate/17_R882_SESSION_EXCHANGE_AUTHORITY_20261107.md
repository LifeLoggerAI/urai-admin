# R882 — Admin session exchange authority closure (2026-11-07/08 UTC)

**PRODUCTION HOLD.** This is an independent, unmerged review-only security patch, with precise isolated native test receipts, not production authorization.

## Parent/child source provenance

Parent Admin R881 [PR #107](https://github.com/LifeLoggerAI/urai-admin/pull/107): `89c0cb7c01a4f5a0f5e77a2b2908197d337c96b8`. New R882 [draft #108](https://github.com/LifeLoggerAI/urai-admin/pull/108): `67a48d342627524d384b15771723321abff73e20`. GitHub diff: **five commits ahead, zero behind, five changed paths**: `apps/urai-admin/src/lib/admin/require-admin-session.ts`, new `apps/urai-admin/test/admin-session-exchange-authority.behavior.test.mjs`, `apps/urai-admin/package.json`, `apps/urai-admin/test/source-contracts.test.mjs` and `scripts/run-admin-auth-runtime-emulator-receipt.mjs`. Original #85 and security #100–#107 preserved.

## Security finding and narrowly scoped proposed repair

Existing session exchange verified recent signed ID token, active canonical `adminUsers` role, and current Auth `admin:true`/role but **did not check** canonical pending role/active reservations or the signed token/current account/canonical roleVersion agreement before setting a session cookie. R881 protected reads already apply stricter controls; R882 brings exchange into agreement with the full authority contract and prevents avoidable admission of stale/in-progress roles.

New `require-admin-session.ts` Git blob `9d3fc6ba9d873f8b964032a57a52116a60e60b44` rejects pending role/active mutation as 403 and checks disabled account/UID, Auth `admin:true` + role/version and signed ID token `admin:true` + role/version against canonical `adminUsers`. Existing governed audit and refresh-required 409 semantics retained. This is a source-level admission-control enhancement, not a proven exploit.

## Executed native evidence

On Node.js `v22.16.0`, isolated tests transpile the **complete unmodified R882 real source file** with synthetic Next/Firebase dependencies, not an abbreviated reimplementation. Local Git blob hashes match GitHub for `require-admin-session.ts` `9d3fc6ba9d873f8b964032a57a52116a60e60b44`, R882 `admin-session-exchange-authority.behavior.test.mjs` `4d874b5dc9736aa2954f105f1f13a8dc7dfae86c`, and R881 `admin-current-auth-claims.behavior.test.mjs` `bdbc302bbc527b6d9c351d300e375c158d3c2491`. Combined `node --test`: **17/17 PASS**, exit 0. TAP SHA256: `614e65189c0a5d8e8bb8b98695894b238ac8b84b5cc6ad44af6f94d8dbbf8`. Covers 10 protected read behaviors, one valid exchange and six failed exchange states (pending role/active mutation, disabled account, current and token incarnation drift, wrong current UID).

Added source contract assertions and an Auth/Firestore emulator regression that uses only disposable local test users to assert pending mutation 403 and canonical roleVersion mismatch 409. **Not yet executed**: complete repo frozen install, native Next/Functions build, Auth/Firestore emulator, real session/token/SDK, GitHub green CI, provider IAM/Rules and protected runtime. External GitHub repository clone DNS unavailable from local container. Isolated tests are evidence for exercised program logic only.

## Remaining authority and release gates

P0: actual Actions runner diagnostics (prior failed jobs have zero recorded steps), frozen full native build and verified emulator, effective `urai-4dc1d` IAM+project-wide Firestore/Storage rule owner, dedicated Functions namespace migration, protected owner/admin/viewer cross-user private media/memory/consent negative tests, exact deployed source and verified rollback. P1: QA parent-directory TOCTOU and artifact storage minimization, audit integrity, production request cost/latency of per-read Auth account verification, cross-product data ownership (Privacy/Jobs/Studio/Analytics/Communications/RuAi). No live admin/roles/rules/deploy changes authorized.

**R882 review branch only; One UrAi Genesis production HOLD.**
