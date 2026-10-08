# URAI Admin Rollback and Incident Runbook

This runbook prepares recovery for the canonical project `urai-4dc1d` and reviewed dedicated `urai-admin-production` Hosting target. Actual incident/recovery acceptance requires protected account, target, source and runtime readback.

## Immediate response

Freeze further releases, preserve the failing run/revision and safe logs, name the incident owner and determine whether the fault is app, Functions, rules, identity or DNS/TLS. Keep administrative and consumer data boundaries closed. Never discard audit or privacy evidence to make an incident appear resolved.

## Governed source recovery

Prepare a reviewed main-line revert or forward fix from the exact known-good source. Run fresh exact-head native checks and retain genuine independent review. Dispatch the existing protected `Deploy URAI Admin` workflow from main only after the approved target/rollback identities and production environment gate are eligible. Do not run direct local Functions/rules/Hosting deployment or rewrite main history.

The automatic recovery path validates the reviewed dedicated target on historical source before installation/deployment, rebuilds with the rollback SHA, verifies that SHA after deployment and retains a blocked outcome if target or rollback verification fails.

## Hosting-only recovery

A Hosting version clone is narrower than Functions, rules or data restoration. Invoke `pnpm rollback:production` only inside the approved protected main/WIF workflow context, with `URAI_ADMIN_TARGET_SHA`, a distinct exact ancestor `URAI_ADMIN_ROLLBACK_COMMIT`, the native known-good `URAI_ADMIN_ROLLBACK_RELEASE`, and matching protected `URAI_ADMIN_HOSTING_SITE`. The helper rejects an unbound, primary, sibling, foreign or multiple-site target before Firebase execution and verifies the restored source afterward. Never infer successful SSR Functions recovery from Hosting clone success alone.

## Source-bound public checks

```bash
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com \
URAI_ADMIN_EXPECTED_LIVE_SHA="REPLACE_WITH_APPROVED_40_CHARACTER_RESTORED_SHA" \
URAI_ADMIN_FUNCTIONS_BASE_URL=https://us-central1-urai-4dc1d.cloudfunctions.net \
pnpm verify:production
```

Current checks use app `/api/health`, Functions `/health` and `/readiness`, canonical Firebase runtime configuration and anonymous redirect/401 boundaries. Replace the placeholder with an actual approved source identity. Public checks do not substitute for authenticated recovery acceptance.

## Data restore boundary

Code, rules and Hosting rollback do not restore data. An authenticated backup/restore drill must use the existing governed backup policy and approved isolated target, preserve audit/legal-hold/privacy-operation receipts, respect completed deletions, validate tenant isolation and compare actual safe object digests/counts. Do not import a backup into production or recreate deleted private records without separate governed recovery authority. Record the native backup/restore identities and outcome; a runbook or synthetic fixture is preparation only.

## Incident closure

Require source-bound restored provider revision, current public checks, owner/admin/viewer login and logout, revoked-session and foreign-role denials, required audit persistence, preserved privacy evidence, configured alert readback and incident-owner acknowledgement. Retain root cause and follow-up owner. Record before/after source/Hosting/Functions/rules identities, exact workflow and principal, safe logs, test results, timestamps and artifact hashes in the Evidence Ledger. Until those actual outcomes exist, recovery remains BLOCKED.

