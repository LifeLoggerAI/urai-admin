import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <article className="mt-12 space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Privacy</h1>
            <p className="mt-4 text-slate-300">
              URAI Admin is built to minimize exposure of sensitive operational data while giving authorized teams the visibility they need to run production systems.
            </p>
          </div>
          <section>
            <h2 className="text-2xl font-semibold">Operational metadata</h2>
            <p className="mt-3 leading-7 text-slate-300">
              The console is designed around operational metadata: admin users, roles, feature flags, audit events, jobs, job runs, dead letters, project registry records, and system configuration. Customer deployments should configure data collection and retention to match their own policies.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Protected access</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Admin routes are protected by session cookies, role checks, active-user verification, and server-side Firebase Admin SDK operations. Sensitive actions should be routed through audited admin APIs rather than direct client writes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">External deployments</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Teams using URAI Admin as a standalone product are responsible for configuring their Firebase project, authorized domains, organization access, retention windows, integrations, and compliance requirements.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Early access note</h2>
            <p className="mt-3 leading-7 text-slate-300">
              This page provides product-level privacy guidance for early access. Final legal terms should be reviewed before offering URAI Admin broadly to external customers.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
