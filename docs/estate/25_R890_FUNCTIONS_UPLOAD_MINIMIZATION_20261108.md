# R890 — Admin Firebase Functions source upload minimization (2026-11-08 UTC)

**STATUS: DRAFT, PRODUCTION HOLD.** No paid runner, deployment, Firebase IAM/Rules, user claims, production administration, or source merges. Original Admin owner controller #85, documentation #99 and security branches #100–#112 are preserved.

## Exact source ancestry

Parent [Admin draft #112](https://github.com/LifeLoggerAI/urai-admin/pull/112) at `903052be9e104c2895d99628006836768ffc9960`. New [Admin draft #113](https://github.com/LifeLoggerAI/urai-admin/pull/113), head `22197620054dbaa20a60944466bbdc7ae319527b`, base #112, four commits ahead, no commits behind, **exactly four changed files**:

| File | New Git blob SHA |
| --- | --- |
| `firebase.json` | `259b3f5eba308183e30abd88a71d1fc70dca79be` |
| `scripts/assert-admin-packaged-source.mjs` | `b6a5b5d4f4b906a9a252ba888e89c6876b522b3d` |
| `scripts/test-admin-packaged-source.mjs` | `8db0b39e4ea3f3ef47c10efeed95fd9ed428c61c` |
| `scripts/test-admin-packaging-integration.mjs` | `e7984689f270e346c4dda95c18519bb038953845` |

## Source finding

R889 confirmed the exact frozen Firebase CLI 15.24.0 resolves minimatch 3.1.5, and the 146 older `functions/apps/urai-admin` files are correctly excluded by the existing upload rules. Yet the source-upload policy still retained four `functions/test/*.mjs` files and an inactive `functions/logAdminAction.ts`, altogether **five additional tracked files / 42,464 Git-reported bytes**. The orphan callable imports an absent `./auth`; active Functions TypeScript configuration has `files: [src/index.ts]`, whose import graph uses `institutionalControlPlane.ts` and `uraiAnalyticsV1.ts`, not the orphan callable or test files. The orphan is **not proven deployed or executed**. Excluding it from the proposed upload does not remove source history or tests.

R890 adds `**/functions/test`, `**/functions/test/**`, `**/functions/logAdminAction.ts` to `firebase.json` ignore, pins the policy in the packaged-source guard, adds three fail-closed regression cases and updates the eight-case real packaging shell fixture assertions. The Functions `codebase: default` remains intentionally unmodified under prior R875 security HOLD.

## Verified matching source

Read original 158 tracked `functions/` blob paths from exact parent Git tree. Tested the *published full minimatch v3.1.5 source* upstream Git blob `2e4a058a130dceebf83a7bd435f5d22b765ac836` using the pinned Firebase CLI options `matchBase:true,dot:true` against representative absolute checkout paths. The resulting intended exclusion is **151/151 non-runtime tracked files** (146 old mirror, four tests, one orphan), **0/7 remaining runtime candidates wrongly ignored**. Both old mirror and test parent directories match pruning. Generated `functions/.generated/urai-admin` is not excluded.

Tracked functions inventory at parent source: **158 files / 353,996 Git-reported bytes**, now 151 intended excluded / 312,329 bytes, **7 tracked candidates / 41,667 bytes**. Remaining tracked candidates: `functions/.eslintrc.cjs`, `functions/package.json`, `functions/src/index.ts`, `functions/src/institutionalControlPlane.ts`, `functions/src/uraiAnalyticsV1.ts`, `functions/tsconfig.active.json`, and `functions/tsconfig.json`. This is a *tracked Git* inventory, not actual Firebase ZIP bytes (generated runtime and node dependencies are not in these counts).

## Local native tests

Node `v22.16.0` in disposable local source tree; exact R890 files verified by `git hash-object` against above GitHub blobs. `node --check` on three MJS files PASS; `node --test scripts/test-admin-packaged-source.mjs scripts/test-admin-packaging-integration.mjs` **30/30 PASS**, no failures, exit 0. Local TAP SHA256: `30148bb5f417d4ffef7f5ab2d584895187b6cb07cb98908ed8f37cd1089d0855`. The real source-matched shell packager is exercised on disposable synthetic Next output, not a complete Next compilation.

## Remaining acceptance and limitations

P0: actual pinned Firebase CLI 15.24.0 source archive generation and inspection to verify excluded paths absent, generated compiled runtime present, and no unexpected private artifact or dependency. P0: full clean frozen Node/pnpm 9.15.0 Next+Functions build and compiled external dependency audit; Auth/Firestore/Storage/Functions emulator tests; owner/admin/viewer revoked/downgraded cross-user memory/media/consent negative checks. P0: read-only effective `urai-4dc1d` IAM, one global Rules publisher, approved dedicated Functions namespace, deployed-SHA attestation and rollback. Github Actions zero-step failures persist and historical cross-repo billing-lock evidence must not be silently treated as a successful CI or current-job cause.

**R890 is source-matched local test evidence and a draft upload-minimization fix. Production security remains unverified and release stays HOLD.**

## Exact-head R890 GitHub Actions readback

Draft Admin #113 head `22197620054dbaa20a60944466bbdc7ae319527b` has four completed FAILURE workflow conclusions, each with **zero recorded job steps**: Admin CI run `42447939177` / job `128630752304`; Validate run `42447939126` / job `128630751964`; Visual Truth run `42447939129` / job `128630752206`; Production Verify run `42447939106` / job `128630751881`. No application test, installed native build, real Firebase archive or emulator execution is established by these CI conclusions; exact runner cause not independently verified. Local 30/30 synthetic packaging PASS remains separate evidence. Production HOLD.
