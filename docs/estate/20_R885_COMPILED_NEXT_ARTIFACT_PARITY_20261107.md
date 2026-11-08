# R885 — Compiled Next bundle byte-parity gate for Admin Functions (2026-11-07/08 UTC)

**Decision: REVIEW-ONLY / PRODUCTION HOLD.** No live Firebase data, IAM, account, Rules, Functions, deploy or billing changes. Preserves Admin #85, documentation #99 and all independent security/workflow workers #100–#109.

## Exact source and worker lineage

The R884 [Admin draft PR #109](https://github.com/LifeLoggerAI/urai-admin/pull/109) at `09c8046feac8f7d043a3cecbf9702ee6d1e3b158` verifies canonical `apps/urai-admin` source against copied `functions/.generated/urai-admin` source and Next BUILD_ID after packaging, before Functions compilation. The declared active Functions runtime resolves `functions/.generated/urai-admin`, not the divergent legacy tracked `functions/apps/urai-admin` mirror. Its source check did **not** compare compiled `.next/server` and `.next/static` bytes. That is an independently confirmed verification omission, not evidence of malicious deployment.

New [Admin draft PR #110](https://github.com/LifeLoggerAI/urai-admin/pull/110), head `d6b0bd7e6865b55004a5483b3c7be99d9ae3d27d`, base #109 above, **2 commits ahead, 0 behind, two changed paths**:
- `scripts/assert-admin-packaged-source.mjs` Git blob `18ba6561e4091426612c7774461393dc2d103913`: preserves source manifest checks and additionally traverses canonical/generated `.next`, requires a nonempty compiled server path, exact compiled relative path sets, equal SHA256 file bytes, no symlinks/non-file artifacts, no packaged retained cache/source maps/tsbuildinfo. Excludes from the canonical comparison only `.next/cache`, `*.map`, `*.tsbuildinfo` deliberately removed by the packaging script. Reports compiled file/byte count and deterministic aggregate SHA256, alongside original source SHA256 and BUILD_ID.
- `scripts/test-admin-packaged-source.mjs` Git blob `ff003640cd2dd5fdac81421575a01ae225e3b6e3`: extends ten disposable fixture cases to sixteen. New denials cover tampered compiled server JS, tampered static client chunk, missing/extra compiled path, linked compiled file, forbidden retained cache/map and missing server output.

Root `package.json` remains unchanged from R884 (its existing build chain calls the guard immediately after `scripts/package-next-for-functions.sh` and before `pnpm --dir functions build`). No source Firebase config or deploy path changes.

## Executed evidence and scope

Local Node.js v22.16.0: `node --check` both new MJS files PASS; `node --test scripts/test-admin-packaged-source.mjs` **16/16 PASS**, 0 fail, exit 0. Source code tested locally is byte-identical to both GitHub blobs per `git hash-object`. Final local TAP SHA256 `471058630fa37734cc0a80966647ef6836fec9db57f4a891b3ced463ce396b88`. The test runs a small synthetic file fixture; it **does not** execute real `pnpm install`, Next build, the generated canonical Functions package, a Firebase emulator, live IAM, cloud deployment or protected authentication.

R884 retained historical 230 canonical vs 146 tracked Functions-mirror Git files (120 same, 26 different, 84 canonical-only), detailed in [source manifest](R884_ADMIN_CANONICAL_VS_LEGACY_FUNCTIONS_TREE_MANIFEST.json); divergence alone does not show old tracked mirror deployed.

## Release acceptance and limitations

P0: freeze and build the complete merged candidate in an authorized no-cost runner. Inspect actual `functions/.generated` and Functions deploy archive; require real compiled/source parity and no old mirror authority. CI job admission on previous heads was blocked before runner steps; GitHub Support case #4889576 has a historical billing-lock annotation from another repo but no exact current Admin annotation.

P0: resolve effective `urai-4dc1d` project-wide Firestore/Storage Rules owner and Functions dedicated codebase migration; run complete Firebase Auth/Firestore/Storage emulators, signed owner/admin/viewer, revoked/deleted and cross-user/tenant private memories/media/consent negative tests, and signed deployment/rollback source parity.

P1: QA directory-swap TOCTOU hardening, log retention, audit and cross-system lifecycle, device/accessibility verification. The parity guard proves only selected local build input/output file relationships after packaging; **not** remote deployment identity or full dependency/supply-chain provenance.

**No production GO.**

## Exact-head R885 GitHub Actions readback

Draft #110 source SHA `d6b0bd7e6865b55004a5483b3c7be99d9ae3d27d` triggered four completed workflow **FAILURE** conclusions: CI run `42445241122` / job `128622669731`; Validate `42445241210` / job `128622670178`; Visual Truth `42445241184` / job `128622669854`; Production Verify `42445241133` / job `128622669700`. Each returned job has **zero recorded steps**. Thus no complete source install, Next build, real generated package parity or Firebase emulator run was demonstrated in GitHub. Billing/runner admission remains a plausible external blocker from prior estate evidence, but exact R885 job-level root cause is unverified. Preserve the 16/16 local synthetic PASS as separate, limited evidence and maintain HOLD.
