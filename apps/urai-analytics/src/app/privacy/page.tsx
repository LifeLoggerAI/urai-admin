import { PageFrame } from '@/components/marketing';

export default function PrivacyPage() {
  return (
    <PageFrame>
      <main id="main-content" className="page section">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy notice for the URAI Analytics public site.</h1>
        <div className="grid section">
          <section className="card"><h2>Public-site data</h2><p>The public informational site is designed to minimize collection. Do not send passwords, API keys, raw memories, health records, precise location, private communications, or other sensitive content through public contact channels.</p></section>
          <section className="card"><h2>Analytics product boundary</h2><p>URAI Analytics source includes consent-aware schemas, sensitive-key redaction, organization/workspace scoping, retention classes, and export/delete contracts. Those source controls do not by themselves prove that every provider, deployment, or customer environment is live or independently certified.</p></section>
          <section className="card"><h2>Privacy requests</h2><p>For privacy, access, correction, export, deletion, or consent questions, email <a href="mailto:privacy@urailabs.com">privacy@urailabs.com</a>. For general support, email <a href="mailto:support@urailabs.com">support@urailabs.com</a>.</p></section>
        </div>
      </main>
    </PageFrame>
  );
}
