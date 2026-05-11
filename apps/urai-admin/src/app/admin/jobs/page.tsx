import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function JobsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground">Live job records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="jobs"
        emptyLabel="No jobs found."
        columns={[
          { key: 'id', label: 'Job ID' },
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'enabled', label: 'Enabled' }
        ]}
      />
    </main>
  );
}
