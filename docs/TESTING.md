# URAI Admin Testing

## Required commands

```bash
pnpm install
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

## Test layers

- `check:types`: TypeScript across app, analytics, and Functions.
- `lint`: Next.js/app lint plus workspace lint.
- `test:unit`: app, analytics, and Functions tests.
- `test:rules`: Firestore rules contract. Emulator tests should be added before production-ready claim.
- `test:e2e`: admin route/source contract. Browser E2E should be added before production-ready claim.
- `test:smoke`: live/staging smoke script.
- `verify:release`: static release evidence verifier.

## Emulator expectations

Before production ready, add Firebase emulator tests proving:

- unauthenticated users cannot read admin data
- authenticated non-admin users cannot read admin data
- inactive admin records cannot read admin data
- viewer can read viewer-safe collections only
- owner/admin can read privileged collections
- audit and operational events cannot be updated or deleted

## Evidence

Paste command output links, CI run links, staging URLs, and production smoke output into `docs/EVIDENCE_LOG.md`.
