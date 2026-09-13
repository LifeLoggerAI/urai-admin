import Link from 'next/link';
import { CommandWorld } from '@/components/marketing/CommandWorld';

const controlPlaneAreas = [
  { title: 'Systems', body: 'Inspect registered systems, their public-safe identity, ownership boundary, health contract, and current evidence state.' },
  { title: 'Releases', body: 'Keep exact release fingerprints, checks, deployment evidence, rollback posture, and environment state attached to the code they describe.' },
  { title: 'Workflows', body: 'Follow cross-system objectives without pretending every dependency is connected or healthy.' },
  { title: 'Policy', body: 'Make permission, privacy, security, spend, and governance gates visible before consequential actions execute.' },
];

const truthStates = [
  ['LIVE', 'Only when current runtime evidence supports it.'],
  ['DEGRADED', 'The system works with a defined limitation.'],
  ['BLOCKED', 'A required policy, provider, review, or dependency is unresolved.'],
  ['STALE', 'Evidence exists, but it is no longer current enough to rely on.'],
  ['NOT CONNECTED', 'The control plane has no trustworthy live source for this field.'],
  ['NO CURRENT EVIDENCE', 'The UI withholds the claim instead of fabricating a value.'],
] as const;

const operatingPrinciples = [
  'No synthetic green status',
  'Exact-head evidence stays attached to its release',
  'Private consumer data stays outside public and operator overview surfaces',
  'Consequential actions remain role-aware, permission-aware, and auditable',
];

export default function AdminEntryPage() {
  return (
    <main className="urai-shell text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-slate-950">Skip to content</a>
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">URAI Admin</Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex" aria-label="Admin information"><Link href="/security" className="hover:text-white">Security</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link></nav>
        <Link href="/login" className="min-h-11 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Operator sign in</Link>
      </header>

      <div id="main-content">
        <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-24" aria-labelledby="admin-title">
          <div>
            <div className="neon-pill mb-6 inline-flex rounded-full px-3 py-1 text-sm">URAI system-of-systems control plane</div>
            <h1 id="admin-title" className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-7xl">Operate the wheel without losing the truth.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">URAI Admin is the protected control plane for systems, releases, evidence, workflows, providers, policy, incidents, domains, cost, audit, and governance.</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">The public gate explains the boundary. Real operational state, controls, evidence, and authority remain behind authenticated role checks.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/login" className="min-h-11 rounded-full bg-cyan-200 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Open admin console</Link><Link href="/security" className="min-h-11 rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Review security boundary</Link></div>
          </div>
          <CommandWorld />
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-14" aria-labelledby="control-plane-title">
          <div className="mb-8 max-w-3xl"><div className="neon-pill mb-4 inline-flex rounded-full px-3 py-1 text-sm">Control plane</div><h2 id="control-plane-title" className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">The cockpit is organized around evidence, not spectacle.</h2><p className="mt-4 text-slate-300">Every area answers a different operational question while preserving the system boundary that owns the underlying truth.</p></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{controlPlaneAreas.map((area) => (<article key={area.title} className="world-card p-6"><h3 className="text-lg font-semibold">{area.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{area.body}</p></article>))}</div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-14" aria-labelledby="truth-state-title">
          <div className="hero-glass rounded-3xl p-7 md:p-10"><div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]"><div><div className="neon-pill mb-4 inline-flex rounded-full px-3 py-1 text-sm">Truth states</div><h2 id="truth-state-title" className="text-3xl font-semibold tracking-[-0.035em]">Missing data is a state, not an invitation to invent a metric.</h2><p className="mt-4 text-sm leading-6 text-slate-300">When a provider, registry, release, or evidence source is unavailable, Admin names the gap and protects the decision boundary.</p></div><dl className="grid gap-3 sm:grid-cols-2">{truthStates.map(([state, meaning]) => (<div key={state} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"><dt className="text-xs font-bold tracking-[0.12em] text-cyan-100">{state}</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{meaning}</dd></div>))}</dl></div></div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-14" aria-labelledby="admin-principles-title"><div className="border-t border-white/10 pt-10"><h2 id="admin-principles-title" className="text-2xl font-semibold tracking-tight">Operational trust principles</h2><ul className="mt-6 grid gap-3 text-sm text-slate-200 md:grid-cols-2">{operatingPrinciples.map((principle) => (<li key={principle} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">{principle}</li>))}</ul></div></section>
      </div>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between"><div>© {new Date().getFullYear()} URAI Admin. Authorized operations only.</div><div className="flex gap-4"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/security" className="hover:text-white">Security</Link></div></footer>
    </main>
  );
}
