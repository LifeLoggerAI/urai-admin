import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <article className="mt-12 space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Privacy</h1>
            <p className="mt-4 text-slate-300">This placeholder privacy page should be reviewed by counsel before public launch.</p>
          </div>
          <section>
            <h2 className="text-2xl font-semibold">Operational data</h2>
            <p className="mt-3 leading-7 text-slate-300">
              URAI Admin is designed to display operational metadata such as admin users, audit events, feature flags, jobs, job runs, and system configuration.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Access controls</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Protected console access is intended for authorized organization members only. Sensitive writes should be performed through server-side admin APIs with audit logging.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Launch note</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Replace this page with final privacy language before opening URAI Admin to external customers.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
