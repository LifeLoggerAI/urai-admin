# System Registry Emulator Receipt

This procedure proves the registry dry-run and guarded-apply boundaries without assigning a cloud staging project and without touching production.

## Boundary

The receipt command:

- starts a disposable Firestore emulator under the fixed project ID `urai-admin-emulator`;
- refuses non-loopback emulator hosts;
- refuses `FIREBASE_SERVICE_ACCOUNT_KEY` and `GOOGLE_APPLICATION_CREDENTIALS`;
- requires a clean exact Git checkout;
- requires the explicit emulator approval `APPROVE_URAI_ADMIN_EMULATOR` internally;
- refuses a nonempty emulator namespace rather than deleting unknown data;
- proves the initial dry run performs no mutation;
- performs one guarded apply of the canonical registry;
- verifies all canonical IDs, exact source SHA, one immutable registry digest and one operational event;
- proves a post-apply dry run performs no additional mutation;
- records that no production mutation occurred and no staging authority was asserted.

## Command

Run from a clean checkout of the exact PR head:

```bash
pnpm install
pnpm test:registry
pnpm receipt:system-registry:emulator
```

The Firebase CLI starts and stops the disposable Firestore emulator. The receipt is written to:

```text
docs/release-evidence/admin-system-registry-emulator-receipt.json
```

A valid receipt uses schema:

```text
urai-admin-system-registry-emulator-receipt-1
```

## What this proves

The receipt can prove:

- registry contract execution before apply;
- wrapper and child exact-SHA and clean-worktree enforcement;
- dry-run nonmutation;
- guarded emulator mutation of exactly the canonical registry set;
- immutable digest and source-SHA binding;
- operational-event creation;
- refusal to use cloud credentials or cloud authority.

## What this does not prove

It does not:

- authorize or identify an Admin staging Firebase project;
- deploy Firebase rules, functions or hosting;
- mutate production or staging data;
- replace exact-head CI;
- replace independent review;
- prove production service-account, IAM, DNS, billing or rollback behavior.

Keep PR #45 draft until exact-head CI succeeds, independent review completes, authoritative staging is established, and protected staging evidence is recorded.
