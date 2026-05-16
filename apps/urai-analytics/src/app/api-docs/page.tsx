import { PageFrame } from '@/components/marketing';

export default function ApiDocsPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">API</p><h1>Event ingestion API.</h1>
        <div className="card">
          <h3>POST /api/v1/events</h3>
          <p>Send an analytics event with an Authorization bearer API key, organizationId, workspaceId, eventId, eventName, timestamp, consent, privacyClass, and properties.</p>
          <pre>{`curl -X POST https://www.uraianalytics.com/api/v1/events \\
  -H "Authorization: Bearer urai_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"eventId":"evt_123","eventName":"page.viewed","organizationId":"org_123","workspaceId":"wrk_123","timestamp":"2026-05-11T12:00:00.000Z","consent":{"granted":true,"categories":["necessary","product_analytics"],"policyVersion":"v1"},"properties":{"route":"/app"}}'`}</pre>
        </div>
      </main>
    </PageFrame>
  );
}
