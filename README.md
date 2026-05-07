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

## One-command verification

Use the green-ship script before deploy:

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

After green-ship passes:

```bash
pnpm deploy
```

## Production domain checklist

Verify in Firebase Console:

- `uraiadmin.com` is attached to Firebase Hosting
- `www.uraiadmin.com` is attached to Firebase Hosting
- `uraiadmin.com` is an authorized Firebase Auth domain
- `www.uraiadmin.com` is an authorized Firebase Auth domain

## More docs

- `docs/URAI_ADMIN_STANDALONE_READINESS.md`
- `docs/TROUBLESHOOTING_LOCAL_BUILDS.md`
