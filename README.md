# URAI Admin

URAI Admin is the standalone operations console for URAI products and AI-native applications.

It powers `uraiadmin.com` as a public product site and `/admin/*` as a protected operational command center for users, feature flags, jobs, job runs, dead letters, system config, roles, projects, system-of-systems release readiness, governance evidence, analytics status, communications status, and audit logs.

## Launch security note

This repository is currently public. Before any public Genesis launch or production operations campaign, confirm whether the repository should remain public. If it stays public, keep it limited to product-site code, documentation, examples, and non-sensitive configuration only.

Do not commit real secrets, service-account files, raw user data, private operational exports, incident evidence, internal audit logs, production screenshots with identifiers, or unreviewed security details. Protected console routes must remain auth-gated in the deployed app, not merely hidden from navigation.

## Product surfaces

### Public site

- `/`
- `/features`
- `/pricing`
- `/security`
- `/docs`
- `/contact`
- `/privacy`
- `/terms`
- `/login`

### Protected console

- `/admin`
- `/admin/users`
- `/admin/projects`
- `/admin/feature-flags`
- `/admin/jobs`
- `/admin/job-runs`
- `/admin/dead-letters`
- `/admin/system`
- `/admin/audit`
- `/admin/policies`
- `/admin/settings`

## Stack

- Next.js app in `apps/urai-admin`
- Firebase Hosting
- Firebase Auth session cookies
- Firestore security rules
- Firebase Functions active entrypoint in `functions/src/index.ts`
- pnpm workspaces

## Local setup

```bash
git pull origin main
unset NPM_CONFIG_PREFIX
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

If `corepack enable` fails in a read-only filesystem environment, that is usually fine as long as `corepack prepare pnpm@9.15.0 --activate` and `pnpm --version` work.

## Core verification commands

Run these before a release:

```bash
pnpm preflight:production
pnpm security:gate
pnpm check:types
pnpm lint
pnpm test:unit
pnpm test:rules
pnpm test:e2e
pnpm test:smoke
pnpm build
pnpm verify:release
pnpm release:lock
```

After production deploy, verify the live site:

```bash
pnpm verify:production
```

## Production lock status

The final release verdict lives in `FINAL_LOCK.md`.

Do not claim `PRODUCTION READY` unless `FINAL_LOCK.md` and `docs/EVIDENCE_LOG.md` contain evidence for clean install, typecheck, lint, unit tests, rules tests, E2E/route tests, smoke tests, build, release verification, Firebase env, Firebase rules/index/storage deploy, Hosting preview, admin seed, communications integration or approved deferral, analytics integration or approved deferral, legal links, staging smoke, DNS/SSL, monitoring, rollback, and owner approval.

## Production launch path

The production release path is documented in:

- `FINAL_LOCK.md`
- `docs/PRODUCTION_AUDIT.md`
- `docs/DEPLOYMENT.md`
- `docs/SECURITY.md`
- `docs/ADMIN_OPERATIONS.md`
- `docs/SYSTEM_OF_SYSTEMS.md`
- `docs/TESTING.md`
- `docs/RUNBOOK.md`
- `docs/PRODUCTION_LAUNCH.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/ROLLBACK_AND_INCIDENTS.md`

Minimum launch sequence:

```bash
pnpm release:lock
pnpm bootstrap:owner
pnpm deploy
pnpm verify:production
```

Do not claim production launch complete until the release checklist is complete, GitHub Actions deployment is green, staging smoke passes, owner approval is recorded, and `pnpm verify:production` passes against `https://www.uraiadmin.com`.

## Production environment

Use `.env.production.example` as the source checklist for required GitHub/Firebase production values. Do not commit real secrets.

Required categories:

- Firebase public app values
- Firebase deploy token
- optional Firebase service account key
- initial owner bootstrap UID/email
- Firebase project and hosting site IDs
- staging and production verification URLs
- rollback release/SHA inputs

## Privacy boundary

URAI Admin may display operational metadata, release evidence, system health, admin audit events, governance records, aggregate analytics status, communications status, and partner/admin review state.

URAI Admin must not expose raw consumer passive telemetry, raw audio, private transcripts, raw location trails, consumer identity vectors, or unreviewed health/mental-health inference records unless a privacy review explicitly approves the route, role, fields, retention model, and audit trail.

## System-of-systems registry

The canonical static registry lives in `docs/SYSTEM_OF_SYSTEMS.md` until the Firestore `systemRegistry` seed is verified. Systems without verified live health contracts must display `Not connected`, `Blocked`, or `Degraded`, never `Healthy`.

## One-command green-ship script

Use the green-ship script for broad local verification before deploy:

```bash
bash scripts/green-ship.sh
```

It runs:

- stale Functions cleanup
- generated app artifact cleanup
- install
- active Functions typecheck
- active Functions build
- lint
- typecheck
- tests
- build
- smoke tests

## Common local cleanup

If stale Functions or generated app files appear locally:

```bash
bash scripts/clean-functions-legacy.sh
bash scripts/clean-app-generated.sh
```

Normal root commands also run cleanup automatically:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Active Functions entrypoint

Only this Functions entrypoint is part of the active deploy path:

```text
functions/src/index.ts
```

Verify it directly:

```bash
pnpm functions:typecheck:active
pnpm functions:build:active
```

## Deploy

Preferred deploy path is GitHub Actions: `Deploy URAI Admin`.

Manual fallback after all checks pass:

```bash
pnpm deploy
pnpm verify:production
```

## Production domain checklist

Verify in Firebase Console:

- `uraiadmin.com` is attached to Firebase Hosting or intentionally redirected
- `www.uraiadmin.com` is attached to Firebase Hosting
- `uraiadmin.com` is an authorized Firebase Auth domain
- `www.uraiadmin.com` is an authorized Firebase Auth domain
- SSL is active for `www.uraiadmin.com`

## More docs

- `FINAL_LOCK.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/PRODUCTION_AUDIT.md`
- `docs/DEPLOYMENT.md`
- `docs/SECURITY.md`
- `docs/ADMIN_OPERATIONS.md`
- `docs/SYSTEM_OF_SYSTEMS.md`
- `docs/TESTING.md`
