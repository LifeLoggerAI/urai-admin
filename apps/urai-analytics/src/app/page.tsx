import Link from 'next/link';
import { FeatureCard, PageFrame } from '@/components/marketing';

export default function HomePage() {
  return (
    <PageFrame>
      <main className="page hero">
        <section>
          <p className="eyebrow">Privacy-aware analytics for passive intelligence systems</p>
          <h1>Analytics built for URAI, sold as a SaaS.</h1>
          <p>URAI Analytics unifies product events, passive intelligence signals, AI insight usage, reports, exports, and enterprise controls in one command center.</p>
          <div className="ctas"><Link className="btn primary" href="/app">Open dashboard</Link><Link className="btn" href="/demo">View demo</Link></div>
        </section>
        <section className="card">
          <p className="eyebrow">Live workspace snapshot</p>
          <div className="grid two"><div><p>Events</p><div className="metric">18.4K</div></div><div><p>Active users</p><div className="metric">1,248</div></div></div>
          <p>Track behavior, mood/cognitive signals, ingestion health, report generation, exports, and AI insight adoption.</p>
        </section>
      </main>
      <section className="page section grid">
        <FeatureCard title="Core analytics">Events, sessions, routes, users, retention-ready metrics, exports, and workspace usage.</FeatureCard>
        <FeatureCard title="URAI-specific intelligence">Mood, cognitive load, passive-signal, narrator insight, ritual, memory map, and spatial analytics taxonomy.</FeatureCard>
        <FeatureCard title="Enterprise foundation">Tenant isolation, API keys, privacy classes, retention classes, reports, audit logs, and billing-ready entitlements.</FeatureCard>
      </section>
    </PageFrame>
  );
}
