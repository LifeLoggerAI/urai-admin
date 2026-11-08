# R888 — Exact-source packaged Admin verification and upload-policy gap ledger (2026-11-08 UTC)

**VERDICT: PRODUCTION HOLD.** This is a verification and documentary continuation of R887. No production IAM, Firebase Rules, user accounts, deployment, payment, GitHub Actions reruns, or security controller source files were changed.

## Immutable source identity

- [Admin PR #112](https://github.com/LifeLoggerAI/urai-admin/pull/112) unchanged at `903052be9e104c2895d99628006836768ffc9960` (draft, stacked on #111).
- Exact local `git hash-object` equality against GitHub `fetch_file` for all **five** files:
  - `scripts/assert-admin-packaged-source.mjs` — `99034373f4eb41aec8fbc3e33fa6f198c1fb3b1c`.
  - `scripts/package-next-for-functions.sh` — `0dbd9579952bfcfa43ee4f979e955103cc0c245b`.
  - `scripts/test-admin-packaged-source.mjs` — `30b186a4412ff5002325364bf0bd92cf601bf06e`.
  - `scripts/test-admin-packaging-integration.mjs` — `2bd1f09d7977d1f9c0ddbf908cfbb47ec0cf804e`.
  - `firebase.json` — `7ca8070e85a082066bc177d6b69cabd2a910b7d2`.

## Actually executed native proof

The *exact committed* R887 test file was reconstructed byte-for-byte locally. From a local selected-file checkout on Node `v22.16.0`, `node --test scripts/test-admin-packaged-source.mjs scripts/test-admin-packaging-integration.mjs` returned **27 tests, 27 PASS, 0 FAIL, 0 SKIPPED**, exit 0. The executable test uses the real repository shell packager with disposable mock Next output, not a complete Next application build. Current-turn TAP SHA256: `e0e6ddc1f408b6d956da129834a064cf1c6c06c1adc2570bfe4db0c5bcd05b91`. JSON evidence manifest SHA256: `94b8e6191acc20281070bdc664ed5107e59383ea3927eab7ad0e10cdb5480cba`. These replace R887's *equivalent but not exact committed integration test* uncertainty. Files are available as working-container evidence; the raw TAP is not a GitHub artifact.

## Git tracked Functions upload inventory

[Exact Git tracked 158-file upload inventory](R888_FUNCTIONS_GIT_TRACKED_UPLOAD_INVENTORY.json) pinned to PR #112 Git tree. Total 158 tracked files / 353,996 Git-reported bytes under `functions/`. Legacy subtree `functions/apps/`: **146 files / 269,865 bytes**, intended to be ignored. Remaining tracked candidates: **12 files / 84,131 bytes** (entrypoint, control-plane, analytics source, tests/config). The remaining tracked tests and `functions/logAdminAction.ts` are *not* excluded by the current ignore list; their potential archive inclusion is independent of whether they are executed.

### Upstream Firebase tooling source

At `firebase/firebase-tools` tag `v15.24.0`, `src/deploy/functions/prepareFunctionsUpload.ts` invokes `fsAsync.readdirRecursive` on Functions source with `config.ignore`. `src/fsAsync.ts` filters paths with minimatch `matchBase:true,dot:true`; it prunes ignored directories before traversal. The same pinned CLI `package.json` declares `minimatch: ^3.0.4`. Current local environment only provided **minimatch 9.0.5**; a disposable directory traversal using those options excluded `functions/apps` while retaining `functions/.generated/urai-admin`. This is supportive matching evidence but **NOT an exact pinned CLI dependency result or actual Firebase source ZIP**. Do not claim 146 files conclusively excluded from a real upload before the exact resolved CLI package and ZIP are inspected.

### Runtime dependency risk, not a proven failure

At PR #112, `apps/urai-admin/package.json` declares 26 production dependencies and `functions/package.json` declares 6; **20 app package names are absent from the Functions manifest**. Next may bundle them into output or externalize some; neither is known without a real production build and analysis of compiled server externals. Do not add packages speculatively or call this a runtime failure without evidence.

## CI and production status

Previous R887 #112 GitHub Actions runs CI `42446291941`, Validate `42446291828`, Visual `42446291844`, Production Verify `42446291768` all concluded FAILURE with zero job steps. No fresh completed CI was created in R888. Historical GitHub support #4889576 contains independent cross-repository billing-lock evidence but not an exact Admin run annotation. Functions `codebase: default` remains intentionally blocked by the existing release guard; shared project `urai-4dc1d` Rules publisher and IAM scopes remain unverified.

## Next acceptance, highest priority

1. Inspect **actual v15.24.0 Firebase upload ZIP** with the exact resolved minimatch dependency, generated source and built compiled Next code; assert 146 legacy files absent, correct runtime included and no unexpected tests/credentials or private source in archive.
2. Perform clean full frozen Next+Functions install/build and resolve any actual compiled server externalization failure from evidence rather than package-count inference.
3. Run real Auth/Firestore/Storage/Functions emulator scenarios and signed owner/admin/viewer, revoked/downgraded/cross-user/tenant private memory/media/consent denials.
4. Read-only verify effective Firebase IAM, shared Rules publisher, dedicated Functions namespace migration plan, exact deployed SHA and rollback with owner approval before any provider writes.

**All engineering branches retained and unmerged. No production security certification.**
