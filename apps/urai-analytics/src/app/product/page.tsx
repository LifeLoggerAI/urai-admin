import { FeatureCard, PageFrame } from '@/components/marketing';

export default function ProductPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Product</p>
        <h1>One analytics layer for behavior, intelligence, and reporting.</h1>
        <p>URAI Analytics V1 ships the foundation for event ingestion, workspace-scoped metrics, demo dashboards, reports, exports, API keys, privacy classes, and URAI-specific signal analytics.</p>
        <div className="grid section">
          <FeatureCard title="Event ingestion">Validated events with consent snapshots, privacy classes, tenant scope, and redaction.</FeatureCard>
          <FeatureCard title="Workspace dashboards">Overview, events, sessions, reports, exports, settings, and API key surfaces.</FeatureCard>
          <FeatureCard title="SaaS-ready data model">Organizations, workspaces, memberships, API keys, entitlements, audit logs, and privacy requests.</FeatureCard>
        </div>
      </main>
    </PageFrame>
  );
}
