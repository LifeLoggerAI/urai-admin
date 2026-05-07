import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type JobRunRow = {
  id: string;
  jobId: string;
  status: string;
  startedAt: unknown;
  endedAt: unknown;
  durationMs: number | null;
  error: string | null;
};

async function getJobRuns(): Promise<JobRunRow[]> {
  const snapshot = await firestore.collection('jobRuns').orderBy('startedAt', 'desc').limit(200).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      jobId: typeof data.jobId === 'string' ? data.jobId : '—',
      status: typeof data.status === 'string' ? data.status : typeof data.state === 'string' ? data.state : 'unknown',
      startedAt: data.startedAt ?? data.createdAt ?? null,
      endedAt: data.endedAt ?? data.completedAt ?? null,
      durationMs: typeof data.durationMs === 'number' ? data.durationMs : null,
      error: typeof data.error === 'string' ? data.error : typeof data.lastError === 'string' ? data.lastError : null,
    };
  });
}

export default async function JobRunsPage() {
  const runs = await getJobRuns();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Runs</h1>
        <p className="text-sm text-muted-foreground">Recent job execution history and failure context.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Run</th>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Started</th>
              <th className="px-4 py-3 font-medium">Ended</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Error</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={7}>No job runs found.</td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{run.id}</td>
                  <td className="px-4 py-3">{run.jobId}</td>
                  <td className="px-4 py-3">{run.status}</td>
                  <td className="px-4 py-3">{formatDate(run.startedAt)}</td>
                  <td className="px-4 py-3">{formatDate(run.endedAt)}</td>
                  <td className="px-4 py-3">{run.durationMs === null ? '—' : `${run.durationMs}ms`}</td>
                  <td className="max-w-lg truncate px-4 py-3 font-mono text-xs">{run.error ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
