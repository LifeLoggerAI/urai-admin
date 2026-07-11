# URAI System of Systems Registry

This file is the canonical static registry until the `systemRegistry` Firestore seed is verified in staging and production.

Evidence date: 2026-07-06.

A repository, route, workflow, or planned URL does not establish production health. Exact deployed SHA, smoke, monitoring, authorization, privacy, and rollback evidence are required.

| System | Canonical repository/runtime | Status | Production surface | Current evidence | Blocking evidence |
| --- | --- | --- | --- | --- | --- |
| URAI Main Experience | `LifeLoggerAI/urai-spatial` / `urai-tier1` / `main` | `degraded` | `https://urai.app` | Core route content is externally reachable; exact-SHA release machinery is in PR #433 | Privacy Controls and Status drift; deployed SHA, rollback, monitoring and authenticated backend proof missing |
| URAI Admin | `LifeLoggerAI/urai-admin` / `apps/urai-admin` | `blocked` | `https://www.uraiadmin.com` target | App, rules, functions and production gates exist in source | Deployment, owner bootstrap, authorized/denied route proof, DNS, monitoring and rollback missing |
| URAI Analytics | `LifeLoggerAI/urai-analytics` | `blocked` | Not certified | Privacy-safe API/workers and governed ingestion hardening exist; PR #28 open | Durable live Firestore, deploy, monitoring and rollback evidence missing |
| URAI Communications | `LifeLoggerAI/urai-communications` | `blocked` | Not certified | Provider adapters, signed webhook intake, consent gating and staging harnesses exist | Live provider callbacks, retention/data-rights, monitoring, legal review and rollback missing |
| URAI Privacy | `LifeLoggerAI/urai-privacy` | `blocked` | `https://uraiprivacy.com` target | Privacy app/backend, rules and production gates exist; authorization/consent/data-rights PR stack open | Authenticated live export/deletion/consent, deployment, monitoring, backup/restore and legal evidence missing |
| URAI Foundation | `LifeLoggerAI/urai-foundation` | `blocked` | `uraifoundation.org` target; Firebase fallback reported | Static source, standards and PR #11 hardening exist | Canonical host, deployed/rollback SHA, custom-domain DNS/TLS and private reporting channel unresolved |
| URAI Spatial | `LifeLoggerAI/urai-spatial` / `urai-tier1` | `degraded` | `https://urai.app` | Same canonical public product as Main Experience; WebXR source exists | Exact release, privacy/status parity, browser/device/accessibility and monitoring proof incomplete |
| URAI Studio | `LifeLoggerAI/urai-studio` / `apps/studio` | `blocked` | `https://www.uraistudio.com` target | App/functions and PR #56 hardening exist | Frozen install, exact deploy SHA, service integration and live smoke missing |
| URAI Jobs | `LifeLoggerAI/urai-jobs` | `blocked` | Internal only | Queue/worker runtime exists; PR #75 consolidates correctness and worker security | Staging worker lifecycle, secrets, Pub/Sub/Storage, deploy, monitoring and rollback missing |
| URAI Investors | `LifeLoggerAI/urai-investors` | `blocked` | `https://urai-investors.web.app` target | Public/gated portal source exists | Claim review, credential remediation, gated auth QA, legal and release proof missing |
| URAI Marketing | `LifeLoggerAI/urai-marketing` | `degraded` | `https://urai-marketing.web.app` | Public no-domain marketing surface is documented | Fresh strict lock, deployed SHA, rollback, monitoring, custom domain and legal review missing |
| URAI Asset Factory | `LifeLoggerAI/asset-factory` | `degraded` | `https://urai-4dc1d.web.app` API evidence reported | Deterministic proof pipeline and V1-V5 contract hardening exist | Provider-active rendering, current staging/prod receipts, tenancy, billing and custom-domain proof incomplete |
| URAI Content | `LifeLoggerAI/urai-content` / root package + `apps/web` | `blocked` | Not certified | Canonical content package production lock is merged | Web runtime deployment, Auth/Firestore/Storage, Stripe, observability and rollback missing |
| URAI B2B Portal | `LifeLoggerAI/B2Bportal` | `blocked` | Not certified | Cohesive Vite/Firebase portal source exists | Project config, operators, legal/DPA, notifications, analytics jobs, deploy, monitoring and rollback missing |
| URAI Storytime | `LifeLoggerAI/urai-storytime` | `blocked` | `https://www.uraistorytime.com` target | Current Next/Firebase runtime and safety gates exist | Isolated Firebase, emulator behavior, provider, child-safety/legal, DNS and rollback evidence missing |
| Legacy URAI Demo | `LifeLoggerAI/UrAi` | `not_connected` | Demo only | README explicitly describes sample demo and mocked companion | Rejected as canonical product authority |
| Legacy Dev/Prod/Staging | `UrAi-Dev`, `UrAiProd`, `urai-staging` | `not_connected` | None certified | Repositories exist | Deployment authority/overlap inventory required; must not overwrite canonical production |

## Required Firestore registry shape

```ts
export type SystemRegistryRecord = {
  id: string;
  name: string;
  repo: string;
  runtime: string;
  owner: string;
  status: 'not_connected' | 'blocked' | 'staging_ready' | 'production_ready' | 'degraded';
  productionUrl?: string;
  stagingUrl?: string;
  firebaseTarget?: string;
  lastReleaseSha?: string;
  rollbackSha?: string;
  lastSmokeResult?: 'pass' | 'fail' | 'unknown';
  healthEndpoint?: string;
  monitoringUrl?: string;
  requiredSecrets: string[];
  knownBlockers: string[];
  integrationContracts: string[];
  dataBoundary: string;
  privacyClassification: 'public' | 'internal' | 'restricted' | 'confidential';
  operationalRisk: 'low' | 'medium' | 'high';
  evidenceLinks: string[];
  updatedAt: string;
};
```

## Integration rule

If a system has no exact deployed SHA plus current live and monitoring evidence, the admin UI must display `Not connected`, `Blocked`, or `Degraded`, never `Healthy` or `Production ready`.
