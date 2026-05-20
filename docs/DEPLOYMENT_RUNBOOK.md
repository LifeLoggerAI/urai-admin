# URAI Admin Deployment Runbook

Status: production deployment is allowed only when the source-of-truth checks in this runbook are GREEN with evidence.

## Canonical project

- Repo: `LifeLoggerAI/urai-admin`
- Default branch: `main`
- App source: `apps/urai-admin`
- Firebase production project: `urai-4dc1d`
- Public domain: `https://uraiadmin.com`
- Preview/default hosting URL: `https://urai-admin.web.app`
- Functions base URL: `https://us-central1-urai-4dc1d.cloudfunctions.net`

## Current source of truth

`urai-4dc1d` is the only production Firebase project for URAI Admin deployment-critical scripts and runbooks.

Do not run production deployment from a shell where `firebase use` points at an unexpected project. The production deploy script also passes the Firebase project flag explicitly.

## Required preflight evidence

Before staging or production deploy, capture evidence for:

1. GitHub repo and branch.
2. Firebase project ID.
3. Firebase hosting site/target.
4. Authorized Firebase Auth domains.
5. Required environment variables.
6. GitHub Actions status.
7. Local release gates.
8. Firestore rules tests.
9. Storage rules tests.
10. Smoke test target URLs.
11. Rollback command/path.

## Required local release gates

Run from repo root:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke-test
```

Record every command, status, log path, and blocker in `docs/EVIDENCE_LOG.md`.

## Required Firebase/rules gates

Run emulator-backed rules tests where available. Do not mark rules GREEN unless the evidence shows:

- unauthenticated users cannot read/write protected admin collections;
- authenticated non-admin users cannot read/write protected admin collections;
- active admins can perform only intended reads/writes;
- sensitive admin mutations write `auditLogs`;
- Storage rules deny non-admin access to protected paths.

## Production deployment gate

Production deploy is allowed only when all of these are GREEN:

- canonical Firebase project verified;
- hosting target verified;
- env/secrets verified;
- CI passing or explicit approved override documented;
- local release gates passing;
- Firestore and Storage rules tested;
- unauthenticated admin API access returns `401`;
- previous known-good Git commit SHA recorded;
- previous known-good Firebase Hosting release recorded;
- rollback command/path documented;
- founder/Jacob approval recorded.

Deploy command after approval:

```bash
pnpm run deploy:production
```

## Post-deploy smoke checks

Verify:

- `https://uraiadmin.com/`
- `https://uraiadmin.com/features`
- `https://uraiadmin.com/pricing`
- `https://uraiadmin.com/security`
- `https://uraiadmin.com/login`
- `https://uraiadmin.com/admin`
- `https://uraiadmin.com/admin/users`
- `https://uraiadmin.com/admin/feature-flags`
- unauthenticated admin API access returns `401`

If the canonical custom domain is not cut over yet, run the same checks against `https://urai-admin.web.app` and record custom-domain cutover as pending.

## Rollback

Rollback must be prepared before production deploy. At minimum, record:

- Previous known-good Git commit SHA;
- Previous known-good Firebase Hosting release;
- command or console steps to roll back hosting;
- command or PR to revert code/rules/functions changes;
- owner responsible for rollback execution.

## Unsafe scripts

Do not run `urai_admin_finish.sh` as a production release path. It is labeled as a URAI Analytics finisher, writes broad Firebase/analytics changes, and contains deploy behavior that is not an admin production-readiness gate.