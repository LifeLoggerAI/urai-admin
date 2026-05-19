import Link from 'next/link';

const features = [
  { title: 'Feature flags', body: 'Read live flags, update protected rollout state, and capture every change in audit logs.' },
  { title: 'Audit logs', body: 'Review admin activity with actor, role, action, target, metadata, and timestamps.' },
  { title: 'Jobs and job runs', body: 'Monitor background work, execution state, failures, and operational health.' },
  { title: 'Dead letters', body: 'Surface failed messages and queue events before they become silent product risk.' },
  { title: 'Project registry', body: 'Track product modules, owners, status, and system-level accountability.' },
  { title: 'Roles and policies', body: 'Keep owner, admin, and viewer permissions visible and explicit.' },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← URAI Admin</Link>
        <div className="mt-12 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">A complete control surface for AI product operations.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            URAI Admin brings the core operational systems of a modern app into one protected, auditable console.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <section key={feature.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feature.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
