# Stable transitive lock validation

Date: 2026-10-07
Owner: URAI Admin
Verdict: BLOCKED for release; bounded source repair verified locally.

The original #85 head `6a1db34a98868ab7ea3356f87249522e0eadd4ad` contains three newly published transitive resolutions rejected by the current local package release-age policy. This repair changes only compatible locked leaf resolutions and their registry integrity receipts:

| Package | Previous | Selected | Registry publication UTC |
| --- | --- | --- | --- |
| caniuse-lite | 1.0.30001815 | 1.0.30001814 | 2026-09-30 09:03:42 |
| electron-to-chromium | 1.5.450 | 1.5.446 | 2026-10-06 18:03:43 |
| resolve | 1.22.13 | 1.22.12 | 2026-04-11 17:41:35 |

`is-core-module@2.17.0` is retained and satisfies resolve 1.22.12's `^2.16.1` dependency. Framework, Firebase SDK/CLI, local mitigation forks, manifests, overrides, security thresholds, and runtime privacy controls remain unchanged. No release-age exemption was added.

The patched graph passes the current pnpm 11 supply-chain policy verification for all 1,174 lock entries. Installation then stops because pnpm 11 does not read this repository's declared pnpm 9 override configuration. The exact declared `pnpm@9.15.0` frozen install succeeds after that independent policy pass and preserves the lockfile. Full installed dependency audit reports zero findings across all severities; all 13 installed mitigation behavioral tests pass.

Local `check:types`, lint, `test:unit`, rules and route contracts, build, public/unauthenticated smoke, `verify:release`, and `release:lock` pass with the patched graph. Smoke observations are read-only checks of the existing deployment; they do not prove that deployment contains this donor. Local Node24 is supplemental to native Node22 CI. The local release script's printed HEAD is the unchanged parent, not an exact-source certification of the uncommitted donor.

Fresh native checks are required on the published candidate. Independent exact-head security review of the inherited braces and stream-json mitigation forks remains absent; zero scanner findings do not establish upstream remediation or that review. Protected deployment, real authenticated staging/production evidence, monitoring/rollback/legal/owner signoff, and production parity remain separate requirements. No deployment or production-ready claim is made.
