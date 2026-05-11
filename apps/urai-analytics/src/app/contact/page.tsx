import { PageFrame } from '@/components/marketing';

export default function ContactPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Contact</p><h1>Talk to URAI Analytics.</h1>
        <div className="grid two section">
          <div className="card"><h3>Sales</h3><p>Use this page for demo requests, enterprise inquiries, and white-label analytics partnerships.</p></div>
          <div className="card"><h3>Support</h3><p>Use this page for product support, API onboarding, security questions, and billing help.</p></div>
        </div>
      </main>
    </PageFrame>
  );
}
