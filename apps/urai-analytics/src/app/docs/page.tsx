import { PageFrame } from '@/components/marketing';

export default function DocsPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Docs</p><h1>URAI Analytics V1 documentation.</h1>
        <div className="grid two section">
          <div className="card"><h3>Getting started</h3><p>Create an organization, create a workspace, generate an API key, then POST events to /api/v1/events with consent and tenant scope.</p></div>
          <div className="card"><h3>Event taxonomy</h3><p>Use normalized dot-case names such as page.viewed, session.started, insight.viewed, and urai.mood_state.updated.</p></div>
          <div className="card"><h3>Privacy classes</h3><p>Classify events as customer, personal, sensitive, health_adjacent, passive_signal, or derived_ai_insight so retention and reporting stay privacy-aware.</p></div>
          <div className="card"><h3>Reports and exports</h3><p>V1 supports CSV/export foundations. V2 adds scheduled PDFs, AI summaries, and enterprise report automation.</p></div>
        </div>
      </main>
    </PageFrame>
  );
}
