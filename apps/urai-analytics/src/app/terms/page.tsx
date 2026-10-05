import { PageFrame } from '@/components/marketing';

export default function TermsPage() {
  return (
    <PageFrame>
      <main id="main-content" className="page section">
        <p className="eyebrow">Terms</p>
        <h1>Public-site and early-access terms.</h1>
        <div className="grid section">
          <section className="card"><h2>Informational use</h2><p>This public site describes URAI Analytics and its development boundary. Product availability, provider connectivity, production deployment, pricing, and support commitments require separate current evidence or agreement.</p></section>
          <section className="card"><h2>Authorized access</h2><p>Non-public dashboards, credentials, customer data, APIs, and operational systems are for authorized users only. Do not attempt to bypass authentication, authorization, tenant isolation, rate limits, or other safeguards.</p></section>
          <section className="card"><h2>No unsupported reliance</h2><p>Sample metrics and demo records are interface fixtures, not production telemetry. Public documentation does not replace a signed commercial agreement, data-processing agreement, or other applicable legal terms.</p></section>
        </div>
      </main>
    </PageFrame>
  );
}
