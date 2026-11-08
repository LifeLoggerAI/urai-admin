# R878 — Admin QA image file containment review (2026-11-07/08 UTC)

**Production verdict: HOLD.** Continuation of [R877](12_R877_ADMIN_CLAIM_AND_CI_CONTINUATION_20261107.md) and [R876](11_R876_ADMIN_SECURITY_RECONCILIATION_20261107.md); all other engineering branches preserved.

## Exact source and new review PR

[Draft Admin PR #104](https://github.com/LifeLoggerAI/urai-admin/pull/104) is stacked directly on R877 [PR #103](https://github.com/LifeLoggerAI/urai-admin/pull/103), base `b0bb890fe8ca268341453c324bc849b014d1d020`, head `ba074d27e0e45b277a3692fdee38f17ed6204109`. GitHub compare observed four commits ahead, zero behind and exactly four changed files:

| Path | Scope | Source Git blob |
| --- | --- | --- |
| `apps/urai-admin/src/lib/qa/guarded-artifact-read.mjs` | New server-only guarded file read | `42d7af6166265b48503afafef4ac2129763bb1a2` |
| `apps/urai-admin/test/qa-artifact-boundary.behavior.test.mjs` | Twelve synthetic filesystem behavior cases | `c0ca09cb8778dada62b2877ef3c747b20b41b0ce` |
| `apps/urai-admin/src/app/api/qa/image/route.ts` | Use guarded image reads after owner-only session verification | `f3ae39c80acaf34828dd564221bb3a2ed3bc87dd` |
| `apps/urai-admin/package.json` | Run new behavior cases in app's original test command | `7ef7206b9af2edc9a114fd2e6bf471b7c3b2a811` |

## Vulnerability scope and mitigation

The previous QA image route blob `ddc4cc051c140f5bb30764277dad5111909fb75f` checked an absolute pathname lexically against `HOME/deploy_screenshots` or `HOME/deploy_diffs`, then read that pathname. A symlink inside an allowed directory could point to an outside regular image-extension file. The route was restricted to owner sessions, so the prior result is a **potential boundary bypass** under symlink presence, not proven disclosure or public access.

The proposed reader checks a strict directory and extension allowlist, canonical `realpath` equality to reject parent/file symlinks, uses `O_NOFOLLOW` for final open, checks regular file and 32 MiB ceiling (default), and closes the handle. The route retains owner authorization and no-store delivery. Synthetic denied cases include sibling-prefix and traversal, symlinked file to outside and inside, symlinked parent and root, wrong type, directory and oversize.

**Explicit residual:** canonicalization followed by opening the canonical path is not a complete defense against concurrent parent-directory replacement (TOCTOU) if an untrusted writer can mutate the QA tree. A production security reviewer must either enforce immutable root/directory ownership or use a race-resistant directory-handle/descriptor-based reader. `qa/logs`, `qa/diff` and `qa/snapshots` retain separate file/read path logic; do not extend this image-only receipt to them.

## Test and runtime evidence

Node 22.16.0 local synthetic filesystem test: **12/12 PASS**, exit 0. Syntax checks passed. Exact proposed helper Git blob `42d7af6166265b48503afafef4ac2129763bb1a2` matched locally computed `git hash-object` for the tested helper. This was not a full checkout; Git repository DNS was unavailable to the container, and full pnpm workspace install/emulator/TypeScript/Next build/production authorization at #104 were not executed. Test source was copied into the repository under the app's actual path and has its own Git blob. GitHub workflow readback at creation returned no exact-head runs; recheck before declaring workflow status.

## Remaining security boundaries

P0: Original engineering #85 remains unmerged. Preserve #100 Firestore/Storage Rules publishing fence and #101 shared-default Functions namespace HOLD; #102 source-contract repair, #103 signed admin claim and #104 QA reader remain draft. Confirm IAM and effective Firebase Rules, deployed SHA/Functions codebase, actual owner/admin/viewer negative private-data permissions, real provider receipt and source-bound rollback; none are established by this patch. P1: Parent symlink swap hardening, audit of QA logs/diff/snapshot path handling, audit minimization and cross-system Privacy/Jobs/Studio/RuAi/Analytics/Communications integration. No production changes, account permissions, secrets, live user data or paid resources touched.

**Decision: SOURCE-VERIFIED NARROW FIX + LOCAL SYNTHETIC TESTS; GLOBAL PRODUCTION HOLD.**
