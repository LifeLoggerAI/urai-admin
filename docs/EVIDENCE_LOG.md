# URAI Admin Evidence Log

This file preserves release-verification evidence across Admin generations. Current status must bind to the live PR/release exact head plus current workflow/provider/runtime evidence; a dated historical section never transfers its PASS state to a successor SHA.

Do not mark systems GREEN without evidence.

---

## Current release authority — 2026-09-23

Release candidate: PR #75, `Finalize Admin truth boundary, WIF deployment authority, and release source`.

Exact candidate SHA: resolve from the **current PR #75 head at the same Git ref as this document**. This file intentionally does not hard-code its own commit SHA because editing the evidence log changes that SHA. GitHub PR head + exact-head workflow receipts are the authoritative identity pair.

Current source reconciliation completed on the release branch:

- production and governed provider identity is GitHub OIDC → Google Workload Identity Federation → short-lived ADC;
- long-lived `FIREBASE_TOKEN`, raw service-account JSON, private-key env slots, and `credentials_json` are not production authority;
- direct local production deployment is fail-closed; `scripts/deploy-production.sh` requires GitHub Actions, `refs/heads/main`, a temporary WIF/ADC credential file, and the exact approved target SHA;
- rollback documentation no longer directs an operator to invoke local `pnpm deploy`;
- active Functions/runtime authority is Node 22;
- canonical role mutation authority is `PUT /api/admin/users/[uid]/role`;
- `POST /api/admin/update-user-role` is a deprecated compatibility alias only and uses the same guarded mutation service;
- the old `control-plane/*` MVP and disconnected coordination loop are explicitly legacy/dormant and are not live-health, deployment, or autonomous-remediation authority;
- the public informational shell and protected `/admin/*` operator console are explicit separate surfaces.

Current external/runtime observation before deployment of this candidate:

- `https://uraiadmin.com` and `https://urai-admin.web.app` still serve an older Admin generation;
- live `/api/health` still exposes the fixed May 20, 2026 timestamp, proving the current candidate is **not** the deployed runtime;
- unauthenticated `/api/admin/users` still returns `401`, which is valid evidence only for that older deployed runtime;
- exact deployed SHA, Hosting release identity, current Functions revisions, WIF principal, Cloud Audit attribution, Auth-domain state, monitoring, and distinct-revision rollback remain provider/runtime evidence gates.

**Current classification: SOURCE RECONCILED / FRESH EXACT-HEAD PROOF REQUIRED / INDEPENDENT REVIEW + PROTECTED RUNTIME ACCEPTANCE + GOVERNED MERGE/DEPLOYMENT BLOCKED UNTIL THEIR OWN EVIDENCE EXISTS.**

All dated sections below this point are **historical receipts**. They remain useful evidence for the exact commits/runs named inside them, but their GREEN/MERGED/BLOCKED labels are not current release verdicts.

---

## 2026-06-30 — Post-merge CI and production-verifier receipts

Operator: ChatGPT URAI Repo Completion / Last-Mile Production Agent
Repo: `LifeLoggerAI/urai-admin`
Default branch: `main`

### Pull request and commit receipts

| Item | Result | Evidence |
|---|---:|---|
| PR #34 merged | PASS | Merge commit `8ed4d469b699fd1e4390e54887d9fa8195793f8c` |
| PR #35 merged | PASS | Merge commit `ed4c3f29cfa9b238b868202ff11efa73f65a00c2` |
| Deploy workflow hardened on main | PASS | Commit `98c018ab2b458e98349d71cda1295f59a7c7ff45` |

### Green CI receipts for PR #35 head

PR #35 head `2cf51782bf392d9439c87db37ffad9463f03c251` completed all source-verification workflows successfully before merge.

| Workflow | Run ID | Result |
|---|---:|---:|
| Validate URAI Admin | `28447434716` | PASS |
| URAI Admin CI | `28447434737` | PASS |
| URAI Production Verify | `28447434738` | PASS |

