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
- `test:rules`: Firestore rules source contract.
- `test:e2e`: admin route/source contract.
- `receipt:admin-auth-runtime:emulator`: isolated Auth + Firestore runtime acceptance against the real Admin session/mutation APIs. This receipt is non-production, uses no cloud credential, binds to the exact candidate SHA, and does not substitute for later protected provider/deployed-runtime readback.
- `test:smoke`: live/staging smoke script.
- `verify:release`: static release evidence verifier.

## Emulator acceptance

The exact-head CI must retain an isolated Auth + Firestore runtime receipt proving, on the real Admin APIs and rules where applicable:

- owner/admin/viewer session exchange and route-specific authorization;
- authenticated non-admin and inactive-admin rejection;
- recent-auth enforcement and bounded stale-token refresh;
- role promotion/reduction with predecessor token/session rejection;
- active-state revocation and inactive denial;
- same-origin mutation acceptance plus explicit cross-origin rejection;
- controlled rollback-required mutation recovery;
- viewer-safe versus privileged Firestore behavior;
- immutable/deny-by-default client write boundaries;
- raw telemetry denial and sensitive-field redaction;
- audit attribution and logout/session clearing.

Production-only origin fail-closed behavior remains covered by the executable origin-policy behavior suite. Provider identity, deployed revision, Cloud Audit, monitoring and real rollback remain separate protected-environment gates.

## Evidence

Paste command output links, CI run links, staging URLs, and production smoke output into `docs/EVIDENCE_LOG.md`.
