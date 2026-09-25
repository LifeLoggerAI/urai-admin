import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function DeadLettersPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Failure recovery"
      title="Dead jobs"
      description="Surface DEAD records from the canonical URAI Jobs ledger for controlled recovery. No separate deadLetters collection is treated as authority."
      signalValue="Recovery queue"
      collection="jobs"
      status="DEAD"
      emptyLabel="No dead jobs found."
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
