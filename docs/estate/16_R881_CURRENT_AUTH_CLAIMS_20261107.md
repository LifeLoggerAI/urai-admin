# R881 — Admin current Auth account authority on protected reads (2026-11-07/08 UTC)

**Decision: PRODUCTION HOLD.** Selected source-verified security proposal, isolated synthetic behavior run, not full-native production certification.

## Prior work and exact source

- Main Admin engineering [PR #85](https://github.com/LifeLoggerAI/urai-admin/pull/85) remains draft at `8313188532aef304a3b55771c5080f87e4ac71eb`. Existing shared Rules/Functions publishing protection #100/#101 and subsequent security review #102–#106 are unmerged.
- Immediate R880 parent [PR #106](https://github.com/LifeLoggerAI/urai-admin/pull/106) head `f4d4232c041154562da0a0ce2c7bf8fc510a54d2`.
- R881 review-only [PR #107](https://github.com/LifeLoggerAI/urai-admin/pull/107) head at creation `89c0cb7c01a4f5a0f5e77a2b2908197d337c96b8`, child of #106. GitHub comparison 5 commits ahead, none behind, **five changed files**:
  1. `apps/urai-admin/src/lib/admin/require-admin-session.ts`
  2. `apps/urai-admin/test/admin-current-auth-claims.behavior.test.mjs` (new)
  3. `apps/urai-admin/test/source-contracts.test.mjs`
  4. `apps/urai-admin/package.json`
  5. `scripts/run-admin-auth-runtime-emulator-receipt.mjs`.

## Source-confirmed stale-authority risk

The existing `requireAdminSession` verified signed, revocation-aware Firebase session cookie and canonical active `adminUsers` role/version. Prior blob `74562b7aad6875fc4a7eeb06bdbac56561302a09` did not independently read **current Auth user customClaims** on routine protected reads. If an Auth administrator's current role/admin/roleVersion changes independently of revoking the old signed cookie, the old cookie and unchanged canonical Firestore member could still pass this reader. This is **a potential stale-authority discrepancy**, NOT proof of real-world exploitation, an unauthorized actor or accessible private data.

Proposed new blob `c0f5a519c72b46220fe7a32e798e2ed237fb5215` fetches `auth.getUser(decodedToken.uid)` after signed cookie role/claim admission but **before** privileged `adminUsers` Firestore lookup, denies deleted/disabled/different UID, `currentClaims.admin !== true`, mismatched role or roleVersion, and propagates non-auth provider failures without allowing reads. It preserves existing role, Firestore isActive/version/mutation checks. This increases provider read calls; performance and service quota should be evaluated in production readiness, never silently remove the check for speed.

## New tests and evidence grades

- New source test `apps/urai-admin/test/admin-current-auth-claims.behavior.test.mjs` uses TypeScript transpilation of the actual protected-session file, with simulated Firebase dependencies, to test current-claim withdrawal, downgrade, incarnation, missing claims, disabled/deleted/mismatched identity, provider error and a permitted owner.
- New source-contract assertions explicitly require the current Firebase account fetch and claim/version comparisons.
- The isolated Auth/Firestore emulator runner now modifies a **disposable** viewer's Auth `admin` claim to false, deliberately retaining the original signed cookie and canonical Firestore member; two protected GET routes must each return 403.
- **Actual local test performed:** Node v22.16.0 compiled a locally recreated, *abbreviated extracted-function fixture* with TypeScript and mock Auth/Firestore; **10/10 synthetic test cases PASS**. This demonstrates the decision logic and basic harness, NOT the entire current GitHub source, new repository behavior test, Next route build, Firebase SDK/Firestore emulator, or actual protected runtime. Avoid reporting `10/10` as whole-repo or actual real-source test PASS.
- Earlier R880 six exact-blob QA test files and 24/24 isolated native QA tests still belong to R880; they do not certify this new R881 session change.
- All prior R880 GitHub Actions conclusions were failures with **0 reported job steps**. Root cause not proven from accessible metadata, logs not retrieved. Full R881 exact-head CI must be reviewed separately.

## Remaining P0 gates

Require authentic full monorepo frozen installs and native typecheck/build, source-backed auth behavior suite, Auth/Firestore emulator protected HTTP denial proof, current deployed IAM/Auth principal and effective shared project Rules/Functions ownership, cross-tenant/private memory/media/consent denials, exact deployed-SHA provenance and protected rollback. Any account or IAM change requires explicit owner approval. New source test passes cannot be inferred from GitHub workflow metadata alone.

**R881 source fix is draft, not merged or deployed; One UrAi Genesis Admin production HOLD.**

## R881 exact-head GitHub Actions update

At head `89c0cb7c01a4f5a0f5e77a2b2908197d337c96b8`, GitHub reports **four completed FAILURE** workflows: CI `42441959600`, Validate `42441959522`, Visual `42441959616`, Production Verify `42441959868`. Each returned job record has **no recorded steps**. There is no evidence that the new Node test, Firebase emulator or native Next build actually started. The cause remains unknown from available metadata; do not declare a successful CI or infer an application test failure. No production GO.
