import { AdminCollectionTable } from '../_components/AdminCollectionTable';

export default function JobRunsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Runs</h1>
        <p className="text-sm text-muted-foreground">Live job run records from the runtime admin API.</p>
      </div>

      <AdminCollectionTable
        collection="jobRuns"
        emptyLabel="No job runs found."
        columns={[
          { key: 'id', label: 'Run ID' },
          { key: 'jobId', label: 'Job ID' },
          { key: 'status', label: 'Status' },
          { key: 'startedAt', label: 'Started' },
          { key: 'endedAt', label: 'Ended' }
        ]}
      />
    </main>
  );
}
