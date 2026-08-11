# URAI Analytics V1

URAI Analytics is the standalone analytics product and internal URAI command center for product behavior, passive intelligence systems, AI insight usage, reports, exports, and enterprise-ready analytics.

## Package layout

```text
apps/urai-analytics/        Next.js product, website, dashboard, and API routes
packages/analytics-core/    Shared schemas, privacy classes, consent helpers, redaction, tenant checks, and metrics
functions/src/uraiAnalyticsV1.ts Scheduled Firestore aggregation job
```

## Local development

```bash
pnpm install
pnpm --dir packages/analytics-core test
pnpm --dir apps/urai-analytics test
pnpm --dir apps/urai-analytics dev
```

The app runs on port `3010` by default.

## Required environment variables

```bash
FIREBASE_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=/path/to/approved-adc.json
URAI_ANALYTICS_API_KEY_SALT=
URAI_ANALYTICS_IP_HASH_SALT=
URAI_ANALYTICS_INGEST_RATE_LIMIT_PER_MINUTE=600
```

Firebase Admin uses Application Default Credentials only. In managed Google runtimes, use the runtime service identity and omit `GOOGLE_APPLICATION_CREDENTIALS`. For local development, point ADC at an approved external credential file or use the emulator. Do not place service-account JSON or private-key values in repository environment files.

## V1 ingestion endpoint

`POST /api/v1/events`

Headers:

```text
Authorization: Bearer <workspace-api-key>
Content-Type: application/json
```

Minimum body:

```json
{
  "eventId": "evt_123",
  "eventName": "page.viewed",
  "organizationId": "org_123",
  "workspaceId": "wrk_123",
  "timestamp": "2026-05-11T12:00:00.000Z",
  "consent": {
    "granted": true,
    "categories": ["necessary", "product_analytics"],
    "policyVersion": "v1"
  },
  "properties": {
    "route": "/app"
  }
}
```

## Firestore collections

Top-level:

- `organizations`
- `analytics_events_raw_YYYY-MM-DD`
- `analyticsDailyWorkspaceMetrics`
- `analyticsAuditLogs`
- `analyticsJobRuns`

Nested:

- `organizations/{orgId}/memberships/{userId}`
- `organizations/{orgId}/workspaces/{workspaceId}`
- `organizations/{orgId}/workspaces/{workspaceId}/apiKeys/{apiKeyId}`
- `organizations/{orgId}/workspaces/{workspaceId}/metricsDaily/{date}`
- `organizations/{orgId}/workspaces/{workspaceId}/reports/{reportId}`
- `organizations/{orgId}/workspaces/{workspaceId}/exports/{exportId}`
- `organizations/{orgId}/workspaces/{workspaceId}/privacyRequests/{requestId}`
- `organizations/{orgId}/workspaces/{workspaceId}/auditLogs/{logId}`
- `organizations/{orgId}/subscriptions/{subscriptionId}`
- `organizations/{orgId}/featureEntitlements/{entitlementId}`

## V1 acceptance checklist

- Core schemas validate events, organizations, workspaces, memberships, API keys, metrics, reports, and entitlements.
- Ingestion route enforces API key auth, tenant scope, consent, rate limits, redaction, and idempotent writes.
- Scheduled aggregation produces daily workspace metrics.
- Dashboard pages render overview, events, sessions, reports, exports, settings, API keys, and demo data.
- Public routes exist for home, product, pricing, enterprise, demo, docs, API docs, security, privacy, terms, contact, login, and signup.
- Firestore rules and indexes are reviewed, merged into the root Firebase deployment config, and tested in emulator before production.

## Launch blockers before production

- Wire Firebase Auth signup/login to real user, organization, workspace, membership, entitlement, and API key creation.
- Replace privacy/terms placeholders with counsel-reviewed legal copy.
- Merge `firestore.rules.v1` and `firestore.indexes.v1.json` into root deployment artifacts after emulator tests pass.
- Add persistent distributed rate limiting before high-volume external API usage.
- Add billing provider webhooks and entitlement enforcement for paid tiers.
- Verify `www.uraianalytics.com` DNS, SSL, hosting target, and production smoke tests.
