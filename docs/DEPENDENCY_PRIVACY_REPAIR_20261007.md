# Admin dependency and private mutation repair

This is source work based on `main@1cde00e69238f6a32237af2d1914a1b77339d5bc`. It is not production, independent release or Golden Master acceptance. Current verdict: **BLOCKED** until exact-head native verification, independent security review and protected runtime/deployment gates are satisfied.

## Resulting behavior

The canonical pnpm workspace updates Firebase Admin to 13.10.0, Firebase Functions to 6.6.0 with explicit existing v1 entrypoint imports, Firebase CLI to 15.24.0 and Next to 15.5.26. ESLint 9 uses its supported legacy configuration mode for the existing Functions rules. Targeted compatible transport/parser overrides and fresh lock resolution repair registry advisories without disabling rules or audit findings. The retired root npm lock is historical in Git: all repository CI/deploy workflows and the declared packageManager use the single pnpm workspace lock. An unsupported second install authority must not retain a predecessor vulnerable graph.

CI now performs a full registry audit and tests the actual installed security-sensitive consumers before its existing loaded emulator, Auth/RBAC, exact-source and clean-head gates. It preserves both audit and behavioral logs. There are no audit exclusions or acceptance waivers.

Two local forks remain explicit risks for independent security review:

| Package | Exact local mitigation | Advisory boundary |
| --- | --- | --- |
| braces 3.0.3-urai.1 | Existing Investors MIT fork bounds parser and caller AST nesting at 128 | GHSA-vfj7-8cjw-p6xm has no observed compatible upstream patched release |
| stream-json 1.9.1-urai.1 | BSD-3-Clause fork preserves CommonJS 1.x, bounds parser/verifier/assembler/filter nesting and safely creates own object keys | GHSA-mjw6-4jj6-33hc and GHSA-528h-pc64-c93x are locally mitigated; GHSA-hqr4-qq8f-hg3x JSONC path is absent in this pinned implementation and tested for rejection |

Registry scanners can omit local dependencies. Zero registry findings are not upstream remediation, a risk waiver, or independent review. Each fork retains original license, README, file provenance and explicit replacement criteria. The tests exercise real CLI/AST consumers, all four filter pass/skip paths, a 128-depth boundary, deeply nested hostile inputs and transport API compatibility.

Rejected Analytics ingest requests previously stored private body previews before authorization. Rejections now retain content-free reason/body-type metadata only. Invalid JSON creates no record. This does not certify the separate accepted-event consent protocol, distributed rate limiting or downstream privacy lifecycle.

Foundation cache invalidation now uses the canonical same-origin, revocation-aware Admin mutation session. The transaction rechecks active canonical actor role and commits the configuration and minimal audit together. Client-supplied ID tokens cannot bypass the canonical session, and failed audit writes do not leave an unaudited configuration change.

## Verification and exact claim limits

Local workspace install, full registry audit, installed security behavior, types, lint, unit/route/rules/registry contracts and direct Next application builds are supplemental source evidence. Local execution uses Node 24; declared Functions and CI use Node 22. The local mirror is not a Git checkout, so the root WIF inventory gate correctly rejects local full build/release lock at git inventory; this gate is not weakened. Native checkout verification is required for the actual candidate. SDK-injected transaction/handler tests are not emulator, live transaction or production proof.

Before repair, seven installed parser tests and all six Foundation cache authority tests fail. Repaired suites pass 13 installed dependency cases, six Foundation authority cases and three rejected-ingest privacy cases. Existing privacy/security tests and production preflight remain intact. Source-map identity, a clean native install, loaded Auth/Firestore emulator receipts, genuine protected runtime acceptance, independent exact-SHA security/release review, approved configuration, governed deployment and production readback remain required.

Rollback is a revert of the bounded donor, with the previous dependency graph's recorded risks retained. No production mutation, provider call, spending, legal representation or independent approval is performed by this source donor.
