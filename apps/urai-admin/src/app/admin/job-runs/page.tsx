import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function JobRunsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Execution telemetry"
      title="Job runs"
      description="Review recent execution status, timing, and outcomes from the authenticated runtime admin API."
      signalValue="Run ledger"
      collection="jobRuns"
      emptyLabel="No job runs found."
      columns={[
        { key: 'id', label: 'Run' },
        { key: 'jobId', label: 'Job' },
        { key: 'status', label: 'Status' },
        { key: 'startedAt', label: 'Started' },
        { key: 'endedAt', label: 'Ended' },
      ]}
    />
  );
}
