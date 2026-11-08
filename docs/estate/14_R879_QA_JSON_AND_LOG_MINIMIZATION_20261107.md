# R879 — Admin QA JSON minimization and bounded filesystem read continuation (2026-11-07/08 UTC)

**Verdict: PRODUCTION HOLD.** Safe source-only changes on a new unmerged branch; no live Firebase, IAM, credentials, users, production deploy or paid compute.

## Exact candidate source / worker ancestry

- Base R878 [Admin draft PR #104](https://github.com/LifeLoggerAI/urai-admin/pull/104): `ba074d27e0e45b277a3692fdee38f17ed6204109`. It introduced a guarded owner-only QA *image* path and local 12-case synthetic filesystem checks, but did not guard log/diff JSON file reads.
- New R879 [Admin draft PR #105](https://github.com/LifeLoggerAI/urai-admin/pull/105): `14bbe0c799482c6c500a14a18073bfd3d113d481`. GitHub comparison showed 7 commits ahead / 0 behind R878, exactly six paths changed:
  - `apps/urai-admin/src/lib/qa/guarded-artifact-read.mjs` (bounded chunk reads; HOME-relative references)
  - `apps/urai-admin/src/lib/qa/safe-snapshot-summary.mjs` (new strict bounded parser and redacted summary)
  - `apps/urai-admin/src/app/api/qa/logs/route.ts` (guarded 1 MiB snapshot read and minimum output)
  - `apps/urai-admin/src/app/api/qa/diff/route.ts` (guarded 1 MiB reads and safe relative internal image references)
  - `apps/urai-admin/test/qa-snapshot-summary.behavior.test.mjs` (new source tests)
  - `apps/urai-admin/package.json` (register test suite)

## Security justification / boundaries

Previous `qa/logs` (Git blob `4b880b285119a6b40d4080ad0428ba7b138f3186`) and `qa/diff` (blob `e46c3b92332efca1ff35568b5bf66f9231c838e0`) used ordinary `fs.readFile` with a lexical pathname; they did not reject filesystem symlinks or bound read size. Original log response returned raw `snapshot.console` entries and full link URLs; these may contain sensitive information, so treating them as harmless simply because the endpoint requires owner authentication would be insufficient. Original diff returned absolute server paths.

R879 uses the R878 guard to read only `HOME/deploy_logs/urai-admin_curr_snapshot_<tag>.json`, limits each JSON read to 1 MiB, rejects nonregular/symlinked files (subject to R878 TOCTOU residual), and returns only broken link **pathnames/status**, raw console **count** (with empty backwards-compatible `consoleErrors` array), and screenshot keys plus relative internal image locators rather than absolute paths. Parser caps link/screenshot/console entry counts, limits screenshot identifiers and requires SHA256-shaped digests, rejects other JSON shapes, and allows legacy `NAV_ERR` status.

The shared guard now reads in bounded 64 KiB chunks with a maxBytes+1 refusal rather than unbounded `file.readFile`. The source-only new regression covers redaction, legacy navigation failure, diff references, bad hashes/keys, malformed and oversize snapshots, and invalid tags.

## Verification grade and missing work

- GitHub exact source read and compare: **source verified**. This is not a complete raw-byte/history audit or a production deployment.
- No fresh R879 native Node test PASS, full pnpm workspace frozen install, TypeScript/Next build, Auth/Firestore emulator, GitHub green CI or deployed source identity was independently obtained. Local container has Node 22.16.0 but public GitHub DNS checkout fails. New tests are present in the branch; do **not** count them as passed.
- R878's prior 12/12 local synthetic tests apply to its original helper, not necessarily amended R879 source.
- Further review needed: original QA read guard's parent-directory TOCTOU if untrusted writers can swap directories; `qa/snapshots` directory listing can traverse symlink root; real authenticated owner-only API contract and UI consumption; operation log and legacy `urai_admin_golden_path.sh` risk; exposure of raw console data in underlying artifact storage, where response minimization does not remove original files.
- Shared `urai-4dc1d` global Firestore/Storage Rules publisher and default Functions namespace collision stay release-blocked (#100/#101). Complete IAM, private media/memory/consent negative tests and production exact-SHA deployment/rollback still absent.

## Priority

P0: run new exact-head standalone/node tests + original full native source, harden directory swap handling, negative authentication/data access checks, resolve single project-wide Rules publisher and dedicated Functions codebase ownership; read-only provider inventory and deploy source mapping. P1: safe QA snapshot root listing, JSON metadata UI compatibility, log generator privacy and lifecycle, cross-system Privacy/Jobs/Studio/Analytics/Communications integration. Preserve all prior worker branches; no merges, secrets or live privileges.

**R879 is a draft improvement, not Admin security certification.**

## GitHub Actions exact-head update

New [PR #105](https://github.com/LifeLoggerAI/urai-admin/pull/105) exact source `14bbe0c799482c6c500a14a18073bfd3d113d481` has **four completed FAILURE** workflows: Visual `42440822761`, CI `42440822720`, Validate `42440822725`, Production Verify `42440822728`. These are workflow conclusions only. GitHub logs/runner annotations are not accessible from the current connection, and no native QA tests were recorded as PASS for R879. Do not assign root cause or promote source to production.
