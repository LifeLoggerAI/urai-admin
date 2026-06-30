# Firestore and Storage Rules Proof

Starting commit SHA: 17458d90459e25ba5d2cf04035f3ee277a001424
Ending commit SHA: see PR head for `production-lock-admin-20260630`
Branch name: production-lock-admin-20260630
Commands run: none in shell
Evidence type: source-level inspection

## Firestore

Source status: PARTIAL.

Observed source intent:

- deny-by-default fallback;
- active admin record required for admin collections;
- owner/admin role required for privileged reads and writes;
- viewer role limited to viewer-safe reads by rules design;
- audit collections are create-only and immutable after create;
- direct client writes to operational collections are denied.

Proof still required:

- `pnpm test:rules` emulator output;
- unauthenticated deny proof;
- authenticated non-admin deny proof;
- inactive admin deny proof;
- viewer read-only proof;
- owner/admin allow proof;
- immutable audit record proof.

## Storage

Source status: PARTIAL.

Observed source intent: Storage rules deny all reads and writes.

Proof still required:

- emulator or staging proof that non-admin reads/writes are denied;
- deploy proof that the rules are active in the intended Firebase project.
