# URAI Admin Monitoring and Observability Runbook

This runbook defines the minimum monitoring and observability expectations for URAI Admin production at `https://www.uraiadmin.com`.

## Core production signals

Monitor these signals continuously after launch:

- Public homepage availability: `https://www.uraiadmin.com/`
- Login page availability: `https://www.uraiadmin.com/login`
- Protected admin route behavior: `https://www.uraiadmin.com/admin`
- Anonymous API blocking: `https://www.uraiadmin.com/api/admin/users` returns `401`
- Functions health: `https://us-central1-urai-4dc1d.cloudfunctions.net/health`
- Functions readiness: `https://us-central1-urai-4dc1d.cloudfunctions.net/readiness`
- Current session API: `/api/auth/admin-session` returns `401` anonymously
- Firebase Hosting 4xx/5xx trends
- Firebase Functions errors and latency
- Firestore read/write errors
- Admin login failures
- Audit log write failures

## Required synthetic check

Run this command on a schedule from CI, an uptime monitor, or an operator machine:

```bash
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com \
URAI_ADMIN_EXPECTED_LIVE_SHA="REPLACE_WITH_APPROVED_40_CHARACTER_LIVE_SHA" \
URAI_ADMIN_FUNCTIONS_BASE_URL=https://us-central1-urai-4dc1d.cloudfunctions.net \
pnpm verify:production
```

Recommended frequency:

- Every 5 minutes during launch day.
- Every 15 minutes after launch is stable.
- Immediately after every deploy.

Replace the SHA placeholder with the current approved deployed source. The
verifier performs public source/readiness and anonymous-denial checks only;
authenticated role/session, audit, provider and recovery acceptance is separate.
This runbook does not assert that a scheduled monitor, alert policy or paging
route is already configured. Retain native policy identities and one owned,
non-destructive test-alert acknowledgement before calling alerting operational.

## Firebase Console checks

After every production deploy, inspect:

- Hosting release status.
- Functions deploy status.
- Functions logs for errors.
- Firestore rules deploy status.
- Storage rules deploy status.
- Authentication sign-in activity.

## Alert thresholds

Create alerts for:

- Homepage unavailable for 2 consecutive checks.
- `/api/admin/users` does not return `401` anonymously.
- Functions health fails once after deploy or twice in steady state.
- Functions error rate above normal baseline.
- Repeated admin login failures for known owner/admin users.
- Any accidental permissive rule change detected by `pnpm security:gate`.

## Launch-day watch procedure

For the first production launch:

1. Keep GitHub Actions deploy run open.
2. Keep Firebase Hosting open.
3. Keep Firebase Functions logs open.
4. Run `pnpm verify:production` immediately after deploy.
5. Manually test owner login and logout.
6. Confirm audit logs are written.
7. Watch for at least 30 minutes after launch.

## Incident triggers

Open an incident if any of these happen:

- Production verifier fails.
- Owner/admin cannot sign in.
- Anonymous access reaches protected admin API.
- Firestore or Storage rules are deployed in an unsafe state.
- Production domain loses SSL.
- Firebase deploy succeeds but live site serves stale or broken content.

Use `docs/ROLLBACK_AND_INCIDENTS.md` for recovery.

## Evidence to capture

For every production release or incident, record:

- Commit SHA.
- GitHub Actions run URL.
- Firebase Hosting release ID if available.
- Production verifier output.
- Manual QA notes.
- Any error logs or screenshots.

## Definition of healthy

URAI Admin is healthy when:

- `pnpm verify:production` passes.
- Owner/admin login works.
- Logout clears session state.
- Anonymous users cannot access protected routes or APIs.
- Functions health is ok.
- Audit logs are written.
- No high-severity errors appear in Firebase logs.