The passing source gates include dependency install, security gate, active Functions typecheck/build, lint, root typecheck, unit tests, production build, and production verifier.

### Historical main deploy workflow status

The text below records the June 30 workflow state. It is superseded for current release authority. The current production workflow is manual `workflow_dispatch` from `main` with explicit target/rollback SHAs and protected WIF/ADC identity.

At the time of this historical receipt, the deploy workflow existed at `.github/workflows/deploy.yml`. It runs `bash scripts/launch-lock.sh`, which performs:

- clean deployable tree check;
- `pnpm preflight:production`;
- `pnpm release:lock`;
- `pnpm run deploy:production`;
- `pnpm verify:production`;
- `pnpm test:smoke`.

On 2026-06-30, the deploy workflow was hardened on `main` to use Node 22 plus Corepack-pinned `pnpm@9.15.0`, matching the green CI setup instead of the older pnpm action path.

### Live verification result

| Check | Result | Notes |
|---|---:|---|
| `https://urai-admin.web.app` DNS reachability from execution runtime | BLOCKED / FAIL | Runtime check returned DNS resolution failure: `Could not resolve host: urai-admin.web.app`. |
| Firebase production deploy proof | BLOCKED | Requires GitHub Actions deployment run artifact or Firebase console/CLI evidence. |
| DNS/SSL proof | BLOCKED | Requires live reachable URL after deploy and/or provider-side proof. |
| Owner/admin seed proof | BLOCKED | Requires Firebase Auth/Admin access. |
| Custom claims proof | BLOCKED | Requires Firebase Admin/Auth access. |
| Monitoring/rollback proof | BLOCKED | Requires production environment access and runbook execution evidence. |

### Historical 2026-06-30 verdict

For the exact June 30 commits named in this section, source and CI status was **GREEN / MERGED**.

That statement is historical only. It is not the verdict for PR #75 or any later successor.

Production/live status at that time was **NOT VERIFIED** until a Firebase deployment succeeded and live URL smoke tests passed.

Do not mark this repo `DONE DONE / DEPLOYED` in the global URAI release plan yet. Mark it as: **DONE BUT NEEDS EXTERNAL DEPLOY ENV + LIVE DNS/SMOKE RECEIPTS**.

---

## Verification session

Date: 2026-06-30
Operator: ChatGPT URAI Admin / Operator Surface Full Due Diligence + Production Completion Agent
Repo: LifeLoggerAI/urai-admin
Branch: production-lock-admin-20260630
Commit SHA: branch head after completion work; see proof folder and PR head
Firebase project: BLOCKED - requires operator console/secret access
Hosting target/site: BLOCKED - requires Firebase Hosting access
Environment: GitHub connector source inspection and safe repo edits only

---

## Source-of-truth verification

| Item | Status | Evidence | Notes |
|---|---|---|---|
| Repo verified | PASS | GitHub connector repo metadata | Repo access confirmed, default branch `main`, visibility public |
| Branch verified | PASS | PR #34 and PR #35 merged | Source hardening and CI/verifier follow-up merged to `main` |
| Firebase project verified | BLOCKED | none | Requires Firebase console or CLI auth |
| Hosting target verified | BLOCKED | none | Requires Firebase console or CLI auth |
| Staging/prod separation verified | BLOCKED | none | Requires environment/provider verification |
| Env/secrets verified | BLOCKED | none | Must be done outside public repo |
| CI workflows verified | PASS | Run IDs `28447434716`, `28447434737`, `28447434738` | Validate, Admin CI, and Production Verify passed on PR #35 head before merge |
| Deployment path verified | PARTIAL | `.github/workflows/deploy.yml`, `scripts/launch-lock.sh` | Deploy commands exist and workflow is hardened; live deploy proof not captured |
| Rollback path verified | PARTIAL | source scripts/docs | Rollback command exists but no rollback execution proof |

---

## 2026-06-30 — Done-done source completion session

