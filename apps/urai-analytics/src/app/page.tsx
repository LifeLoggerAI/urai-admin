import Link from 'next/link';
import { FeatureCard, PageFrame } from '@/components/marketing';

export default function HomePage() {
  return (
    <PageFrame>
      <main id="main-content" className="page hero">
        <section>
          <p className="eyebrow">Privacy-aware analytics for passive intelligence systems</p>
          <h1>Analytics built for URAI, designed for governed deployment.</h1>
          <p>URAI Analytics unifies product events, passive intelligence signals, AI insight usage, reports, exports, and enterprise controls in one command center.</p>
          <div className="ctas"><Link className="btn primary" href="/demo">View demo</Link><Link className="btn" href="/docs">Read docs</Link></div>
        </section>
        <section className="card" aria-labelledby="fixture-snapshot-title">
          <p className="eyebrow">Interface fixture</p>
          <h2 id="fixture-snapshot-title" className="fixture-heading">Sample workspace snapshot</h2>
          <p><strong>Demo data — not production telemetry.</strong> These values are static interface fixtures and do not represent live users or live product activity.</p>
          <div className="grid two"><div><p>Sample events</p><div className="metric">18.4K</div></div><div><p>Sample active users</p><div className="metric">1,248</div></div></div>
        </section>
      </main>
      <section className="page section grid" aria-label="Analytics capabilities">
        <FeatureCard title="Core analytics">Events, sessions, routes, users, retention-ready metrics, exports, and workspace usage.</FeatureCard>
        <FeatureCard title="URAI-specific intelligence">Mood, cognitive load, passive-signal, narrator insight, ritual, memory map, and spatial analytics taxonomy.</FeatureCard>
        <FeatureCard title="Enterprise foundation">Tenant isolation, API keys, privacy classes, retention classes, reports, audit logs, and billing-ready entitlements.</FeatureCard>
      </section>
    </PageFrame>
  );
}
