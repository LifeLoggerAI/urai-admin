import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function JobsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Automation control"
      title="Jobs"
      description="Monitor the canonical URAI Jobs ledger through a minimized, authenticated operational view."
      signalValue="Runtime ledger"
      collection="jobs"
      emptyLabel="No jobs found."
      columns={[
        { key: 'id', label: 'Job ID' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'retryCount', label: 'Retries' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
    />
  );
}