Starting state:

- Prior proof report: `launch-proof/urai-admin-production-lock/20260630T000000-0500/AUDIT_REPORT.md`
- Prior proof commit: `17458d90459e25ba5d2cf04035f3ee277a001424`
- Prior verdict: BLOCKED
- Prior readiness: 58/100

Source-level changes made on branch `production-lock-admin-20260630`:

- Added typed confirmation for admin activation/deactivation before calling `/api/admin/set-user-active`.
- Added typed confirmation for admin role changes before calling `/api/admin/update-user-role`.
- Added explicit `GRANT OWNER` confirmation phrase for owner escalation.
- Added typed confirmation for feature flag toggles before calling `/api/admin/set-flag`.
- Minimized `privacyRequests` output in `/api/admin/collection` to status/request metadata only.
- Expanded sensitive-key redaction patterns for generic admin collection output.
- Updated dashboard copy so the shell says `Awaiting deploy proof` instead of implying production-live runtime health.
- Updated `FINAL_LOCK.md` truthfully: source hardening improved, production remains blocked.

Commands verified by GitHub Actions after PR #35:

| Command / gate | Status | Evidence |
|---|---:|---|
| Dependency install | PASS | `URAI Admin CI` run `28447434737` |
| Security gate | PASS | `URAI Admin CI` run `28447434737` |
| Active Functions typecheck/build | PASS | `URAI Admin CI` run `28447434737` |
| Lint | PASS | `URAI Admin CI` run `28447434737` |
| Root typecheck | PASS | `URAI Admin CI` run `28447434737` |
| Unit tests | PASS | `URAI Admin CI` run `28447434737` |
| Production build | PASS | `URAI Admin CI` run `28447434737` |
| Admin validation workflow | PASS | `Validate URAI Admin` run `28447434716` |
| Production verifier | PASS | `URAI Production Verify` run `28447434738` |

External proof still required:

- Firebase project/env/secret verification;
- owner/admin seed proof;
- Firebase custom claims proof;
- Firestore/Storage rules deploy proof;
- staging deploy and smoke proof;
- production deploy proof;
- DNS/SSL proof for the chosen admin URL;
- monitoring proof;
- rollback execution proof;
- owner approval.

---

## Firestore rules verification

Required evidence:

- unauthenticated user denied;
- authenticated non-admin denied;
- inactive admin denied;
- viewer limited to viewer-safe collections;
- active admin allowed for privileged reads;
- audit and operational event records immutable after create;
- no raw consumer data exposed through broad rules.

Status: BLOCKED
Logs: Source rules are deny-by-default, but emulator/live proof is not recorded.
Blockers: Run `pnpm test:rules` and record emulator output.

---

## Storage rules verification

Required evidence:

- non-admin denied protected access;
- admin-only paths verified;
- unsafe public writes denied.

Status: BLOCKED
Logs: Source rules deny all Storage reads/writes, but emulator/live proof is not recorded.
Blockers: Run Storage rules tests or deploy/staging smoke proof.

---

## Auth verification

Required evidence:

- `/admin/*` requires session;
- `/api/admin/*` requires verified admin session;
- invalid/expired sessions fail closed;
- inactive admins denied.

Status: PARTIAL / BLOCKED
Logs: Source middleware and server helper implement the intended checks. No live or E2E proof recorded.
Blockers: Run route contract/E2E tests and staging smoke.

---

## Deployment verification

Required evidence:

- public routes load;
- protected routes enforce auth;
- unauthenticated `/api/admin/users` returns `401`;
- no broken assets;
- Firebase Hosting deployment ID recorded;
- Functions deployment ID recorded;
- DNS/SSL verified.

Status: BLOCKED
Logs: `https://urai-admin.web.app` did not resolve from the execution runtime on 2026-06-30.
Blockers: Confirm Firebase hosting site, deploy with configured secrets, and rerun live smoke tests.

## Final production verification

Final status: pending final green verification receipt.
