import { PageFrame } from '@/components/marketing';

export default function ApiDocsPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">API</p><h1>Event ingestion API.</h1>
        <div className="card">
          <h3>POST /api/v1/events</h3>
          <p>This legacy endpoint is unavailable for event storage. Valid event submissions return HTTP 503 while the approved integration is prepared. Client consent fields do not authorize storage.</p>
          <p>Contact support@urailabs.com for the current integration and its authorized data scope before sending customer or private data.</p>
        </div>
      </main>
    </PageFrame>
  );
}

