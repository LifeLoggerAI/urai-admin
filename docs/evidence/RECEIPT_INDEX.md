# URAI Material Receipt Index

Status date: 2026-07-06

No item may be described as implemented, deployed, integrated, promoted, or verified without a row in this index or an immutable workflow artifact linked from the row.

## Receipt schema

Each material receipt records:

- receipt ID and UTC timestamp;
- repository, branch, and exact commit SHA;
- issue and pull request;
- changed files;
- test commands and results;
- workflow names, run IDs, and artifacts;
- build result;
- deployment environment and target;
- deployed SHA and public URL;
- external runtime checks;
- provider/model/request/cost receipt where applicable;
- asset expected/succeeded/failed counts and checksums where applicable;
- rollback SHA and provider release/version;
- unresolved caveats.

## Current execution receipts

| Receipt ID | Classification | Repository | Branch / SHA | PR / issue | Material result | Verification | Deployment | Caveats / next evidence |
|---|---|---|---|---|---|---|---|---|
| `RCP-ADM-DEPLOY-20260706-01` | IMPLEMENTED BUT NOT DEPLOYED | `LifeLoggerAI/urai-admin` | `audit/p0-manual-production-deploy-gate-20260706` / `e33efe7986730a31395f0068ce46dd9abf223b01` | PR #40 | Removed automatic main-push production deployment; added main-ref, exact-SHA, confirmation, ancestor, no-persisted-credentials, security-gate, and runbook controls | Initial three checks passed before review; review findings fixed; rerun pending | None | Merge only after all updated checks pass; external GitHub production environment must allow only `main` and require reviewers |
| `RCP-ADM-AUTH-20260706-01` | IMPLEMENTED BUT NOT DEPLOYED / PARTIAL | `LifeLoggerAI/urai-admin` | `security/p0-admin-session-coherence-20260706` / PR head | PR #42 / issue #41 | Server refuses stale-claim cookie issuance, requires recent auth and same-origin, uses strict cookie, preserves claims, and revokes role-change sessions with compensation | CI pending | None | Client automatic retry, legacy role endpoint, activation revocation, build stub, and emulator/browser proof remain unresolved |
| `RCP-JOBS-VERSION-20260706-01` | IMPLEMENTED BUT NOT DEPLOYED | `LifeLoggerAI/urai-jobs` | `fix/canonical-v1-v5-release-contract-20260706` / `331c720f284d9dd085ccaae08c5d021eaa7cc147` | PR #72 | Aligned release planner with canonical Asset Factory V1–V5 labels/counts/prefixes; moved Quest proof from V3 to V4 | CI pending | None | No provider call, asset promotion, worker execution, or deployment performed |
| `RCP-LEDGER-20260706-01` | VERIFIED IN REPOSITORY / documentation branch | `LifeLoggerAI/urai-admin` | `execution/ecosystem-completion-ledger-20260706` / branch head | PR pending | Added executable ecosystem completion ledger, repository ownership source of truth, version certification, and receipt rules | PR checks pending | None | Ledger statuses must be updated by the PR that changes each work item |

## Provider and asset receipts

| Version | Canonical expected outputs | Current certification | Receipt location | Blocker |
|---|---:|---|---|---|
| V1 | 53 | PARTIALLY IMPLEMENTED | Not yet indexed | Exact provider/promotion/checksum/runtime-wiring receipt required |
| V2 | 80 | BLOCKED | Asset Factory issues #134 and #138 | Latest paid forge hit `billing_hard_limit_reached`; cost controls and exact 80/80 receipt required |
| V3 | 14 | BLOCKED | Asset Factory issues #138 and #140 | Exact provider handoff and executable contract consistency required |
| V4 | 39 | BLOCKED | Asset Factory issues #138 and #140 | Exact XR provider handoff plus Quest/device evidence required |
| V5 | 27 | BLOCKED | No provider receipt indexed | Cost-control gate and exact provider/runtime receipt required |

## Production baselines

| System | Deployed SHA | Rollback SHA/release | Environment | Public URL | Status |
|---|---|---|---|---|---|
| Public spatial app | Not established | Not established | Production target `urai-4dc1d` | `https://urai.app` | BLOCKED pending deployment/provider evidence and external verification |
| Admin | Not established | Not established | Production target `urai-4dc1d` | Default candidate `https://urai-admin.web.app`; custom domain unresolved | BLOCKED pending production environment and Firebase evidence |

## Receipt validation rule

A row may move to **VERIFIED LIVE** only after the deployed SHA, rollback target, environment, public URL, external runtime checks, monitoring state, and applicable provider/device evidence are populated. Green source CI alone is not a live receipt.
