# URAI Repository and Runtime Source of Truth

Status date: 2026-07-06

This document assigns repository responsibility. A repository being active or source-tested does not mean its production deployment is verified.

## Canonical ownership matrix

| System | Canonical repository | Branch | Observed HEAD | Runtime/package evidence | Ownership status | Production classification |
|---|---|---|---|---|---|---|
| Public spatial experience | `LifeLoggerAI/urai-spatial` | `main` | `f55ad9f08a80d502c85538300907dcb7f1566212` | pnpm 10, Node 22+, workspace `urai-tier1`, Next 15/React 19, Firebase/Three/XR | **Canonical public runtime** | PARTIALLY IMPLEMENTED; exact deployed-SHA parity not verified in this execution |
| Legacy public application | `LifeLoggerAI/UrAi` | `main` | not pinned in this document | npm, Node 20, Next 15, Genesis/V1/tier release and Firebase scripts | **Legacy/overlapping release implementation**; must not independently own `urai.app` after migration | REJECTED OR OBSOLETE as primary runtime, pending migration/archive decision |
| Asset generation | `LifeLoggerAI/asset-factory` | `main` | `bda96f72c86186abc553947dddd66360e12bfc26` | npm workspaces, Node 20.19+, Python image generator, Firebase functions/studio | **Canonical asset and V1–V5 asset-version contract owner** | BLOCKED for provider certification by cost controls, billing, receipts, and version-entry consistency |
| Administrative control plane | `LifeLoggerAI/urai-admin` | `main` | `09ded3e78dd0dd1801f144e679cd443c7d97e677` at execution start | pnpm 9.15, Next 14, Firebase Hosting/Functions, Node 20 Functions | **Canonical administration and completion-ledger owner** | NOT RELEASE-CAPABLE until auth, behavioral tests, live baseline, and source cleanup close |
| Studio/orchestration UI | `LifeLoggerAI/urai-studio` | `main` | `4a1ce1bf39c821212f5b7565453761d85aad545c` | pnpm 9.7, Node 20, Next/Functions, provider/evidence/health guards | **Canonical Studio owner** | PARTIALLY IMPLEMENTED; latest brain-map UI is hardcoded and not connected to a system graph API |
| Jobs and workers | `LifeLoggerAI/urai-jobs` | `main` | `f364c5b8497203d886108e22d262bb9460604ec4` before PR #72 | pnpm 8.15, functions/web/workers, queue/DLQ/lease/worker/deploy/rollback/monitoring scripts | **Canonical durable execution owner** | PARTIALLY IMPLEMENTED; release-version contract correction is in PR #72; live worker evidence still required |
| Privacy and data rights | `LifeLoggerAI/urai-privacy` | `main` | `b81d5a189aeb1bf233dce0dd539e7aa7d387b36a` | npm, Node 20.19+, Next 16, Firebase emulators/rules/live-proof/final-lock scripts | **Canonical privacy-policy and rights-execution owner** | BLOCKED: repository declares deployment unconfirmed due external credentials and strict live proof |
| Reusable content packages | `LifeLoggerAI/urai-content` | `main` | `d8887a2bf26182b9b0c9fcf16b0610faa9040b93` | npm, TypeScript package plus Next web scaffold, validation/seed/e2e/provider/observability gates | **Canonical reusable content, localization, accessibility metadata, and publication-contract owner** | BLOCKED: deploy command intentionally fails until provider, E2E, observability, deployed smoke, and rollback evidence are green |
| Analytics | `LifeLoggerAI/urai-analytics` | `main` | `125b5fc7c8f7bd783bc9a581f1d2eeced56eb3b4` | npm/TypeScript HTTP service, tests/workers/production-lock scripts | **Canonical governed analytics service owner** | PREVIEW/STAGING ONLY; no verified canonical deployment target, dashboard, durable transport, or live rollback evidence |
| Marketing | `LifeLoggerAI/urai-marketing` | `main` | `c304d1980eb0fff0a12847f07068540d220b769e` | npm/Vite, Firebase hosting/functions, preflight/audit/live-check/release scripts | **Canonical public marketing-site owner** | PARTIALLY IMPLEMENTED; provider Functions and final live receipts remain environment/billing dependent |
| Storytime | `LifeLoggerAI/urai-storytime` | `main` | `af3b97166b23c55618ae3cdd91a96bb035fd40f2` | npm, Next 15/React 19, Firebase emulators/rules/provider/production evidence | **Canonical Storytime owner** | BLOCKED: repository explicitly requires CI artifact, isolated Firebase, emulator behavior, provider, persistence, share/revoke/export, safety/legal/privacy receipts |
| Investor portal | `LifeLoggerAI/urai-investors` | `main` | not pinned in this document | pnpm/Next 16/React 19/Firebase/Three/Playwright | **Canonical confidential investor-surface owner** | PARTIALLY IMPLEMENTED; access policy, dependency alignment, live deployment, and confidentiality evidence required |
| B2B portal | `LifeLoggerAI/B2Bportal` | `main` | not pinned in this document | npm/Vite/React 18/Firebase 12, Playwright and real Firestore/Storage emulator tests | **Canonical B2B partner portal owner** | PARTIALLY IMPLEMENTED; tenant isolation and live deployment evidence required |
| Communications | `LifeLoggerAI/urai-communications` | `main` | not pinned in this document | npm workspaces, Node 20+, functions/web, emulator and staging delivery/webhook verification | **Canonical communications/delivery owner** | PARTIALLY IMPLEMENTED; provider credentials, consent, rate/cost policy, and production receipts required |
| Governance/foundation | `LifeLoggerAI/urai-foundation` | `main` | not pinned in this document | repository verified in organization inventory | **Governance evidence owner pending detailed contract** | PARTIALLY IMPLEMENTED |

