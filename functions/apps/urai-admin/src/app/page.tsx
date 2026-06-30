import Link from 'next/link';
import { CommandWorld } from '@/components/marketing/CommandWorld';

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

const worlds = [
  { title: 'Control Room', body: 'A live operational surface for auth, roles, jobs, flags, audit trails, and release evidence.' },
  { title: 'System Mesh', body: 'See URAI Admin, Analytics, Communications, Privacy, Studio, Spatial, Asset Factory, and B2B as one map.' },
  { title: 'Risk Weather', body: 'Surface blockers, smoke results, degraded systems, dead letters, and rollback posture before they become incidents.' },
];

export default function MarketingHomePage() {
  return (
    <main className="urai-shell text-white">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
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

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
        <div>
          <div className="neon-pill mb-6 inline-flex rounded-full px-3 py-1 text-sm">
            Standalone command world for AI-native operations
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Your AI company as a living 3D control world.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            URAI Admin turns users, roles, jobs, audit trails, launch evidence, privacy controls, and system health into one interactive command layer for modern AI products.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="rounded-full bg-cyan-300 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-200">
              Enter command world
            </Link>
            <Link href="/features" className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">
              Explore systems
            </Link>
          </div>
        </div>

        <CommandWorld />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {worlds.map((world) => (
            <div key={world.title} className="world-card p-6">
              <h2 className="text-xl font-semibold">{world.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{world.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="world-card p-5 text-sm text-slate-200">
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Everything your AI product needs after launch.</h2>
          <p className="mt-3 text-slate-300">URAI Admin is built for the operational layer: visibility, controls, auditability, and trust.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {modules.map((module) => (
            <div key={module.title} className="world-card p-5">
              <h3 className="font-semibold">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{module.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="hero-glass rounded-3xl p-8 md:p-12">
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

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
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
