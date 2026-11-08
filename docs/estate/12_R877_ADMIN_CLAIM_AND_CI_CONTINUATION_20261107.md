# R877 — Admin signed-cookie authority invariant and current CI review (2026-11-07/08 UTC)

**Verdict: PRODUCTION HOLD.** This is a source-pinned, review-only security continuation of [R876](11_R876_ADMIN_SECURITY_RECONCILIATION_20261107.md), not an Admin deployment or final certification.

## Current pinned engineering chain

- [Original Admin engineering PR #85](https://github.com/LifeLoggerAI/urai-admin/pull/85): `8313188532aef304a3b55771c5080f87e4ac71eb`, draft/unmerged, historical 8/8 successful exact-head source workflows.
- [R874 Admin PR #100](https://github.com/LifeLoggerAI/urai-admin/pull/100): `68db1919064f4fe05ec015a4b0e52240c071093a`, Rules publishing fence, 4/4 GitHub workflow failures.
- [R875 Admin PR #101](https://github.com/LifeLoggerAI/urai-admin/pull/101): `8cc77b555352ec817edb3a428e0a6e8762e039e0`, proposed dedicated Functions namespace gate, config remains default, 4/4 workflow failures.
- [R876 Admin PR #102](https://github.com/LifeLoggerAI/urai-admin/pull/102): `9cdb93e34f4cd52c04a5d5ac677e3cadca529958`, repaired malformed shell source contract and added regression, 4/4 exact-head workflow failures. Each of four jobs completed within a few seconds with empty returned step lists. Job logs/annotations unavailable from accessible GitHub tools; do NOT diagnose specific test failures or claim a successful original checkout/build.
- [R877 Admin PR #103](https://github.com/LifeLoggerAI/urai-admin/pull/103): `b0bb890fe8ca268341453c324bc849b014d1d020`, draft atop #102, exactly three changed paths and three commits ahead/zero behind the parent, no production changes. Exact current head must be reread before further action.

## Concrete discovered enforcement gap

Original `apps/urai-admin/src/lib/admin/require-admin-session.ts` Git blob `9a23968504a4fd762fbf77d3c6c54d828ef23e75` verified revoked Firebase session cookie and compared claim `role` against allowedRoles and canonical active `adminUsers`/roleVersion, but **omitted an independent `decodedToken.admin === true` condition** for downstream protected routes. The earlier token-to-cookie exchange did check `admin:true`, but a signed role-bearing session should not be authorized on that indirect assumption. Because Firebase Admin SDK bypasses client Firestore Rules, application authorization must independently guard all privileged reads.

R877 modifies the session function's role gate to reject `decodedToken.admin !== true` and all missing/disallowed roles. New blob `74562b7aad6875fc4a7eeb06bdbac56561302a09` (commit `df73c8f90a00c1657111645810cbcfcdae35df23`). Existing owner/admin/viewer intended roles, active-record checks, version matching and cookie revocation remain intact. This is defense-in-depth, not proof an attacker exploited it or that a legitimate user could mint an invalid cookie in production.

## Negative regression evidence / limits

- `apps/urai-admin/test/source-contracts.test.mjs`: source assertion requires explicit `decodedToken.admin !== true`, blob `141a8a2e6f26887b00c35004e18690b975358db0`, commit `b0bb890fe8ca268341453c324bc849b014d1d020`.
- `scripts/run-admin-auth-runtime-emulator-receipt.mjs`: adds synthetic active viewer with `role:'viewer'`, matching canonical record and `admin:false`, ensures ordinary login exchange fails, then mints SDK session cookie in isolated Auth emulator and checks protected session/collection/users all return HTTP403; blob `4991c51f2d213c5b4e97a0a0c5f036f96547f34b`, commit `b17b4e1145a5355c5e6e19a083c249e5a1ed0ce2`.
- GitHub returned exact source/commit readback, **NOT a fresh complete native test, installed pnpm, Auth+Firestore emulator execution or production verification**. Local container Node 22.16.0 + TypeScript globally installed, but GitHub checkout network DNS unresolved and no workspace dependencies present. No source-run PASS asserted.
- R876 PR #102 exact GitHub four failures: CI run `42434871951`, Production Verify `42434872054`, Validate `42434872133`, Visual `42434872003`. All failed in approximately three seconds, with zero job steps returned. Metadata alone cannot establish billing/runner cause. Access to job logs returned errors; check-run annotations were not readable using available endpoint.

## Preserved boundaries and owner next actions

1. Preserve original #85 and chained #100/#101/#102/#103 unmerged; no silent force push or main promotion. Do not weaken #101's source-mandated default Functions codebase HOLD to obtain green CI.
2. Inspect GitHub billing/runner/job check annotations with authorized owner UI or connector capability, then execute new exact-head native frozen installs, node security gate, Auth/Firestore emulator, negative signed-session test, both Next builds and Functions codebase source tests. Do not reinterpret blocked Actions as all-tests PASS or FAIL.
3. Read-only inspect effective Firebase `urai-4dc1d` Rules, IAM principal scopes, deployed Functions codebases/versions, Hosting source/revisions. No live privilege or rules changes without consent.
4. Verify anonymous, viewer, role-without-admin-claim, admin, owner, inactive, revoked, downgraded, cross-user and cross-tenant read/mutation denials; specifically raw memories/media/consent payloads and job output remain inaccessible to Admin irrespective of UI or client Rules.
5. Investigate QA image path symlink containment and owner-only logs, audit data minimization, privacy request/deletion lifecycle, Studio/Jobs/Analytics/Communications/RuAi bridges.
6. Resolve single federated Rules publisher and dedicated Functions codebase migration only under reviewed owner authority; then protected release and rollback source pin, device/accessibility acceptance and independent review.

No production deployment, cloud mutation, secret disclosure or paid compute performed.
