# R876 — Admin security and control-plane forensic continuation (2026-11-07)

**Verdict: PRODUCTION HOLD.** Source/metadata and existing GitHub Actions evidence reviewed, not a live authenticated admin certification. This continuation does not alter production accounts, IAM, Firebase Rules, Functions or private data.

## Exact immutable source snapshots

| Source | Ref | Git blobs / Git-reported bytes | Meaning |
| --- | --- | ---: | --- |
| Admin main | `1cde00e69238f6a32237af2d1914a1b77339d5bc` | 849 / 2,414,480 | Default branch, not candidate security fixes |
| Admin engineering PR #85 | `8313188532aef304a3b55771c5080f87e4ac71eb` | 906 / 2,161,713 | Existing owner/admin/viewer and audit enforcement candidate |
| Admin security PR #100 | `68db1919064f4fe05ec015a4b0e52240c071093a` | 906 / 2,163,675 | Proposed Firestore/Storage Rules publishing fence |
| Admin security PR #101 | `8cc77b555352ec817edb3a428e0a6e8762e039e0` | 908 / 2,169,592 | Proposed Functions namespace fail-closed gate; default namespace remains configured |
| R876 narrow repair branch | `repair/r876-admin-security-gate-contract-20261107` | See live head | Child of #101; repairs malformed source-contract assertion and adds Node test |

Non-truncated Git tree listing metadata only: per-path Git blob SHA1/modes/size available from GitHub recursive trees and existing [MANIFEST.json](MANIFEST.json) for main/#85. 91 branch tip names/comparisons are already recorded in [BRANCH_REFS_20261107.json](BRANCH_REFS_20261107.json), [BRANCH_COMPARISONS_20261107.json](BRANCH_COMPARISONS_20261107.json); history, deleted refs, LFS, raw content SHA256 and all 908 file bodies NOT independently audited by R876. Do not treat tree bytes as all-reachable object bytes.

## Verified source trust boundary (not live permission proof)

- `apps/urai-admin/src/lib/admin/require-admin-session.ts` validates Firebase session cookie (revocation), active canonical `adminUsers` role and `roleVersion`; mutation guards require allowed Origin and some flows recheck current actor claims.
- `apps/urai-admin/src/app/api/admin/collection/route.ts` uses collection/role allowlists. Viewer may read metadata from registry, flags, jobs, roles, config, aggregate weather and humanitarian operations; owner/admin can also read `privacyRequests` (minimized fields), audit records (sanitized) and `adminUsers`. Explicit job fields are minimized. Generic route does not list direct memories, private media, signed consent payload or raw population contributions.
- `apps/urai-admin/src/app/api/admin/update-user-role/route.ts` is owner-only; `set-user-active` checks target role before admin changes, prohibits self-deactivation, and attempts Auth claims revocation plus Firestore reservation/receipt.
- `apps/urai-admin/src/app/api/admin/set-flag/route.ts` uses mutation session and current actor revalidation before the institutional executor. Quorum/receipt proof is source and isolated-test evidence, not actual institutional authorization.
- `apps/urai-admin/src/app/api/qa/*` requires owner session to access local QA screenshot/log artifacts. Path-prefix validation in `qa/image` does not resolve symlinks; an independent symlink-escape negative test is pending before classifying this file-read boundary secure.
- `apps/urai-admin/src/lib/firebase/admin.ts` initializes Firebase Admin SDK under runtime ADC outside build stubs. Admin SDK bypasses Firestore client Security Rules. Actual runtime service principal/IAM permissions, capabilities to access private memories/media/consent and cross-project data remain UNVERIFIED. No categorical assertion that Admin cannot access private data is justified.
- `functions/src/index.ts` contains scheduled analytics aggregation using privileged Admin SDK reads of `analytics_events_raw_*`. This is a source path to raw telemetry; positive external ingestion in `apps/urai-analytics/src/app/api/v1/events/route.ts` intentionally returns HTTP503 pending canonical subject-purpose-deletion authority.
- Storytime moderation surface is **Not connected**, contract-only; no remote story-content reads/approve/release. Jobs/Admin collections expose metadata only in reviewed routes. Studio, Privacy, Communications and governance cross-project authority remain unverified.

## Cloud binding and shared-provider hazards

