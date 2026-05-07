import Link from 'next/link';
import { firestore } from '@/lib/firebase/admin';

async function getCount(collectionName: string) {
  const snapshot = await firestore.collection(collectionName).limit(500).get();
  return snapshot.size;
}

async function getDashboardMetrics() {
  const [adminUsers, jobs, jobRuns, deadLetters, featureFlags, auditLogs, projects] = await Promise.all([
    getCount('adminUsers'),
    getCount('jobs'),
    getCount('jobRuns'),
    getCount('deadLetters'),
    getCount('featureFlags'),
    getCount('auditLogs'),
    getCount('projectRegistry'),
  ]);

  return { adminUsers, jobs, jobRuns, deadLetters, featureFlags, auditLogs, projects };
}

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

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">URAI Admin Command Center</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Protected operational control surface for users, projects, flags, jobs, audit logs, and system health.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Admin users" value={metrics.adminUsers} />
        <MetricCard label="Projects" value={metrics.projects} />
        <MetricCard label="Feature flags" value={metrics.featureFlags} />
        <MetricCard label="Jobs" value={metrics.jobs} />
        <MetricCard label="Job runs" value={metrics.jobRuns} />
        <MetricCard label="Dead letters" value={metrics.deadLetters} />
        <MetricCard label="Audit events" value={metrics.auditLogs} />
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

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}
