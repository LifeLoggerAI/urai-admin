# URAI Admin Rollback and Incident Runbook

This runbook defines the minimum recovery process for URAI Admin production incidents at `https://www.uraiadmin.com`.

## When to rollback

Rollback immediately when any of these are true after deploy:

- `pnpm verify:production` fails.
- Admin login is broken for known active owners/admins.
- Anonymous users can access `/admin` or `/api/admin/*`.
- Firebase Functions health fails.
- Firestore or Storage rules are accidentally loosened.
- New deploy causes repeated 5xx responses on public or admin routes.

## Immediate response

1. Stop additional deployments.
2. Open or update the active production incident issue.
3. Capture the failing workflow run URL, commit SHA, and verifier output.
4. Confirm whether the issue is app, functions, rules, DNS, SSL, or Firebase project configuration.
5. Roll back to the last known good commit or Firebase release.

## Git rollback path

Preferred path when the current `main` commit is bad:

```bash
git checkout main
git pull
git revert <bad_commit_sha>
git push origin main
```

Then run the production deployment workflow and confirm:

```bash
pnpm verify:production
```

## Firebase Hosting rollback path

Use Firebase Hosting release history if the deployed app is bad but the repository needs more investigation.

1. Open Firebase Console.
2. Go to Hosting for project `urai-4dc1d`.
3. Find the last known good release for `www.uraiadmin.com`.
4. Roll back to that release.
5. Run:

```bash
URAI_ADMIN_BASE_URL=https://www.uraiadmin.com pnpm verify:production
```

## Functions rollback path

If only Functions are broken:

1. Identify the last known good Git SHA.
2. Re-deploy Functions from that SHA.
3. Confirm `api_health` and `admin_whoami` behavior.

```bash
pnpm functions:build:active
firebase deploy --only functions -P urai-4dc1d
URAI_ADMIN_FUNCTIONS_BASE_URL=https://us-central1-urai-4dc1d.cloudfunctions.net pnpm verify:production
```

## Rules rollback path

If Firestore or Storage rules are unsafe:

1. Revert the rules change immediately.
2. Run:

```bash
pnpm security:gate
firebase deploy --only firestore,storage -P urai-4dc1d
```

3. Confirm anonymous access remains blocked.

## Incident closure criteria

Do not close a production incident until all are true:

- Root cause is documented.
- Rollback or forward fix is deployed.
- `pnpm verify:production` passes.
- Admin login/logout is manually verified.
- `/api/admin/users` returns `401` anonymously.
- Audit logs are still written for admin activity.
- Follow-up prevention tasks are created.

## Required incident data

Each incident should record:

- Incident start time.
- Detection source.
- Affected URLs or functions.
- Bad commit SHA or Firebase release.
- Rollback commit SHA or Firebase release.
- Verification output.
- Owner responsible for follow-up.
