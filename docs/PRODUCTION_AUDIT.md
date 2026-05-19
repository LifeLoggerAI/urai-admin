# URAI Admin Production Audit

Date: 2026-05-18
Verdict: **BLOCKED** until command, staging, production, DNS/SSL, monitoring, rollback, legal, admin seed, and owner approval evidence is recorded.

## Scope

This audit covers the `LifeLoggerAI/urai-admin` repository as the URAI Admin / Council operations control plane.

## Findings

| Area | Finding | Status | Required action |
| --- | --- | --- | --- |
| Runtime | pnpm workspace, Next.js app, Firebase Hosting/Functions, Node 20 runtime are present | Partial | Verify clean install/build in CI |
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
