import { SpatialAdminFrame, SpatialSection, SpatialStatusCard } from '@/components/SpatialAdminFrame';

const contract = [
  ['Source system', 'LifeLoggerAI/urai-storytime'],
  ['Storytime callable', 'listStorytimeModerationCases'],
  ['Storytime callable', 'getStorytimeModerationCase'],
  ['Storytime callable', 'transitionStorytimeModerationCase'],
  ['Allowed transition', 'escalate'],
  ['Allowed transition', 'close_blocked'],
] as const;

export default function StorytimeModerationPage() {
  return (
    <SpatialAdminFrame
      eyebrow="Storytime safety operations"
      title="Storytime moderation contract"
      description="A fail-closed control-plane boundary for future Storytime moderation operations. The Storytime Firebase project and trusted cross-project caller identity are not yet certified, so this Admin surface remains Not connected and performs no remote reads or mutations."
      signals={[
        { label: 'Connection', value: 'Not connected' },
        { label: 'Release authority', value: 'Blocked' },
        { label: 'Raw story content', value: 'Unavailable' },
      ]}
    >
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SpatialStatusCard
          label="Queue"
          value="Contract only"
          detail="Storytime exposes sanitized moderation metadata only. This Admin route does not read Storytime Firestore directly."
        />
        <SpatialStatusCard
          label="Actions"
          value="Escalate / close blocked"
          detail="The Storytime contract has no approve or release transition. Flagged content stays blocked until secure content review exists."
        />
        <SpatialStatusCard
          label="Identity"
          value="Unverified"
          detail="Cross-project service identity, least privilege, staging readback, audit attribution, and rollback evidence are required before connection."
        />
      </div>

      <SpatialSection
        title="Verified source contract"
        description="These are interface names and permitted transitions defined by the current Storytime source candidate. They are not runtime connectivity evidence."
      >
        <div className="spatial-module-grid">
          {contract.map(([label, value]) => (
            <article key={`${label}:${value}`} className="spatial-module-card">
              <h3>{label}</h3>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </SpatialSection>

      <SpatialSection
        title="Activation gate"
        description="Keep this surface hard-off until the Storytime moderation candidate is merged and deployed to an isolated Storytime environment and Admin has a reviewed cross-project invocation identity."
      >
        <div className="space-y-3 text-sm text-slate-300">
          <p>Required: exact deployed Storytime SHA and callable revision readback.</p>
          <p>Required: least-privilege Admin-to-Storytime service identity with negative authorization proof.</p>
          <p>Required: sanitized-case read and transition audit receipts in isolated staging.</p>
          <p>Required: incident, retention, privacy, child-safety, monitoring, and rollback ownership.</p>
          <p>Forbidden: direct Storytime Firestore coupling, raw story content in the generic Admin console, or any approve/release action before secure content review exists.</p>
        </div>
      </SpatialSection>
    </SpatialAdminFrame>
  );
}
