# R884 — Admin canonical-versus-Functions mirror source drift and build provenance (2026-11-07/08 UTC)

**Production decision: HOLD.** No production provider, IAM, Rules, Functions, account, payment, action-run, or deployed release changed. This document preserves original Admin engineering PR #85, Genesis docs #99 and all independent #100–#108 security workers.

## Exact immutable source audit

At Admin R882 controller `67a48d342627524d384b15771723321abff73e20` (recursive Git tree nontruncated, 1216 entries):
- `apps/urai-admin/`: **230** tracked blob files.
- `functions/apps/urai-admin/`: **146** tracked blob files.
- Matching relative paths: **120 identical blobs, 26 different Git SHA blobs**; **84 files only in canonical app**, zero only in the tracked Functions mirror. These are *Git tracked file comparisons*, not every historical object or deployed bundle.
- Security-relevant drift (canonical SHA vs legacy SHA): `src/lib/admin/require-admin-session.ts` `9d3fc6ba9d873f8b964032a57a52116a60e60b44` vs `f3b64e2235e190ec4827e7ad00cdd2707f9cad93`; `src/app/api/admin/collection/route.ts` `646496bfade4c3f93695b3981a3848f656930ba1` vs `6b04948f88b80f5eda400d6cab134b4d068da3bb`; `src/app/api/qa/image/route.ts` `f3ae39c80acaf34828dd564221bb3a2ed3bc87dd` vs `ddc4cc051c140f5bb30764277dad5111909fb75f`; `src/app/api/qa/logs/route.ts` `36516b26e8577b49ef8fabb84530de7aa6447eb9` vs `4b880b285119a6b40d4080ad0428ba7b138f3186`; `next.config.js` `ea03fd8551ba5ebc6706d5eb1ca73a67720102bd` vs `831cb43e277a0db34a5a98d7efa5b50d966bd319`. Other differences: audit route, privileged operations, QA diff/snapshots, feature flag executor, dashboard, login UI, configs.

## Deployed-source interpretation (source only)

Active `functions/src/index.ts` blob `f13a36b01009a4a4a79db4434f1e79f66048d060` explicitly resolves `join(__dirname, '..', '.generated', 'urai-admin')` and starts Next from `packagedNextAppDir`; its TypeScript active config only lists `src/index.ts`. `scripts/package-next-for-functions.sh` blob `0dbd9579952bfcfa43ee4f979e955103cc0c245b` rebuilds `functions/.generated/urai-admin` using `apps/urai-admin/.next` plus canonical `src`/config/public files. Root build compiles Functions only after packaging. `firebase.json` Hosting source is `apps/urai-admin`, rewrite target `nextServer`; Functions codebase remains `default` and deliberately blocked by earlier R875 source gate.

**Therefore, legacy tracked `functions/apps/urai-admin` is NOT the declared active runtime input.** Do not claim it was deployed or that private data was accessed from it. The previous source contracts checked path references, not exact post-package byte parity. A deployed artifact/service readback is still missing.

## R884 review-only source parity guard

New [Admin draft PR #109](https://github.com/LifeLoggerAI/urai-admin/pull/109), head `09c8046feac8f7d043a3cecbf9702ee6d1e3b158`, directly stacked after [#108](https://github.com/LifeLoggerAI/urai-admin/pull/108) at `67a48d342627524d384b15771723321abff73e20`, 4 commits ahead/0 behind, exactly three paths:
1. `scripts/assert-admin-packaged-source.mjs`, Git blob `116ca6cc647d9f838595e9adcedca62099126bb3`: no network, reads generated and canonical file paths, disallows symlinks/mismatched regular source files, proves same source/config path sets and SHA256 bytes, checks package-only build override, Next BUILD_ID, Hosting source/rewrites, Functions active entrypoint and proposed packaged directory. Prints deterministic aggregate source SHA256 on successful full build. Does **not** inspect every bundled dependency or private provider IAM.
2. `scripts/test-admin-packaged-source.mjs`, Git blob `b6b0081ca629cc37e38ea984796160f8a8c42895`: 10 synthetic positive/negative file tree tests including modified authority, CSP config, extra/missing source, stale BUILD_ID, changed Hosting source, legacy Functions path, symlink and package manifest mismatch.
3. root `package.json`, Git blob `d97595fde07802317b3f2a55ffecdf403070e14d`: run `pnpm test:packaged-source` in existing root test chain and run `node scripts/assert-admin-packaged-source.mjs` immediately after `package-next-for-functions.sh` and before `pnpm --dir functions build`. Existing production deploy still blocked by dedicated codebase guard.

## Evidence

Local Node.js `v22.16.0`, no paid compute. `node --check` both new MJS files PASS; `node --test scripts/test-admin-packaged-source.mjs` **10/10 PASS**, 0 failures, exit 0, synthetic disposable fixture only. Both uploaded source files matched local `git hash-object` and GitHub blob SHA exactly. Local TAP SHA256 `8026a3a6ecf4eee32072fde6de6371ab8743a6bd57205b05bb1871d72e461167`. Complete GitHub clone still fails DNS in local container; no full frozen pnpm install, Next build, real generated `functions/.generated` parity, Firebase emulators, Actions green run, live provider IAM or deployed SHA verification. This must NOT be called real deploy parity PASS.

## Next acceptance

P0: Once a supported runner/CPU is available, perform exact-head clean install/build, verify generated source SHA256 after packaging, inspect inclusion/exclusion of the older `functions/apps` mirror in actual Firebase deployment bundle and `nextServer` runtime, and check `functions/.generated` security headers and role routes. Require all original native checks and Auth/Firestore emulators; no weakening codebase/Rules publishing holds. P0: effective shared Firebase IAM/Rules, private memory/media/consent denial, approved dedicated Functions codebase and signed source-bound rollback. P1: consider removing/archiving legacy mirror only with explicit architecture owner approval, audit duplicate authority references and QA residuals.

**R884 is a draft source integrity improvement, not a production deployment, not full build certification.**

## Exact per-path Git tree inventory

[Machine-readable full tracked-tree comparison](R884_ADMIN_CANONICAL_VS_LEGACY_FUNCTIONS_TREE_MANIFEST.json): **230 relative paths** across canonical and legacy trees (230 canonical, 146 legacy; 120 matching blobs, 26 SHA-different matched paths, 84 canonical-only, zero legacy-only). Includes both Git blob SHA identifiers, Git-reported byte sizes, modes, and classification for every path, all pinned to R882 source SHA. This is a file-tree metadata manifest, not decoded binary/hash-of-all-history proof or an actual generated build archive.
