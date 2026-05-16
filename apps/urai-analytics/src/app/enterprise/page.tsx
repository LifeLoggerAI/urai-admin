import { FeatureCard, PageFrame } from '@/components/marketing';

export default function EnterprisePage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Enterprise</p>
        <h1>Enterprise analytics for privacy-sensitive AI and passive-data systems.</h1>
        <p>URAI Analytics Enterprise adds tenant isolation, admin roles, audit logs, compliance exports, retention policies, white-label reporting, and customer-success dashboards.</p>
        <div className="grid section">
          <FeatureCard title="RBAC and audit logs">Owner, admin, analyst, developer, viewer, billing, and internal roles with immutable admin action trails.</FeatureCard>
          <FeatureCard title="Privacy operations">Export/delete workflows, retention classes, privacy classes, and sensitive-signal controls for health-adjacent intelligence.</FeatureCard>
          <FeatureCard title="White-label readiness">Partner workspaces, branded reports, enterprise exports, and contract-level overrides.</FeatureCard>
        </div>
      </main>
    </PageFrame>
  );
}
