import Link from 'next/link';
import { CommandWorld } from '@/components/marketing/CommandWorld';

const operatorAreas = [
  {
    title: 'Access and roles',
    body: 'Review authorized operators, role assignments, and access state without exposing protected controls publicly.',
  },
  {
    title: 'Jobs and reliability',
    body: 'Inspect background work, failures, retries, and recovery paths from the authenticated operations console.',
  },
  {
    title: 'Release controls',
    body: 'Review feature flags, system configuration, deployment evidence, and rollback posture before consequential changes.',
  },
  {
    title: 'Audit history',
    body: 'Keep operational changes attributable, reviewable, and tied to the system or policy they affected.',
  },
];

const principles = [
  'Protected by role-aware access',
  'Consequential actions remain auditable',
  'Operational data stays out of public surfaces',
  'System health is separated from user-facing product claims',
];

export default function AdminEntryPage() {
  return (
    <main className="urai-shell text-white">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          URAI Admin
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex" aria-label="Admin information">
          <Link href="/security" className="hover:text-white">Security</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </nav>
        <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200">
          Operator sign in
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24" aria-labelledby="admin-title">
        <div>
          <div className="neon-pill mb-6 inline-flex rounded-full px-3 py-1 text-sm">
            Protected operations
          </div>
          <h1 id="admin-title" className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-7xl">
            One secure place to understand and operate the URAI system.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            URAI Admin is for authorized operators managing access, jobs, release controls, audit history, and system health. Public product experiences remain separate from these operational controls.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="rounded-full bg-cyan-200 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-cyan-100">
              Sign in securely
            </Link>
            <Link href="/security" className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">
              Review security
            </Link>
          </div>
        </div>

        <CommandWorld />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12" aria-labelledby="operator-areas-title">
        <div className="mb-8 max-w-2xl">
          <div className="neon-pill mb-4 inline-flex rounded-full px-3 py-1 text-sm">Operator areas</div>
          <h2 id="operator-areas-title" className="text-3xl font-semibold tracking-[-0.035em]">Controls belong behind authentication.</h2>
          <p className="mt-3 text-slate-300">The public entry explains the boundary. The authenticated console contains the operational detail.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {operatorAreas.map((area) => (
            <article key={area.title} className="world-card p-6">
              <h3 className="text-lg font-semibold">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{area.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12" aria-labelledby="admin-principles-title">
        <div className="hero-glass rounded-3xl p-8 md:p-10">
          <h2 id="admin-principles-title" className="text-2xl font-semibold tracking-tight">Operational trust principles</h2>
          <ul className="mt-6 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            {principles.map((principle) => <li key={principle}>{principle}</li>)}
          </ul>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} URAI Admin. Authorized operations only.</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/security" className="hover:text-white">Security</Link>
        </div>
      </footer>
    </main>
  );
}
