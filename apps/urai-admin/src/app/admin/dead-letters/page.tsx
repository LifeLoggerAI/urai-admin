import { SpatialCollectionPage } from '../_components/SpatialCollectionPage';

export default function DeadLettersPage() {
  return (
    <SpatialCollectionPage
      eyebrow="Failure recovery"
      title="Dead letters"
      description="Surface failed queue events that need operational follow-up, retry planning, or source-system cleanup."
      signalValue="Recovery queue"
      collection="deadLetters"
      emptyLabel="No dead letters found."
      columns={[
        { key: 'id', label: 'Letter' },
        { key: 'source', label: 'Source' },
        { key: 'reason', label: 'Reason' },
        { key: 'attempts', label: 'Attempts' },
        { key: 'createdAt', label: 'Created' },
      ]}
    />
  );
}
