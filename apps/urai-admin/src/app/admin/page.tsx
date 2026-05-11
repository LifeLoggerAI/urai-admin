import Link from 'next/link';

const sections = [
  { href: '/admin/users', label: 'Admin Users', description: 'Review owners, admins, viewers, and active access.' },
  { href: '/admin/projects', label: 'Projects', description: 'Track registered products, ownership, and status.' },
  { href: '/admin/feature-flags', label: 'Feature Flags', description: 'Inspect live rollout state and operational toggles.' },
  { href: '/admin/jobs', label: 'Jobs', description: 'Monitor scheduled and background job definitions.' },
  { href: '/admin/job-runs', label: 'Job Runs', description: 'Review recent executions, status, duration, and errors.' },
  { href: '/admin/dead-letters', label: 'Dead Letters', description: 'Surface failed queue events requiring follow-up.' },
  { href: '/admin/system', label: 'System', description: 'View live system config and operational health.' },
  { href: '/admin/audit', label: 'Audit Log', description: 'Review admin actions and before/after metadata.' },
];

export default function AdminDashboardPage() {
  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">URAI Admin Command Center</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Protected operational control surface for users, projects, flags, jobs, audit logs, and system health.
        </p>
      </div>

      <section className="rounded-2xl border bg-muted/20 p-5 text-sm text-muted-foreground">
        Live Firestore metrics load through authenticated runtime APIs after deployment. Static build renders this safe shell without opening Firebase credentials.
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Operations modules</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="rounded-2xl border p-5 transition hover:bg-muted/50">
              <h3 className="font-semibold">{section.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
