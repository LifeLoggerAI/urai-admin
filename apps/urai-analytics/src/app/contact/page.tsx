import { PageFrame } from '@/components/marketing';

export default function ContactPage() {
  return (
    <PageFrame>
      <main id="main-content" className="page section">
        <p className="eyebrow">Contact</p><h1>Talk to URAI Analytics.</h1>
        <div className="grid two section">
          <section className="card"><h2>Product and support</h2><p>Email <a href="mailto:support@urailabs.com">support@urailabs.com</a> for access, product, deployment, and general support questions.</p></section>
          <section className="card"><h2>Security</h2><p>Email <a href="mailto:security@urailabs.com">security@urailabs.com</a> for vulnerabilities or sensitive security reports. Do not send secrets or credentials by email.</p></section>
        </div>
      </main>
    </PageFrame>
  );
}
