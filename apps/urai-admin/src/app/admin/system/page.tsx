import { firestore } from '@/lib/firebase/admin';

function formatDate(value: unknown) {
  if (!value) return '—';

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) return value.toLocaleString();

  return String(value);
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

type SystemConfigRow = {
  id: string;
  value: unknown;
  updatedAt: unknown;
  updatedBy: string | null;
};

type JobSummary = {
  totalJobs: number;
  enabledJobs: number;
  recentRuns: number;
  recentFailures: number;
  deadLetters: number;
};

async function getSystemConfig(): Promise<SystemConfigRow[]> {
  try {
    const snapshot = await firestore.collection('systemConfig').orderBy('updatedAt', 'desc').limit(100).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        value: data.value ?? data,
        updatedAt: data.updatedAt ?? null,
        updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
      };
    });
  } catch (error) {
    console.warn('Unable to load system config during admin render:', error);
    return [];
  }
}

async function getJobSummary(): Promise<JobSummary> {
  try {
    const [jobsSnapshot, recentRunsSnapshot, failedRunsSnapshot, deadLettersSnapshot] = await Promise.all([
      firestore.collection('jobs').limit(500).get(),
      firestore.collection('jobRuns').orderBy('createdAt', 'desc').limit(100).get(),
      firestore.collection('jobRuns').where('status', 'in', ['failed', 'error']).limit(100).get(),
      firestore.collection('deadLetters').limit(100).get(),
    ]);

    const enabledJobs = jobsSnapshot.docs.filter((doc) => doc.data().enabled === true).length;

    return {
      totalJobs: jobsSnapshot.size,
      enabledJobs,
      recentRuns: recentRunsSnapshot.size,
      recentFailures: failedRunsSnapshot.size,
      deadLetters: deadLettersSnapshot.size,
    };
  } catch (error) {
    console.warn('Unable to load job summary during admin render:', error);
    return {
      totalJobs: 0,
      enabledJobs: 0,
      recentRuns: 0,
      recentFailures: 0,
      deadLetters: 0,
    };
  }
}

export default async function SystemPage() {
  const [config, jobSummary] = await Promise.all([getSystemConfig(), getJobSummary()]);

  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Control Surface</h1>
        <p className="text-sm text-muted-foreground">Read-only operational visibility for config, jobs, runs, failures, and dead letters.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="Jobs" value={jobSummary.totalJobs} />
        <Metric label="Enabled Jobs" value={jobSummary.enabledJobs} />
        <Metric label="Recent Runs" value={jobSummary.recentRuns} />
        <Metric label="Recent Failures" value={jobSummary.recentFailures} />
        <Metric label="Dead Letters" value={jobSummary.deadLetters} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">System Config</h2>
          <p className="text-sm text-muted-foreground">Latest config documents from Firestore.</p>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Config</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Updated By</th>
              </tr>
            </thead>
            <tbody>
              {config.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={4}>No system config documents found.</td>
                </tr>
              ) : (
                config.map((item) => (
                  <tr key={item.id} className="border-t align-top">
                    <td className="px-4 py-3 font-medium">{item.id}</td>
                    <td className="max-w-xl truncate px-4 py-3 font-mono text-xs">{renderValue(item.value)}</td>
                    <td className="px-4 py-3">{formatDate(item.updatedAt)}</td>
                    <td className="px-4 py-3">{item.updatedBy ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
