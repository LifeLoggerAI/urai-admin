# URAI Admin Runbook

## Severity levels

- SEV1: production unavailable, admin lockout, active data exposure, or unauthorized privileged access.
- SEV2: degraded operations, failed jobs, partial deploy failure, or analytics/communications outage.
- SEV3: documentation mismatch, non-critical UI defect, or missing non-production evidence.

## SEV1 actions

1. Freeze deployments.
2. Preserve logs and current commit SHA.
3. Disable affected route/function if needed.
4. Rotate exposed secrets if any.
5. Run rollback using `pnpm rollback:production` when hosting rollback is appropriate.
6. Record incident notes and timeline.
7. Re-open production lock as `BLOCKED` until root cause is fixed.

## Admin lockout

1. Verify Firebase Auth is reachable.
2. Verify owner custom claims.
3. Verify `adminUsers/{uid}.isActive == true`.
4. Re-run `pnpm bootstrap:owner` only with confirmed owner UID/email.
5. Record all actions in audit/evidence logs.

## Firestore rules incident

1. Stop deploys.
2. Confirm deployed rules version.
3. Revert to known-good rules commit or deploy locked rules from known-good SHA.
4. Run rules tests and smoke tests.
5. Record evidence in `docs/EVIDENCE_LOG.md`.

## Failed release

1. Do not promote preview to production.
2. Mark `FINAL_LOCK.md` verdict as `BLOCKED`.
3. Capture failed command output.
4. Open or update a GitHub issue/PR with blockers.

## Communications/analytics outage

If live integration is unavailable, admin UI must show `Not connected`, `Blocked`, or `Degraded`, not `Healthy`.
