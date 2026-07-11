# URAI System of Systems Registry

This file is the canonical human-readable registry mirror until the `systemRegistry` Firestore seed is verified in staging and production. Executable registry data is defined in `scripts/system-registry-data.mjs`.

Evidence date: 2026-07-11.

A repository, route, workflow, candidate SHA, or planned URL does not establish production health. Exact deployed SHA, distinct rollback SHA, current smoke, monitoring, authorization, privacy, and rollback evidence are required.

| System | Canonical repository/runtime | Status | Production surface | Current evidence | Blocking evidence |
| --- | --- | --- | --- | --- | --- |
| URAI Main Experience | `LifeLoggerAI/urai-spatial` / `urai-tier1` / `main` | `degraded` | `https://urai.app` | Core route content is externally reachable; release-control candidate PR #539 is held unchanged and sensory candidate PR #541 remains separate | Exact deployed SHA, distinct rollback SHA, monitoring, privacy parity and authenticated backend proof missing |
| URAI Admin | `LifeLoggerAI/urai-admin` / `apps/urai-admin` | `blocked` | `https://www.uraiadmin.com` target | App, rules, functions and fail-closed registry/deploy gates exist in source; PR #45 is the current registry candidate | Deployment, owner bootstrap, authorized and denied route proof, DNS, monitoring and rollback missing |
| URAI Analytics | `LifeLoggerAI/urai-analytics` | `blocked` | Not certified | Privacy-safe API/workers and governed ingestion hardening exist in source | Durable live Firestore, deployment, monitoring and rollback evidence missing |
| URAI Communications | `LifeLoggerAI/urai-communications` | `blocked` | Not certified | Provider adapters, signed webhook intake, consent gating and staging harnesses exist | Live provider callbacks, retention and data-rights proof, monitoring, legal review and rollback missing |
| URAI Privacy | `LifeLoggerAI/urai-privacy` | `blocked` | `https://uraiprivacy.com` target | Authorization/security base PR #82 remains the required predecessor for stacked consent/export PR #93 | Authenticated live export, deletion and consent proof, deployment, monitoring, backup and restore, and legal evidence missing |
| URAI Foundation | `LifeLoggerAI/urai-foundation` | `blocked` | `https://uraifoundation.org` target | Static governance and standards source exists | Canonical host, deployed and rollback SHA, DNS and TLS, and private reporting channel unresolved |
| URAI Spatial | `LifeLoggerAI/urai-spatial` / `urai-tier1` | `degraded` | `https://urai.app` | Same canonical public product as Main Experience; WebXR source and evidence-bounded sensory candidates exist | Exact release and rollback identity, browser and device proof, accessibility, privacy parity and monitoring incomplete |
| URAI Studio | `LifeLoggerAI/urai-studio` / `apps/studio` | `blocked` | `https://www.uraistudio.com` target | App and Firebase Functions source exist | Frozen install, exact deploy SHA, service integration and live smoke missing |
| URAI Jobs | `LifeLoggerAI/urai-jobs` | `blocked` | Internal only | Queue and worker hardening candidate PR #75 is held in draft | Staging worker lifecycle, secrets, Pub/Sub and Storage, deployment, monitoring and rollback receipts missing |
| URAI Investors | `LifeLoggerAI/urai-investors` | `blocked` | `https://urai-investors.web.app` target | Public and gated portal source exists | Claim review, credential remediation, gated auth QA, legal and release proof missing |
| URAI Marketing | `LifeLoggerAI/urai-marketing` | `degraded` | `https://urai-marketing.web.app` | Public Firebase marketing surface is documented | Fresh strict lock, exact deployed and rollback SHA, monitoring, custom domain and legal review missing |
| URAI Asset Factory | `LifeLoggerAI/asset-factory` | `degraded` | `https://urai-4dc1d.web.app` API surface reported | Deterministic proof pipeline and a 362-record governed inventory candidate exist; zero assets are certified | Provider-active rendering, rights and consent, current staging and production receipts, tenancy, billing and custom-domain proof incomplete |
| URAI Content | `LifeLoggerAI/urai-content` | `blocked` | Not certified | Governed prompt/content candidate PR #67 now includes the narrow #68 assurance patch | Exact-head workflows, independent approval, web deployment, Auth, Firestore, Storage, billing, observability and rollback missing |
| URAI B2B Portal | `LifeLoggerAI/B2Bportal` | `blocked` | Not certified | Cohesive Vite/Firebase portal source exists | Project configuration, operators, legal and DPA, notifications, analytics jobs, deployment, monitoring and rollback missing |
| URAI Storytime | `LifeLoggerAI/urai-storytime` | `blocked` | `https://www.uraistorytime.com` target | Current Next.js/Firebase runtime and safety gates exist | Isolated Firebase, emulator behavior, provider, child-safety and legal review, DNS and rollback evidence missing |
| Legacy URAI Demo | `LifeLoggerAI/UrAi` | `not_connected` | Demo only | Repository explicitly represents sample/demo behavior | Rejected as canonical product authority |
| Legacy Dev/Prod/Staging | `LifeLoggerAI/UrAi-Dev`, `LifeLoggerAI/UrAiProd`, `LifeLoggerAI/urai-staging` | `not_connected` | None certified | Repositories exist | Deployment authority and overlap inventory required; must not overwrite canonical production |

## Required Firestore registry shape

```ts
export type SystemRegistryRecord = {
  id: string;
  name: string;
  repo: string;
  runtime: string;
  owner: string;
  status: 'not_connected' | 'blocked' | 'staging_ready' | 'production_ready' | 'degraded';
  productionUrl: string;
  stagingUrl: string;
  firebaseTarget: string;
  lastReleaseSha: string;
  rollbackSha: string;
  lastSmokeResult: 'pass' | 'fail' | 'unknown';
  healthEndpoint: string;
  monitoringUrl: string;
  requiredSecrets: string[];
  knownBlockers: string[];
  integrationContracts: string[];
  dataBoundary: string;
  privacyClassification: 'public' | 'internal' | 'restricted' | 'confidential';
  operationalRisk: 'low' | 'medium' | 'high';
  evidenceLinks: string[];
  registryEvidenceDate: string;
  registryDigest: string;
  sourceSha: string;
  updatedAt: unknown;
};
```

## Integration rule

If a system has no exact deployed SHA plus current live and monitoring evidence, the admin UI must display `Not connected`, `Blocked`, or `Degraded`, never `Healthy` or `Production ready`.

## Seed rule

Use `pnpm seed:system-registry`. The wrapper validates the canonical registry contract, exact clean Git head, target project, service-account project binding, and explicit staging or production approval before any Firestore write. Direct execution of `scripts/seed-system-registry.mjs` is rejected.
