# R887 — Native integration of actual Admin Next packager and release parity guard (2026-11-07/08 UTC)

**STATUS: REVIEW-ONLY / PRODUCTION HOLD.** This continuation does not alter live Firebase, IAM, Rules, production administration, deploys, cloud billing or user records. Existing owner engineering #85 and all security review branches #100–#111 remain unmerged and undisturbed.

## Source and PR

- Parent [Admin #111](https://github.com/LifeLoggerAI/urai-admin/pull/111) exact SHA `f8d55b9312ff0add3a61dbfbc360add93f700a96`: R886 Functions upload exclusion, source and compiled Next parity.
- New review-only [Admin draft #112](https://github.com/LifeLoggerAI/urai-admin/pull/112) head `903052be9e104c2895d99628006836768ffc9960`; two commits ahead, zero behind and exactly **two changed files**: new `scripts/test-admin-packaging-integration.mjs` and root `package.json` (adds `test:packaging-integration` into the existing root test chain).
- Exact source packager `scripts/package-next-for-functions.sh` Git blob `0dbd9579952bfcfa43ee4f979e955103cc0c245b`, source parity guard Git blob `99034373f4eb41aec8fbc3e33fa6f198c1fb3b1c`, and Firebase configuration Git blob `7ca8070e85a082066bc177d6b69cabd2a910b7d2`; all checked locally against `git hash-object`.

## Executed local evidence

On Node.js `22.16.0`, a disposable directory mimicked a minimal Next source tree, generated `.next/server` and `.next/static` outputs, stale tracked `functions/apps/urai-admin` mirror and root Functions configuration. Executed the **actual source-matched shell packager** and immediately verified the output using the exact R886 parity guard:

1. Packaged source and compiled Next outputs matched by path and byte hash.
2. Packager removed temporary `.next/cache`, source maps and tsbuildinfo.
3. Divergent tracked legacy mirror did not enter the generated runtime directory.
4. Old files left in a prior generated runtime were removed before copying.
5. Altering canonical source after packaging denied parity.
6. Altering compiled generated server JavaScript after packaging denied parity.
7. Missing canonical `.next` directory caused source packager failure.
8. Generated runtime remained separate from legacy `functions/apps`; configuration included both intended ignore entries.

Result: **8/8 native integration tests PASS, exit code 0**. A combined run of these 8 checks with earlier R886 19-case package-guard tests: **27/27 PASS**, exit code 0; combined TAP SHA256 `d781095d7bbd3f3dce2b5ec4c3af3d91fdf951964cf0a009f69c2821b078e605`.

Local npm minimatch `9.0.5` using `matchBase:true,dot:true` additionally confirmed `**/functions/apps` and `**/functions/apps/**` match obsolete mirror paths but not `functions/.generated/urai-admin`. This mirrors upstream firebase-tools v15.24.0 glob options but is NOT an actual Firebase source ZIP.

The new repository test file is committed and registered on #112, but **the exact published new test file has not yet been run from a complete GitHub checkout**. The executed local test is equivalent in scenario coverage; the exact source hashes above apply to the original packager, guard and Firebase config. Do not promote the local synthetic Next build to a real production Next build.

## Source boundaries and outstanding acceptance

R886 Git tree has 158 tracked Functions files, including 146 in the legacy app subtree; remaining nonlegacy tracked sources are Functions entrypoint, institutional control plane, analytics backend, tests and config. Explicit exclusion prevents legacy source enumeration under the validated glob behavior; it does not establish the actual uploaded ZIP contents.

P0: full no-cost clean/frozen source install and native app/Functions builds, run the new #112 test as committed, generate/inspect a real firebase-tools 15.24.0 packaging archive, and verify active generated Next source+compiled parity, source SHA, and no legacy mirror inclusion. Existing Actions job admission failures, likely external account billing restriction based on historical estate evidence, persist; do not initiate paid runners.

P0: read-only `urai-4dc1d` effective IAM, Rules and Functions publisher inventory; dedicated codebase migration review and authenticated real emulator/private memories/media/consent cross-user denial. Production authorization and rollback remain unverified.

**DO NOT DECLARE ADMIN SECURE OR RELEASE GO.** Preserve other workers and the master registry.

## Exact-head R887 GitHub Actions

At Admin draft PR #112 SHA `903052be9e104c2895d99628006836768ffc9960`, four workflow conclusions were **FAILURE** with **zero recorded job steps**: Admin CI run `42446291941` / job `128625811408`; Validate run `42446291828` / job `128625811072`; Visual Truth run `42446291844` / job `128625811272`; Production Verify run `42446291768` / job `128625810955`. No GitHub build or test run can be inferred from those failures. Root cause is not authenticated by an exact-head annotation. Preserve the 27 local synthetic/integrated PASS as separate evidence and keep production HOLD.
