import Link from 'next/link';
import { SpatialAdminFrame, SpatialSection, SpatialStatusCard } from '@/components/SpatialAdminFrame';

const sections = [
  { href: '/admin/users', label: 'Admin Users', description: 'Review owners, admins, viewers, and active access.' },
  { href: '/admin/projects', label: 'Projects', description: 'Track registered products, ownership, and status.' },
  { href: '/admin/feature-flags', label: 'Feature Flags', description: 'Inspect rollout state and operational toggles after Firebase runtime verification.' },
  { href: '/admin/jobs', label: 'Jobs', description: 'Monitor scheduled and background job definitions when job integration evidence is present.' },
  { href: '/admin/job-runs', label: 'Job Runs', description: 'Review executions, status, duration, and errors when connected data is verified.' },
  { href: '/admin/dead-letters', label: 'Dead Letters', description: 'Surface failed queue events requiring follow-up when queue integration is verified.' },
  { href: '/admin/policies', label: 'Roles & Policies', description: 'Review admin governance, role definitions, and permission intent.' },
  { href: '/admin/privacy-requests', label: 'Privacy Requests', description: 'Review minimized request metadata only; raw private payloads stay out of the generic console reader.' },
  { href: '/admin/system', label: 'System', description: 'View system config and operational health after environment and monitoring proof is recorded.' },
  { href: '/admin/settings', label: 'Settings', description: 'Inspect runtime settings and production control-plane configuration.' },
  { href: '/admin/audit', label: 'Audit Log', description: 'Review admin actions and before/after metadata.' },
];

const signals = [
  { label: 'Shell', value: 'Spatial 3D' },
  { label: 'Auth', value: 'Middleware gated' },
  { label: 'Runtime', value: 'Awaiting deploy proof' },
];

export default function AdminDashboardPage() {
  return (
    <SpatialAdminFrame
      eyebrow="URAI admin command world"
      title="Spatial operations center for the URAI stack"
      description="A protected command surface for users, projects, flags, jobs, audit trails, dead letters, roles, privacy requests, settings, and system health. Modules that depend on Firebase, jobs, analytics, communications, monitoring, or deployment evidence must remain gated until proof is recorded."
      signals={signals}
    >
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SpatialStatusCard label="Access" value="Middleware gated" detail="Admin routes are matched by middleware and API routes require a verified Firebase Admin session before privileged data is returned." />
        <SpatialStatusCard label="Data" value="Awaiting evidence" detail="Runtime data must be considered unavailable until Firebase env, deploy, seed, and smoke-test proof are recorded in the release evidence log." />
        <SpatialStatusCard label="Experience" value="Cohesive shell" detail="Navigation, background atmosphere, glass panels, and dashboard modules share the spatial design foundation without exposing service credentials in static builds." />
      </div>

      <SpatialSection
        title="Operations modules"
        description="Every module is presented as part of the same spatial command world while preserving direct operational readability and truthful connection status."
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
        Firebase and privileged admin data load only through authenticated runtime APIs after deployment. Until install, tests, deploy, DNS/SSL, monitoring, rollback, owner seed, and owner approval are recorded, this console remains production-blocked.
      </section>
    </SpatialAdminFrame>
  );
}