Candidate `.firebaserc` selects Firebase project `urai-4dc1d`; `urai-admin-production` maps to `urai-admin` Hosting site in repo source. Candidate `firebase.json` still declares Functions `codebase: default`. Spatial/RuAi source references the same project with competing policy/Functions contracts; live IAM/rule versions, deployed site and function lists not retrieved. #100 prevents Admin deployment from publishing global Firestore/Storage Rules; #101 refuses default/ambiguous Functions codebase before auth/migration, but remains an unmerged fail-closed proposal. Firebase Storage client deny-all rules do not constrain privileged Google Cloud IAM. No rule ownership or codebase migration performed.

## CI and source-pinned evidence ledger

- #85 `8313188`: GitHub returned 8/8 workflow successes: CI `38010329537`, Validate `38010329652`, Visual `38010329622`, Production Verify `38010329728` plus predecessor success cohort. Existing pack reports 52/52 Functions cases, 28 audit cases and 27/27 isolated Auth/Firestore emulator, subject to original archive/step verification. Green workflow != live production deploy.
- #100 `68db191`: GitHub returned **4/4 workflow failures** (CI `42352827352`, Production Verify `42352827282`, Visual `42352827288`, Validate `42352827321`).
- #101 `8cc77b5`: GitHub returned **4/4 workflow failures** (CI `42353547214`, Production Verify `42353547186`, Visual `42353547193`, Validate `42353547185`). Attempts to retrieve job logs returned `BlobNotFound`; failure root cause has NOT been independently proven.
- R876 found actual malformed `scripts/security-gate.sh` assertion in #101 Git blob `e7a86b11faeaa7cd5b8574ed254ad6b6993d88f0`: shell parses it but feeds four arguments into `required_pattern`, accidentally joining Hosting and Functions gate checks. Safe local Bash argument reproduction confirmed four arguments. The isolated repair branch fixes these into three distinct lines, commit `8d421e9fac6973c5ef682418f4b5645762964fb8`, and adds source-contract regression test commit `e6326e0fe2e3c8440994a9bb16740581330de128`.
- Local Node 22.16.0: 3/3 focused source-contract tests PASS **using a minimal synthetic fixture reproducing exact lines**, plus syntax checks; this is NOT the full Admin checkout and does not cancel failed #101 workflows.

## RBAC / permissions ledger (source-level)

| Actor | Admin read API | Mutation API | Direct private media/memory or signed consent | Confidence |
| --- | --- | --- | --- | --- |
| Anonymous | Denied by canonical protected routes | Denied | No reviewed route | Source-only; live negative tests pending |
| `viewer` | Config, registry, operational jobs/aggregate metadata | No | No reviewed route | Source-only; live negative tests pending |
| `admin` | Viewer plus privileged adminUsers, audit, minimized privacyRequest metadata | Feature flags and some lower-role user activation (conditional), no role mutation | No reviewed route | Source-only; live negative tests pending |
| `owner` | Privileged Admin reads and QA snapshots/logs | Admin role/activation/recovery, feature flags | No reviewed generic route; server credential scope unknown | Source-only; live negative tests pending |
| Runtime service identity | Access via Firebase Admin SDK, bypassing Firestore Rules | According to IAM and code | **Potential IAM reach unverified** | Cloud inspection required |

## Worker disposition / acceptance priority

Preserve existing Admin #85 engineering, #99 docs, #100 global Rules publishing fence and #101 Functions namespace hold as separate unmerged work; do not silently merge, overwrite or migrate. Earlier #92/#93 audit minimization, #94 distinct reviewer quorum, #95 positive receipts, #97 actor recheck and #98 terminal retry repair are already represented in the #85 history. Other divergent historical branches remain documented, not semantically closed.

P0: (1) repair/test #101 gate and fresh exact-head CI; (2) independent unified Firestore/Storage Rules publisher ownership, actual current project rules and tenant/owner deny tests; (3) Functions codebase ownership and no-delete migration review; (4) protected server IAM, actual Admin Firebase Auth claims, owner/admin/viewer negative and positive tests; (5) deployed Hosting/Functions source SHA plus rollback drills; (6) explicit no-memory/no-media/no-consent policy, cross-provider boundaries and deletion tests. P1: QA symlink-escape test/hardening, audit metadata minimization, external Storytime/Communications/Jobs/Privacy/Studio integration, physical browser/device and accessibility acceptance.

**Release HOLD.** This document is an addendum to PR #99 rather than a replacement for #85 or #100/#101.
