import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

type JobRow = {
  id: string;
  name: string;
  type: string;
  status: string;
  enabled: boolean;
  schedule: string | null;
  updatedAt: unknown;
};

async function getJobs(): Promise<JobRow[]> {
  try {
    const snapshot = await firestore.collection('jobs').limit(200).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: typeof data.name === 'string' ? data.name : doc.id,
        type: typeof data.type === 'string' ? data.type : '—',
        status: typeof data.status === 'string' ? data.status : 'unknown',
        enabled: data.enabled === true,
        schedule: typeof data.schedule === 'string' ? data.schedule : null,
        updatedAt: data.updatedAt ?? data.createdAt ?? null,
      };
    });
  } catch (error) {
    console.warn('Unable to load jobs during admin render:', error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground">Read-only operational view of scheduled and background jobs.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Enabled</th>
              <th className="px-4 py-3 font-medium">Schedule</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>No jobs found.</td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="px-4 py-3"><div className="font-medium">{job.name}</div><div className="text-xs text-muted-foreground">{job.id}</div></td>
                  <td className="px-4 py-3">{job.type}</td>
                  <td className="px-4 py-3">{job.status}</td>
                  <td className="px-4 py-3">{job.enabled ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{job.schedule ?? '—'}</td>
                  <td className="px-4 py-3">{formatDate(job.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
