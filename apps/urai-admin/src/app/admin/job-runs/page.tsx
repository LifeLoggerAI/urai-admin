import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function JobRunsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Execution telemetry"
      title="Terminal job history"
      description="Review completed, failed, dead, and cancelled records from the canonical URAI Jobs ledger. This is not a separate jobRuns datastore."
      signalValue="Terminal ledger"
      collection="jobs"
      status="terminal"
      emptyLabel="No terminal jobs found."
      columns={[
        { key: 'id', label: 'Job' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'retryCount', label: 'Retries' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
    />
  );
}
