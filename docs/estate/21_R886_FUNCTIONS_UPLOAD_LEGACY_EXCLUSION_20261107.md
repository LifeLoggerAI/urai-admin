# R886 — Firebase Functions upload boundary for legacy Admin source (2026-11-07/08 UTC)

**Verdict: REVIEW-ONLY / PRODUCTION HOLD.** No provider resources, account claims, IAM, Rules, Functions deployment, payment, secrets or live data changed. All original worker branches remain intact and unmerged.

## Pinned source and provenance

- Immediate parent [R885 Admin PR #110](https://github.com/LifeLoggerAI/urai-admin/pull/110): `d6b0bd7e6865b55004a5483b3c7be99d9ae3d27d`. Canonical app and compiled Next `.next` source-byte parity guard exists, but the Firebase Functions upload ignore list still omitted the legacy tracked `functions/apps/urai-admin` subtree.
- New [R886 Admin draft PR #111](https://github.com/LifeLoggerAI/urai-admin/pull/111): `f8d55b9312ff0add3a61dbfbc360add93f700a96`, based on R885, exactly **3 commits ahead / 0 behind, 3 changed files**.
- Source at R885 has **146 legacy Admin blobs** inside `functions/apps/urai-admin`. They differ from the 230-file canonical app in 26 shared relative paths, including server authorization and QA source. This is a tracked-source divergence, **not** confirmation of a deployed or executed alternate Admin.

## Firebase packaging behavior (verified upstream source)

Pinned root `firebase-tools` dependency: `15.24.0`. Source `firebase/firebase-tools` tag `v15.24.0`, `src/deploy/functions/prepareFunctionsUpload.ts` and `src/fsAsync.ts` show that Functions source archive enumerates `sourceDir` using `config.ignore`, `readdirRecursive` and minimatch `matchBase:true,dot:true`. The root repository `.gitignore` is not by itself a complete Functions upload exclusion policy. The R885 `firebase.json` Functions ignore contained `node_modules`, `.git` and `firebase-debug*` only. Therefore the checked-in `functions/apps` source had **no explicit Functions archive exclusion**.

Local matching check against installed npm minimatch using the corresponding `matchBase/dot` flags confirmed the new `**/functions/apps` directory and `**/functions/apps/**` subtree patterns match legacy tree paths while not matching `functions/.generated/urai-admin`. This is evidence about glob matching, **not** a real archive inspection or deployment.

## Exactly three changed paths

| Path | New Git blob | Purpose |
| --- | --- | --- |
| `firebase.json` | `7ca8070e85a082066bc177d6b69cabd2a910b7d2` | Add both legacy directory and subtree ignores without changing source, runtime, or `codebase: default` HOLD |
| `scripts/assert-admin-packaged-source.mjs` | `99034373f4eb41aec8fbc3e33fa6f198c1fb3b1c` | Require exactly one Functions source, `source: functions`, and exact expected ignore list before considering existing source/compiled Next parity |
| `scripts/test-admin-packaged-source.mjs` | `30b186a4412ff5002325364bf0bd92cf601bf06e` | Add negative tests for absent/incomplete exclusion and redirected Functions source while keeping earlier cases |

## Executed local verification

Node `v22.16.0`, two MJS syntax checks PASS, `node --test scripts/test-admin-packaged-source.mjs` **19/19 PASS**, 0 failed, exit 0. Published GitHub source blobs match the locally executed files via `git hash-object` for all three paths. TAP SHA256: `866d6824fa2430017d5ac10ed04ff53c02745d0b5f1ef0a5bd4278eec8fcbc64`. Evidence file: `/mnt/data/admin_r886_candidate/r886-test-final.tap`. An initial fixture setup had one failed expectation after the new Functions config requirement, then the fixture was repaired and all cases passed prior to GitHub commits. Do not reclassify this as an application regression.

Scope is **synthetic, local, source-matched**: no full frozen pnpm install, real Next build, Firebase CLI archive, Auth/Firestore emulator, live provider IAM/effective Rules, production deploy, or exact deployed source verification.

## Independent remaining release gates

1. Keep R875 dedicated Functions codebase guard FAIL CLOSED: current project still sets `codebase: default`, not a certified isolated Admin namespace. Do not migrate or deploy without owner-approved provider inventory and policy owner agreement.
2. Under authorized no-cost compute, inspect an actual firebase-tools v15.24.0 Functions source ZIP to confirm `functions/apps` is absent, `.generated/urai-admin` and compiled bundles are present, and deployed code uses these bytes. Inspect effective Firebase project permissions and source SHA.
3. Continue original Admin RBAC/Privacy/Jobs/Studio/Analytics/Communications/RuAi cross-system authenticated negative tests, including revoked/disabled/cross-user/cross-tenant media and consent denial.
4. Complete protected rollout, independent governance signoff, verified rollback and accessibility/device acceptance.

**Production HOLD. Preserve all active workers and original #85/#99/#100–#110 history.**

## R886 exact-head GitHub Actions results

At PR #111 head `f8d55b9312ff0add3a61dbfbc360add93f700a96`, GitHub returned four completed **FAILURE** workflows with **zero recorded steps**: CI run `42445722724` / job `128624106783`; Validate `42445722457` / job `128624106148`; Visual Truth `42445722415` / job `128624105944`; Production Verify `42445722428` / job `128624105903`. The underlying runner admission reason was not available in this readback. These are **not** new Firebase packaging/archive validation receipts; only the 19 local synthetic source-matched tests passed. Keep production HOLD.
