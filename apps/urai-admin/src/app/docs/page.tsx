import Link from 'next/link';

const sections = [
  { title: 'Getting started', body: 'Set up Firebase, configure session cookies, bootstrap the first owner, and deploy the admin console.' },
  { title: 'Security model', body: 'Understand role checks, active admin documents, server-side writes, and deny-by-default rules.' },
  { title: 'Admin modules', body: 'Use users, projects, feature flags, jobs, job runs, dead letters, system config, and audit logs.' },
  { title: 'Standalone mode', body: 'Prepare URAI Admin for organizations, invites, billing, integrations, and external customers.' },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <div className="mt-12 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">Documentation</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Product and implementation notes for operating URAI Admin as an internal console or standalone admin OS.
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
        <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300">
          Replace this placeholder with full setup guides, API references, deployment instructions, and integration docs before broad release.
        </div>
      </div>
    </main>
  );
}
