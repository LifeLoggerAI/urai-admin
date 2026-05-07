import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <article className="mt-12 space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Terms</h1>
            <p className="mt-4 text-slate-300">This placeholder terms page should be reviewed by counsel before public launch.</p>
          </div>
          <section>
            <h2 className="text-2xl font-semibold">Use of URAI Admin</h2>
            <p className="mt-3 leading-7 text-slate-300">
              URAI Admin is intended as a protected operational console for authorized product teams and organization members.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Customer responsibility</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Customers are responsible for configuring roles, access, data retention, integrations, and operational policies appropriate for their products.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Launch note</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Replace this page with final terms before offering URAI Admin to external customers.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
