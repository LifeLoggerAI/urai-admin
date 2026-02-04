import { db } from '@/lib/firebase-admin';

async function getJobsLast24h() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const snapshot = await db.collection('jobs').where('createdAt', '>', yesterday).get();
  return snapshot.size;
}

async function getFailuresLast24h() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const snapshot = await db.collection('jobs').where('createdAt', '>', yesterday).where('status', '==', 'failed').get();
  return snapshot.size;
}

async function getNewestUserCount() {
  const snapshot = await db.collection('users').orderBy('createdAt', 'desc').limit(1).get();
  return snapshot.size;
}

async function getNewestAuditLogs() {
  const snapshot = await db.collection('auditLogs').orderBy('ts', 'desc').limit(5).get();
  return snapshot.docs.map(doc => doc.data());
}

export default async function AdminPage() {
  const [jobsLast24h, failuresLast24h, newestUserCount, newestAuditLogs] = await Promise.all([
    getJobsLast24h(),
    getFailuresLast24h(),
    getNewestUserCount(),
    getNewestAuditLogs(),
  ]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>KPIs</h2>
        <p>Jobs last 24h: {jobsLast24h}</p>
        <p>Failures last 24h: {failuresLast24h}</p>
        <p>Newest user count: {newestUserCount}</p>
        <div>
          <h3>Newest audit logs:</h3>
          <ul>
            {newestAuditLogs.map((log, index) => (
              <li key={index}>{JSON.stringify(log)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
