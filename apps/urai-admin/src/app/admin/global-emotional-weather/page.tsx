import { SpatialAdminFrame, SpatialSection, SpatialStatusCard } from '@/components/SpatialAdminFrame';
import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function GlobalEmotionalWeatherAdminPage() {
  return (
    <SpatialAdminFrame
      eyebrow="Public-interest population operations"
      title="Global Emotional Weather operations"
      description="Monitor aggregate pipeline health, privacy suppression, freshness, evidence-adapter health, and humanitarian review state. This surface has no route to individual contributors or private-life source data."
      signals={[
        { label: 'Boundary', value: 'Aggregate only' },
        { label: 'Contribution data', value: 'Server-only' },
        { label: 'Release authority', value: 'Externally gated' },
      ]}
    >
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SpatialStatusCard
          label="Privacy"
          value="Fail closed"
          detail="Sparse, low-confidence, exhausted-budget, stale, or changed contribution sets remain suppressed rather than exposed."
        />
        <SpatialStatusCard
          label="Humanitarian"
          value="Human review"
          detail="Attention records are review artifacts, not emergency declarations or predictions."
        />
        <SpatialStatusCard
          label="Individual access"
          value="None"
          detail="Contributor records, pseudonyms, revocation keys, private memories, transcripts, and raw signals are not readable from Admin."
        />
      </div>

      <SpatialSection
        title="Population pipeline"
        description="Aggregate operational metadata only: region, release/suppression state, freshness, privacy-budget health, adapter health, queue health, and suspicious-rate state."
      >
        <AdminCollectionTable
          collection="populationWeatherOps"
          emptyLabel="No aggregate population-weather operational records are connected."
          columns={[
            { key: 'region', label: 'Region' },
            { key: 'windowStart', label: 'Window' },
            { key: 'releaseStatus', label: 'Release' },
            { key: 'safeContributorBand', label: 'Safe band' },
            { key: 'freshness', label: 'Freshness' },
            { key: 'suppressionReason', label: 'Suppression' },
            { key: 'privacyBudgetState', label: 'Privacy budget' },
            { key: 'adapterHealth', label: 'Adapters' },
            { key: 'queueHealth', label: 'Queue' },
            { key: 'suspiciousRateState', label: 'Integrity' },
            { key: 'updatedAt', label: 'Updated' },
          ]}
        />
      </SpatialSection>

      <SpatialSection
        title="Humanitarian review queue"
        description="Aggregate review metadata only. Review status never exposes contributor identity or raw personal signals."
      >
        <AdminCollectionTable
          collection="humanitarianAttentionReviews"
          emptyLabel="No humanitarian-attention review records are connected."
          columns={[
            { key: 'region', label: 'Region' },
            { key: 'attentionStatus', label: 'Signal' },
            { key: 'reviewStatus', label: 'Review' },
            { key: 'evidenceCategoryCount', label: 'Evidence classes' },
            { key: 'confidenceBand', label: 'Confidence' },
            { key: 'freshness', label: 'Freshness' },
            { key: 'methodVersion', label: 'Method' },
            { key: 'limitationsSummary', label: 'Limitations' },
            { key: 'updatedAt', label: 'Updated' },
          ]}
        />
      </SpatialSection>
    </SpatialAdminFrame>
  );
}
