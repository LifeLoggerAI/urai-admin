import { PageFrame } from '@/components/marketing';

export default function DocsPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Docs</p><h1>URAI Analytics V1 documentation.</h1>
        <div className="grid two section">
          <div className="card"><h3>Getting started</h3><p>Event storage through the legacy /api/v1/events endpoint is currently unavailable. Contact support@urailabs.com for the approved integration before sending data.</p></div>
          <div className="card"><h3>Event taxonomy</h3><p>Use normalized dot-case names such as page.viewed, session.started, insight.viewed, and urai.mood_state.updated.</p></div>
          <div className="card"><h3>Privacy and consent</h3><p>Private, health-related and passive signals require current server-side authority. Client labels and consent fields alone cannot authorize their retention.</p></div>
          <div className="card"><h3>Reports and exports</h3><p>V1 supports CSV/export foundations. V2 adds scheduled PDFs, AI summaries, and enterprise report automation.</p></div>
        </div>
      </main>
    </PageFrame>
  );
}