## Deployment canon

### Public experience

- Repository: `LifeLoggerAI/urai-spatial`
- Branch: `main`
- Runtime: `urai-tier1`
- Package manager: pnpm 10
- Supported Node: 22+
- Domain target: `https://urai.app`
- Firebase project target: `urai-4dc1d`
- Exact live SHA: **BLOCKED / not established in this execution**
- Rollback SHA/release: **BLOCKED / not established in this execution**

### Admin

- Repository: `LifeLoggerAI/urai-admin`
- Branch: `main`
- Runtime: `apps/urai-admin` packaged into `functions/apps/urai-admin`
- Package manager: pnpm 9.15
- Functions runtime: Node 20
- Firebase project: `urai-4dc1d`
- Default hosting candidate: `https://urai-admin.web.app`
- Custom-domain candidates in source: `uraiadmin.com` and `www.uraiadmin.com`; one must be selected and evidenced
- Exact live SHA and rollback release: **BLOCKED / not established**

## Ownership decisions

1. `urai-spatial` owns the public product and route chain. `UrAi` may supply migrations or test concepts but cannot independently deploy the same public domain.
2. Asset Factory owns asset-version meanings and provider receipts. Jobs consumes that contract and must not redefine versions.
3. Jobs owns durable execution semantics; Studio and Admin are operator surfaces, not substitute worker runtimes.
4. Privacy owns consent policy, export/deletion authority, retention, and rights receipts. Public Passport and Admin consume those contracts.
5. Content owns reusable, non-private packages and localization/accessibility metadata. It does not own raw private memories, journals, relationships, precise location, or health-adjacent records.
6. Analytics owns governed aggregate analytics only. It must not silently become a warehouse for raw private-life content.
7. Every service must expose an authenticated, privacy-safe health/version/SHA contract before Admin or public Status can label it healthy.

## Obsolete and overlapping paths

The following require explicit migration or archival receipts rather than silent continued ownership:

- `LifeLoggerAI/UrAi` as an alternative public runtime;
- duplicate application trees and backups inside `urai-admin`;
- hardcoded/prototype system maps and control-plane servers that are not connected to real contracts;
- local-only/mock ecosystem adapters that report success without external writes;
- any legacy Asset Factory entry point whose V3/V4 meanings differ from the canonical catalog.

## Environment and credential ownership

Each service repository must own an environment schema listing variable name, purpose, secret/public classification, provider, environment, rotation owner, and validation command. Secret values must remain in the deployment provider or GitHub environment and must never be copied into this document.

## Required next receipts

- exact current production and rollback baseline for `urai.app`;
- exact current production and rollback baseline for Admin;
- protected GitHub production-environment settings;
- V1 asset promotion receipt and V2–V5 provider/cost receipts where applicable;
- service health/version/SHA contracts;
- migration/archive receipt for `UrAi` and duplicate admin trees;
- live privacy, jobs, content, analytics, Storytime, marketing, investor, B2B, and communications evidence before any production classification is upgraded.
