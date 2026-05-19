import Link from 'next/link';
import { SpatialAdminFrame, SpatialSection, SpatialStatusCard } from '@/components/SpatialAdminFrame';

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

const signals = [
  { label: 'Shell', value: 'Spatial 3D' },
  { label: 'Auth', value: 'Protected' },
  { label: 'Runtime', value: 'Live APIs' },
];

export default function AdminDashboardPage() {
  return (
    <SpatialAdminFrame
      eyebrow="URAI admin command world"
      title="Spatial operations center for the URAI stack"
      description="A premium, protected command surface for users, projects, flags, jobs, audit trails, dead letters, and live system health. The visual layer now shares one cohesive moonlit 3D admin language across the app shell."
      signals={signals}
    >
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SpatialStatusCard label="Access" value="Authenticated" detail="Routes remain behind the existing user session guard and redirect safely to login when unavailable." />
        <SpatialStatusCard label="Data" value="Runtime loaded" detail="Firestore metrics and admin records continue loading through authenticated deployment APIs." />
        <SpatialStatusCard label="Experience" value="Cohesive shell" detail="Navigation, background atmosphere, glass panels, and dashboard modules now share the spatial design foundation." />
      </div>

      <SpatialSection
        title="Operations modules"
        description="Every module is presented as part of the same spatial command world while preserving direct operational readability."
      >
        <div className="spatial-module-grid">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="spatial-module-card">
              <h3>{section.label}</h3>
              <p>{section.description}</p>
            </Link>
          ))}
        </div>
      </SpatialSection>

      <section className="spatial-alert-card mt-8 text-sm">
        Live Firebase and privileged admin data still load only through authenticated runtime APIs after deployment. Static builds render this production-safe shell without exposing service credentials.
      </section>
    </SpatialAdminFrame>
  );
}
