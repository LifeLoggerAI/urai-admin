# PNPM deploy command fix

The repository has a root package script named `deploy`, but with pnpm 9 the bare command below calls pnpm's built-in deploy feature instead of the package script:

```bash
pnpm deploy
```

That can fail with:

```text
ERR_PNPM_NOTHING_TO_DEPLOY No project was selected for deployment
```

Use the package-script form instead:

```bash
pnpm run deploy
```

Equivalent workspace-root form:

```bash
pnpm -w run deploy
```

The root deploy script currently runs Firebase deploy for the configured admin production project. Run the normal release gates before deploying:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm run deploy
```
