import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function JobsPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Automation control"
      title="Jobs"
      description="Monitor scheduled and background job definitions, runtime status, enablement, and operational readiness."
      signalValue="Scheduler grid"
      collection="jobs"
      emptyLabel="No jobs found."
      columns={[
        { key: 'id', label: 'Job ID' },
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'enabled', label: 'Enabled' },
      ]}
    />
  );
}
