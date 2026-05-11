import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function DeadLettersPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dead Letters</h1>
        <p className="text-sm text-muted-foreground">Live dead-letter records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="deadLetters"
        emptyLabel="No dead letters found."
        columns={[
          { key: 'id', label: 'Letter ID' },
          { key: 'source', label: 'Source' },
          { key: 'reason', label: 'Reason' },
          { key: 'attempts', label: 'Attempts' },
          { key: 'createdAt', label: 'Created' }
        ]}
      />
    </main>
  );
}
