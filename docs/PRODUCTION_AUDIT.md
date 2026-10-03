# URAI Admin Production Audit

Historical audit date: 2026-05-18
Historical verdict: **BLOCKED** until command, staging, production, DNS/SSL, monitoring, rollback, legal, admin seed, and owner approval evidence is recorded.

> Historical evidence only. This file preserves the May 18 audit and is not current release-state authority. Current release authority lives in the active release PR, `FINAL_LOCK.md`, `docs/EVIDENCE_LOG.md`, exact-head GitHub Actions, protected provider readback, and live runtime evidence. The current Functions runtime is Node 22; the Node 20 finding below records the historical audit state.

## Scope

This audit covers the `LifeLoggerAI/urai-admin` repository as the URAI Admin / Council operations control plane.

## Findings

| Area | Finding | Status | Required action |
| --- | --- | --- | --- |
| Runtime | At the May 18 audit, pnpm workspace, Next.js app, Firebase Hosting/Functions, and Node 20 runtime were present | Historical / superseded | Current release source locks Functions to Node 22; verify the current exact head instead |
| Auth | Firebase Auth/session-cookie model is documented | Partial | Confirm protected routes and backend handlers verify session and admin role |
| Authorization | Firestore rules require active `adminUsers/{uid}` and custom claims | Partial | Add emulator tests for unauthenticated, non-admin, viewer, admin, owner |
| Firestore | Deny-by-default rules and production-lock collections are present | Partial | Deploy to staging and verify rules/indexes |
| Audit logs | Immutable create patterns are added for admin audit and operational event collections | Partial | Confirm backend writes include `createdAt == request.time` |
| System registry | Static registry exists | Partial | Seed `systemRegistry` and render live status in UI |
| Release evidence | Final lock and verifier exist | Partial | Record actual command/deploy evidence |
| Analytics | Workspace scripts exist | Partial | Add live health/status card and explicit data boundary |
| Communications | Registry contract exists | Blocked | Add health contract or approved deferral |
| Privacy | Boundary is documented | Partial | Verify legal routes and policy links live |
| Monitoring | Not evidenced | Blocked | Add alert/logging dashboard and incident owner |
| Rollback | Rollback helper exists | Partial | Record known-good release/SHA and dry-run/real rollback proof |
| Owner approval | Not recorded | Blocked | Owner signoff required before production ready |

## Non-negotiable blockers

- Do not claim production ready without staging smoke evidence.
- Do not claim production ready without production DNS/SSL evidence.
- Do not claim production ready without admin seed proof.
- Do not claim production ready without owner approval.
- Do not expose raw consumer passive telemetry in admin routes without privacy approval.

## Required evidence locations

- `FINAL_LOCK.md` for final gate state.
- `docs/EVIDENCE_LOG.md` for command/deploy evidence.
- GitHub Actions runs for CI proof.
- Firebase Console or deploy logs for hosting/functions/rules proof.
