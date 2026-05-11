import { PageFrame } from '@/components/marketing';

const tiers = [
  ['Free', '$0', 'Demo analytics, 7-day retention, 10K events/month'],
  ['Pro', '$29/mo', 'Core dashboards, CSV exports, 100K events/month'],
  ['Founder', '$99/mo', 'Investor reports, AI summaries, 500K events/month'],
  ['Team', '$299/mo', 'Team workspaces, API keys, scheduled reports'],
  ['Business', '$799+/mo', 'Advanced reports, admin controls, support'],
  ['Enterprise', 'Contract', 'RBAC, audit logs, compliance exports, white-label options']
];

export default function PricingPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Pricing</p>
        <h1>Start with product analytics. Scale into intelligence analytics.</h1>
        <div className="grid section">
          {tiers.map(([name, price, copy]) => <div className="card" key={name}><h3>{name}</h3><div className="metric">{price}</div><p>{copy}</p><a className="btn primary" href="/contact">Choose {name}</a></div>)}
        </div>
      </main>
    </PageFrame>
  );
}
