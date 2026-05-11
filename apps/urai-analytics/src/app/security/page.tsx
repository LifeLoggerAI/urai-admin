import { FeatureCard, PageFrame } from '@/components/marketing';

export default function SecurityPage() {
  return (
    <PageFrame>
      <main className="page section">
        <p className="eyebrow">Security and privacy</p><h1>Built for sensitive analytics from day one.</h1>
        <div className="grid section">
          <FeatureCard title="Tenant isolation">Every event is scoped to organizationId and workspaceId before storage and aggregation.</FeatureCard>
          <FeatureCard title="Redaction">Sensitive keys are redacted before persistence, including credentials, contact fields, precise location, and biometric identifiers.</FeatureCard>
          <FeatureCard title="Retention classes">Privacy classes map to retention classes so passive and derived AI signals can expire faster than standard analytics data.</FeatureCard>
        </div>
      </main>
    </PageFrame>
  );
}
