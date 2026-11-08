# R883 — Admin combined exact-blob native tests and GitHub Actions admission diagnosis (2026-11-07/08 UTC)

**Decision: PRODUCTION HOLD.** This continuation made **no Admin application/security code changes** and did not merge, deploy, change Firebase IAM/Rules, modify user accounts, authorize billing or use paid runners. All source workers #85/#100–#108 remain open and independent; last security head is [draft PR #108](https://github.com/LifeLoggerAI/urai-admin/pull/108) at `67a48d342627524d384b15771723321abff73e20`.

## Source material and native evidence

Local Node `v22.16.0`, TypeScript transpiler available from a preinstalled global package; no frozen pnpm workspace install. Nine **selected** files reconstructed from previous exact GitHub source retrieval and verified again against GitHub **at the R882 head**. Each local `git hash-object` matched the corresponding GitHub Git blob:

| GitHub file (relative to apps/urai-admin) | Git blob |
| --- | --- |
| `src/lib/admin/require-admin-session.ts` | `9d3fc6ba9d873f8b964032a57a52116a60e60b44` |
| `test/admin-current-auth-claims.behavior.test.mjs` | `bdbc302bbc527b6d9c351d300e375c158d3c2491` |
| `test/admin-session-exchange-authority.behavior.test.mjs` | `4d874b5dc9736aa2954f105f1f13a8dc7dfae86c` |
| `src/lib/qa/guarded-artifact-read.mjs` | `3dfa47f1b2715076ad8e372afe3a01dddc8f7572` |
| `src/lib/qa/guarded-snapshot-list.mjs` | `ee2ad5bef6eb1fe174d75d39f8fb2730fbbe76a2` |
| `src/lib/qa/safe-snapshot-summary.mjs` | `7c5042270181b6ba5a2ce5d54756b30da432dbae` |
| `test/qa-artifact-boundary.behavior.test.mjs` | `e5fb42c4238d4e166f053c070e57a1c629115466` |
| `test/qa-snapshot-list.behavior.test.mjs` | `f022e265817029096709f26d027bffe8371a4433` |
| `test/qa-snapshot-summary.behavior.test.mjs` | `1fbc7899c62fb312a705f4121f0f0d10d9573138` |

Executed `node --test` on the five test files above in a single fresh local selected-file source tree: **41 tests, 41 PASS, 0 FAIL, 0 skipped**, exit 0. Output TAP SHA256 `4b35216dcd905f4f63bcf73dc048cf5133c34e20268a8840426d982c2992d37f`. Source manifest SHA256 `40bad37007b7b4e77355ccc4b59326a5bde73bfbc5644b1ccdcd5cdeaec49d46`. The local evidence contains exact per-file SHA256 and Git blob hashes; local output is not a GitHub artifact and has not been uploaded into production.

Scope: real source logic transpiled for auth tests with synthetic Next/Firebase dependencies, plus real disposable filesystem QA tests. The first combined attempt failed *setup only* because TypeScript could not resolve in a newly copied local directory; linking the existing preinstalled TypeScript package without changing any source made the full combined 41/41 PASS. Do not misclassify that initial environment setup failure as a product test failure. **This is not the full repository checkout, pnpm frozen install, TypeScript whole-program typecheck, Next/Functions build, Firebase Auth/Firestore/Storage/Functions emulator, production IAM or real user privacy denial.**

## Current exact-head Actions: provider/runner admission, not test outcomes

PR #108 exact head `67a48d342627524d384b15771723321abff73e20` has four completed FAILURES, each *three seconds*, with **no runner name and no job steps**:

| Workflow | Run / job | Declared runner |
| --- | --- | --- |
| URAI Admin CI | `42442711268` / `128615137592` | `macos-latest` |
| Validate URAI Admin | `42442711289` / `128615137674` | `ubuntu-latest` |
| Admin Analytics Visual Truth Proof | `42442711299` / `128615137715` | `ubuntu-latest` |
| URAI Production Verify | `42442711257` / `128615137894` | `ubuntu-latest` |

Provider readback does not show the tests, checkout or builds starting. Failure spans both macOS and Ubuntu; changing CI's OS alone is not a justified remedy. Exact current Admin job logs/annotations remain inaccessible; root cause **for these specific runs** is not directly proven.

Independent historical provider evidence: retained GitHub Support case **#4889576** includes an explicit GitHub job annotation for public `LifeLoggerAI/asset-factory` run `41792607935`, job `126449246409` (Nov 4): **“The job was not started because your account is locked due to a billing issue.”** The GitHub support reply last observed Oct 29 said the ticket had been escalated; the latest case follow-up found was sent Nov 5. This identifies a real *account-level* billing-lock condition for earlier runner failures, consistent with cross-repo three-second/zero-step behavior, but does not prove the current exact Admin failures carry that identical annotation. No new Support message was sent and no billing/2FA workaround attempted.

## Remaining acceptance priorities

P0: obtain supported GitHub Billing/Support restoration of standard Actions eligibility via existing case, then run **one permitted non-deploying exact-source workflow** and confirm runner steps/logs, and subsequently full frozen installs/native builds/emulator integration. Do not enable paid runners or rerun cost-incurring CI without owner authority.

P0: inspect effective shared `urai-4dc1d` Firebase IAM, service-account privileges, effective Rules and live Functions codebase ownership; resolve one source-pinned federated Rules publisher and the deliberately blocked `default` Functions namespace without unauthorized deployment. Test actual owner/admin/viewer, cross-user/cross-tenant, revoked/deleted, raw memory/media/consent denial and source-bound rollback.

P1: complete QA directory-swap TOCTOU and saved raw console/log retention review, Admin integration with Privacy/Jobs/Studio/Analytics/Communications/RuAi, accessibility/device acceptance and organizational governance.

**No new security-code PR was opened in R883: verified native evidence and external runner admission are the current gating work.** Preserve all prior worker branches and HOLD.
