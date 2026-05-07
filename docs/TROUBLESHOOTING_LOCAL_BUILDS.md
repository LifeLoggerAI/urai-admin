# Troubleshooting Local Builds

This repo has been cleaned up around one canonical app path and one active Functions entrypoint. If local builds fail after pulling from GitHub, the cause is usually stale generated files left in your workspace.

## Correct repo path

Use the repo root:

```bash
cd ~/urai-admin
```

Do not run commands from older project folders such as `urai-tier1`.

## If `pnpm` is not found

In Firebase Studio or Nix-based environments, do not rely on global npm prefix symlinks. Run:

```bash
unset NPM_CONFIG_PREFIX
corepack prepare pnpm@9.15.0 --activate
pnpm --version
```

If `corepack enable` fails with a read-only filesystem error, that is usually safe to ignore as long as `corepack prepare ... --activate` and `pnpm --version` work.

## If Git says branches diverged

If you do not need local generated changes, reset to GitHub main:

```bash
git fetch origin main
git reset --hard origin/main
git clean -fd
```

This is the cleanest way to remove old generated files and stale local build output.

## If Functions errors mention `src/admin/*`

Errors like these mean stale local Functions files are still present:

```text
functions/src/admin/adminUsers.ts
functions/src/admin/roles.ts
functions/src/admin/security.ts
functions/src/middleware/auth.ts
functions/src/scripts/bootstrapAdminSecurity.ts
functions/src/setAdminClaim.ts
```

Clean them with:

```bash
bash scripts/clean-functions-legacy.sh
```

The active Functions deploy entrypoint is:

```text
functions/src/index.ts
```

Verify it with:

```bash
pnpm functions:typecheck:active
pnpm functions:build:active
```

## If app lint errors mention `.js`, `.jsx`, or `_legacy`

Errors from generated files like these mean stale local app artifacts are present:

```text
apps/urai-admin/src/**/*.js
apps/urai-admin/src/**/*.jsx
apps/urai-admin/src/app/(admin)/_legacy/**
```

Clean them with:

```bash
bash scripts/clean-app-generated.sh
```

## One-command green path

After pulling latest main, run:

```bash
bash scripts/green-ship.sh
```

This runs cleanup, install, active Functions verification, lint, typecheck, test, build, and smoke tests.

## Manual command sequence

```bash
git pull origin main
bash scripts/clean-functions-legacy.sh
bash scripts/clean-app-generated.sh
pnpm install
pnpm functions:typecheck:active
pnpm functions:build:active
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke-test
```

## Deploy

After the green path passes:

```bash
pnpm deploy
```
