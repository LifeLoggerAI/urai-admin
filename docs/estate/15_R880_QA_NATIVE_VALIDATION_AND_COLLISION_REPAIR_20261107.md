# R880 — Admin QA exact-blob native validation and evidence collision repair (2026-11-07/08 UTC)

**Production decision: HOLD. No production operations, provider changes, IAM mutations, paid compute, or merges.**

## Worker state / source ancestry

Original Admin controller [#85](https://github.com/LifeLoggerAI/urai-admin/pull/85) still open draft; stacked #100–#105 remain unmerged. R879 [#105](https://github.com/LifeLoggerAI/urai-admin/pull/105) exact head `4be53e932390cd5a64ad2d48e0baabf956ebbf77`, four GitHub Actions workflows reported FAILURE with zero observed steps and no artifacts; cause not proven from connector. Independent child [#106](https://github.com/LifeLoggerAI/urai-admin/pull/106) R880 head `f4d4232c041154562da0a0ce2c7bf8fc510a54d2`, exact base `4be53e932390cd5a64ad2d48e0baabf956ebbf77`, 3 commits ahead/0 behind, only three changed files.

## Verified defects

1. `apps/urai-admin/test/qa-artifact-boundary.behavior.test.mjs` at old blob `c0ca09cb8778dada62b2877ef3c747b20b41b0ce` has a malformed final `test(...fixture(...))` closing delimiter (`});` instead of `}));`); local Node 22.16.0 `node --check` rejected this exact source with missing-closing-parenthesis SyntaxError before testing. New blob `e5fb42c4238d4e166f053c070e57a1c629115466` is syntactically valid.
2. `apps/urai-admin/src/lib/qa/safe-snapshot-summary.mjs` at old blob `d3954a7a195bef5b16a4dbac36b0f7494110176f`: distinct screenshot keys `a/b` and `a_b` map to identical filename stem `a_b` and `qaDiffSummary` produced identical diff/prev/curr locators for different keys. This was reproduced locally against exact blob-matched source. New blob `7c5042270181b6ba5a2ce5d54756b30da432dbae` enforces unique sanitized screenshot stems when parsing snapshots, failing closed on collisions. Test blob `1fbc7899c62fb312a705f4121f0f0d10d9573138` adds explicit collision-denial and independent-safe-key acceptance.

## Native verification — exact source bytes

Node 22.16.0 local container, reconstruction at the exact source text from GitHub with Git blob SHA parity confirmed for each of six files:

| File | Git blob SHA |
| --- | --- |
| `apps/urai-admin/src/lib/qa/guarded-artifact-read.mjs` | `3dfa47f1b2715076ad8e372afe3a01dddc8f7572` |
| `apps/urai-admin/src/lib/qa/guarded-snapshot-list.mjs` | `ee2ad5bef6eb1fe174d75d39f8fb2730fbbe76a2` |
| `apps/urai-admin/src/lib/qa/safe-snapshot-summary.mjs` | `7c5042270181b6ba5a2ce5d54756b30da432dbae` |
| `apps/urai-admin/test/qa-artifact-boundary.behavior.test.mjs` | `e5fb42c4238d4e166f053c070e57a1c629115466` |
| `apps/urai-admin/test/qa-snapshot-list.behavior.test.mjs` | `f022e265817029096709f26d027bffe8371a4433` |
| `apps/urai-admin/test/qa-snapshot-summary.behavior.test.mjs` | `1fbc7899c62fb312a705f4121f0f0d10d9573138` |

**Results:** `node --check` all six PASS; `node --test` the three source-test files **24/24 PASS**, exit code 0. TAP stdout SHA256: `cf7285f10c545eca0aca2f9af8d89c17ced04a82fbe63465ffc806a9059c04d6`. These are native *isolated* QA filesystem/parser behavior tests, not fake/mocked results, but they do not verify the full pnpm workspace, Next.js route compilation, Firebase Auth, provider IAM, live device, UI or production deployment.

## CI verification

At R879 base head `4be53e9` all four workflows failed: CI `42440946266`, Production Verify `42440946280`, Validate `42440946271`, Visual `42440946449`. Jobs each showed zero recorded steps and artifact listings empty. This suggests an external runner/Actions execution blocker is plausible, but **does not prove billing as root cause** or that source tests passed. Git HTTPS checkout in container failed DNS resolution to github.com; no repo-complete frozen pnpm install or native monorepo test was run. Recheck new #106 exact head and jobs before asserting future success.

## Remaining P0 / P1

P0: actual Actions execution diagnostics, frozen full install/typecheck/tests/build/emulators on merged candidate; current effective shared Firebase Rules and dedicated Functions publisher ownership, read-only IAM/server SDK scope, revoked/downgraded owner/admin/viewer and cross-user/tenant private memory/media/consent negative acceptance, exact deployed SHA and rollback authority. P1: TOCTOU/parent directory swap hardening for QA path and snapshot listing, concurrent file modifications, producer-generated screenshot filename collision avoidance, browser interface compatibility and raw artifact retention/minimization, cross-system connections and accessibility testing.

**No release GO.** Preserve prior workers' branches and original source history.
