# URAI System of Systems Registry

This file is the canonical static registry until the `systemRegistry` Firestore seed is verified in staging and production.

| System | Repo/package | Runtime | Owner | Status | Production URL | Staging URL | Firebase target | Last release SHA | Last smoke result | Health endpoint | Required secrets | Data boundary | Privacy class | Risk | Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| URAI Main Experience | `LifeLoggerAI/UrAi*` | React/Firebase as configured by repo | Adam Clamp | Not connected | TBD | TBD | TBD | TBD | TBD | TBD | Firebase public config, app secrets | Consumer app data; admin sees only approved summaries | Restricted | High | Needs live contract |
| URAI Admin | `LifeLoggerAI/urai-admin` | Next.js 14, Firebase Hosting/Functions, Node 20 | Adam Clamp | BLOCKED pending evidence | `https://www.uraiadmin.com` | TBD | `urai-4dc1d` | TBD | TBD | `/status` or Functions health | Firebase public config, deploy token, owner seed | Operational metadata only | Internal restricted | High | Needs staging/prod evidence |
| URAI Analytics | `apps/urai-analytics`, `packages/analytics-core` | Workspace app/package | Adam Clamp | Wired as workspace dependency | TBD | TBD | TBD | TBD | TBD | TBD | Analytics service config | Aggregates/status only; no raw telemetry in admin without review | Restricted | High | Needs integration evidence |
| URAI Communications | `LifeLoggerAI/urai-communications` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Provider API keys, Firebase config | Notification status and delivery metadata only | Restricted | Medium | Needs health contract |
| URAI Privacy | `LifeLoggerAI/urai-privacy` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Policy publishing credentials | Policy, deletion, retention, DPA and subprocessor metadata | Public/Internal | High | Needs policy link evidence |
| URAI Foundation | `LifeLoggerAI/urai-foundation` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Governance doc credentials | Governance and ethical review evidence | Internal | Medium | Needs governance evidence |
| URAI Spatial | `LifeLoggerAI/urai-spatial` | Spatial/WebXR/AR as configured | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Spatial service config | Spatial metadata only unless approved | Restricted | High | Needs status endpoint |
| URAI Studio | `LifeLoggerAI/urai-studio` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Studio deploy config | Creative asset metadata | Internal/Public | Medium | Needs production URL |
| URAI Jobs | `LifeLoggerAI/urai-jobs` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Jobs service config | Job metadata, no secrets in admin UI | Internal | Medium | Needs registry seed |
| URAI Investors | `LifeLoggerAI/urai-investors` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Investor portal config | Investor-facing published materials only | Confidential | High | Needs access boundary |
| URAI Marketing | `LifeLoggerAI/urai-marketing` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Marketing deploy config | Public campaign metadata | Public/Internal | Low | Needs URL evidence |
| URAI Asset Factory | `LifeLoggerAI/asset-factory` | Asset generation pipeline | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | Storage/model provider config | Asset metadata and approved generated assets only | Restricted | High | Needs data boundary review |
| URAI B2B Portal | `LifeLoggerAI/B2Bportal` | TBD | Adam Clamp | Contract required | TBD | TBD | TBD | TBD | TBD | TBD | B2B portal config | Partner/account metadata only | Confidential | High | Needs partner access contract |

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
  lastSmokeResult?: 'pass' | 'fail' | 'unknown';
  healthEndpoint?: string;
  requiredSecrets: string[];
  knownBlockers: string[];
  integrationContracts: string[];
  dataBoundary: string;
  privacyClassification: 'public' | 'internal' | 'restricted' | 'confidential';
  operationalRisk: 'low' | 'medium' | 'high';
  updatedAt: string;
};
```

## Integration rule

If a system has no verified live endpoint, the admin UI must display `Not connected` or `Blocked`, never `Healthy`.
