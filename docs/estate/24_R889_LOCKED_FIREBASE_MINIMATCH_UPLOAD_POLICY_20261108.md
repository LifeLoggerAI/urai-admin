# R889 — Exact locked Firebase Functions ignore matcher verification (2026-11-08 UTC)

**STATUS: SOURCE-MATCHING VERIFIED, ACTUAL FIREBASE ZIP NOT INSPECTED; PRODUCTION HOLD.** This R889 pass changes only the existing Genesis documentation branch, not Admin source, CI, IAM, Rules, Functions, deployments, accounts, billing, or any worker security PR.

## Pinned source authority and dependency resolution

- Original audit/review chain is preserved through [Admin draft PR #112](https://github.com/LifeLoggerAI/urai-admin/pull/112) unchanged at `903052be9e104c2895d99628006836768ffc9960`.
- `firebase.json` Git blob `7ca8070e85a082066bc177d6b69cabd2a910b7d2` gives Functions source `functions` and legacy exclusions `**/functions/apps`, `**/functions/apps/**`, together with standard node_modules/.git/debug exclusions.
- Source-pinned `pnpm-lock.yaml` Git blob **`e36f5624094a014f94754fc70fd845d487f05379`** resolves `firebase-tools@15.24.0` to **`minimatch: 3.1.5`** (around lockfile lines 8729, 8772), with separately listed `minimatch@3.1.5` package (around lines 4084 and 9787). Thus the R888 local minimatch v9 vs expected v3 discrepancy now has a precise expected lockfile resolution.
- Upstream firebase-tools `v15.24.0` `src/deploy/functions/prepareFunctionsUpload.ts` Git blob `06ffcb5e603ba5dd708bcd8dcd87b72c3df70ad9`: upload archive calls `fsAsync.readdirRecursive({ path: sourceDir, ignoreStrings: ignore })`. `src/fsAsync.ts` Git blob `d31ac488efc331c178de2308689f180e832ef3f0`: file and *directory* entries are filtered before traversal using minimatch `{matchBase:true,dot:true}` on absolute paths, with `supportGitIgnore` off. This is the CLI's declared matching path, but not an actual CLI execution.

## Executed exact published matcher source

Fetched and evaluated the **published upstream JS source** of three minimatch 3.x releases in an isolated V8 environment. Native `path.sep` was represented as POSIX `/`; brace-expansion import was stubbed to refuse use because the configured rules contain no braces. The actual matcher function, not a newly written glob approximation, was invoked on **all 158 tracked functions/ Git blob paths**, plus directory and generated-runtime controls, with `matchBase:true,dot:true`.

| Matcher source release | Upstream Git blob SHA | 146 legacy files excluded | 12 other tracked files excluded | Legacy directory pruned | Generated runtime excluded |
| --- | --- | --- | --- | --- | --- |
| v3.0.4 | `5b5f8cf444de212f1fb7c844d79888af08879c8b` | **146/146** | **0/12** | YES | NO |
| v3.1.2 | `fda45ade7cfc351fbcd76877d50b4b5f643c37a3` | **146/146** | **0/12** | YES | NO |
| **v3.1.5 (exact lockfile resolution)** | **`2e4a058a130dceebf83a7bd435f5d22b765ac836`** | **146/146** | **0/12** | **YES** | **NO** |

Repeated across four representative POSIX absolute source-workspace prefixes: `/tmp/urai-r889`, `/var/folders/example/urai`, `/home/runner/work/urai-admin/urai-admin`, and `/workspace`. Each version/path showed no unintended nonlegacy exclusion and did not exclude generated `functions/.generated/urai-admin/.next/server/app/index.js` or the generated Admin authority source; a lookalike `functions/apps-other` path was also not matched by v3.1.2. This supports R886's intended legacy exclusion under pinned Firebase CLI semantics.

The [R888 tracked Functions inventory](R888_FUNCTIONS_GIT_TRACKED_UPLOAD_INVENTORY.json) records **158 tracked Functions files / 353,996 bytes** at PR #112: 146 legacy mirror files / 269,865 bytes intended for exclusion and 12 other tracked files / 84,131 bytes. Counts include only tracked Git blobs, not generated runtime, installed dependencies, symlink targets or real archive content.

## Evidence classification and outstanding gates

**Verified:** exact lockfile dependency resolution, upstream matcher source, upstream CLI directory-filter algorithm, and matching result over complete currently tracked Functions files; all earlier R888 exact committed local packaging tests **27/27 PASS** remain separate verified evidence.

**Not verified:** dependency bytes loaded by an actual frozen install; the real `firebase-tools@15.24.0` `prepareFunctionsUpload` execution; binary ZIP contents; production Next+Functions build; built server externalized dependencies (app manifest 26 production packages vs Functions manifest 6); IAM, Rules, Codebase ownership, authenticated Firebase emulator cross-user private media/memory/consent denials, production deployed SHA and rollback.

**P0:** On authorized no-cost clean runner, execute exact locked CLI/Next/Functions build and archive creation *without deployment*, list ZIP entries and assert legacy files absent while generated runtime/code and required dependencies are present. Keep `codebase: default` and global Rules publishing under explicit HOLD until owner-reviewed resolution. No paid compute or privilege changes in R889.

**R889 produced documentation and source-matcher evidence, not another security patch. Preserve all existing worker branches.**
