import Link from 'next/link';

const features = [
  'Admin users and role visibility',
  'Feature flag control with audit trails',
  'Jobs, job runs, and dead letter monitoring',
  'System config and project registry visibility',
  'Firestore-first security and server-side admin APIs',
  'Built for AI products, Firebase apps, and lean ops teams',
];

const modules = [
  { title: 'Feature Flags', body: 'Roll out capabilities safely with protected mutation routes and audit metadata.' },
  { title: 'Audit Logs', body: 'Track who changed what, when, and against which operational target.' },
  { title: 'Job Monitoring', body: 'Inspect jobs, job runs, failed executions, and dead letters from one console.' },
  { title: 'RBAC', body: 'Separate owners, admins, and viewers with active-user checks and role-aware access.' },
];

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          URAI Admin
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/features" className="hover:text-white">Features</Link>
          <Link href="/security" className="hover:text-white">Security</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>
        <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200">
          Sign in
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            Standalone admin OS for AI-native products
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            The secure operations console for modern AI apps.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            URAI Admin gives builders a protected command center for users, feature flags, jobs, audit logs, system config, and operational risk.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="rounded-full bg-cyan-300 px-6 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-cyan-200">
              Open admin console
            </Link>
            <Link href="/features" className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">
              View features
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/40">
          <div className="rounded-2xl bg-slate-900 p-5">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-sm text-slate-400">Operational health</div>
                <div className="text-2xl font-semibold">Command Center</div>
              </div>
              <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Protected</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Active flags', 'Recent job runs', 'Dead letters', 'Audit events'].map((label, index) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs text-slate-400">{label}</div>
                  <div className="mt-2 text-3xl font-semibold">{[12, 184, 0, 47][index]}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs text-slate-300">
              audit.featureFlags.set → owner@uraiadmin.com → rollout: 100%
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-200">
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Everything your AI product needs after launch.</h2>
          <p className="mt-3 text-slate-300">URAI Admin is built for the operational layer: visibility, controls, auditability, and trust.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {modules.map((module) => (
            <div key={module.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="font-semibold">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{module.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-8 md:p-12">
          <h2 className="text-3xl font-bold tracking-tight">Launch with a control surface from day one.</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Start with single-org mode for your product, then grow into teams, tenants, integrations, billing, and AI-assisted operations.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200">
              Request access
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} URAI Admin. Secure operations for AI products.</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/security" className="hover:text-white">Security</Link>
        </div>
      </footer>
    </main>
  );
}
