import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <article className="mt-12 space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Terms</h1>
            <p className="mt-4 text-slate-300">
              URAI Admin is an early-access operational console for authorized teams running AI products, Firebase apps, and internal systems.
            </p>
          </div>
          <section>
            <h2 className="text-2xl font-semibold">Authorized use</h2>
            <p className="mt-3 leading-7 text-slate-300">
              The protected console is intended for approved organization members only. Teams are responsible for controlling access, assigning roles, and removing inactive administrators.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Operational responsibility</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Customers and internal teams are responsible for configuring feature flags, jobs, audit log retention, integrations, incident workflows, and production data policies appropriate for their own products.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Security expectations</h2>
            <p className="mt-3 leading-7 text-slate-300">
              URAI Admin is designed for role-aware access and audited server-side mutations. Operators should avoid sharing credentials, bypassing admin APIs, or granting broad access to non-operational users.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Early access note</h2>
            <p className="mt-3 leading-7 text-slate-300">
              These terms are product-level guidance for early access. Final commercial and legal terms should be reviewed before broad external release.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
