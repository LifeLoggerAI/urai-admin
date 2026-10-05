import Link from 'next/link';

const sections = [
  { title: 'Access boundary', body: 'URAI Admin separates its public informational gate from authenticated, role-aware operational surfaces.' },
  { title: 'Security model', body: 'Protected operations require authenticated sessions, active administrator records, role checks, and audited server-side mutations.' },
  { title: 'Operational truth', body: 'Release, provider, workflow, and system status must stay attached to current evidence. Missing evidence is shown as missing rather than inferred.' },
  { title: 'Privacy boundary', body: 'Private consumer data and sensitive operational details remain outside the public informational surface.' },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <div className="mt-12 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">Public documentation</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            A public-safe overview of how URAI Admin separates informational access from protected operations.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-xl font-semibold">Need implementation help?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Internal deployment procedures, environment details, repository paths, and protected API inventories are intentionally not published here.
            For authorized support, email <a className="underline underline-offset-4 hover:text-white" href="mailto:support@urailabs.com">support@urailabs.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
