import Link from 'next/link';

const sections = [
  { title: 'Getting started', body: 'Connect Firebase, configure environment variables, bootstrap the first owner, and verify uraiadmin.com with the green-ship script.' },
  { title: 'Security model', body: 'Admin access uses session cookies, active admin records, role-aware APIs, deny-by-default rules, and audited server-side mutations.' },
  { title: 'Admin modules', body: 'Run the product with users, projects, feature flags, jobs, job runs, dead letters, system config, roles, and audit logs.' },
  { title: 'Standalone mode', body: 'Start in single-org mode, then expand toward organizations, invites, billing, integrations, and external customer workspaces.' },
];

const launchChecks = [
  'Run scripts/clean-functions-legacy.sh before local gates if stale Functions files exist.',
  'Run scripts/green-ship.sh before deploy.',
  'Verify Firebase Auth authorized domains include uraiadmin.com and www.uraiadmin.com.',
  'Verify /api/admin/* returns 401 when unauthenticated.',
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
        <div className="mt-10 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-xl font-semibold">Launch checklist</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {launchChecks.map((check) => <li key={check}>• {check}</li>)}
          </ul>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6 text-sm leading-6 text-slate-300">
          For deeper setup details, use the repository readiness guide at docs/URAI_ADMIN_STANDALONE_READINESS.md. It covers public routes, protected routes, environment variables, auth flow, admin mutation standards, and the multi-tenant path.
        </div>
      </div>
    </main>
  );
}
