# URAI Admin

URAI Admin is the standalone operations console for URAI products and AI-native applications.

It powers `uraiadmin.com` as a public product site and `/admin/*` as a protected operational command center for users, feature flags, jobs, job runs, dead letters, system config, roles, projects, and audit logs.

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
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

After production deploy, verify the live site:

```bash
pnpm verify:production
```

## Production launch path

The production release path is documented in:

- `docs/PRODUCTION_LAUNCH.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/ROLLBACK_AND_INCIDENTS.md`

Minimum launch sequence:

```bash
pnpm preflight:production
pnpm security:gate
pnpm bootstrap:owner
pnpm deploy
pnpm verify:production
```

Do not claim production launch complete until the release checklist is complete, GitHub Actions deployment is green, and `pnpm verify:production` passes against `https://www.uraiadmin.com`.

## Production environment

Use `.env.production.example` as the source checklist for required GitHub/Firebase production values. Do not commit real secrets.

Required categories:

- Firebase public app values
- Firebase deploy token
- optional Firebase service account key
- initial owner bootstrap UID/email
- production verification URLs

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

- `docs/PRODUCTION_LAUNCH.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/ROLLBACK_AND_INCIDENTS.md`
- `docs/URAI_ADMIN_STANDALONE_READINESS.md`
- `docs/TROUBLESHOOTING_LOCAL_BUILDS.md`
