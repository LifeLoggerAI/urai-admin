import { db } from '@/lib/firebase-admin';

async function getJobs() {
  const snapshot = await db.collection('jobs').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div>
      <h1>Jobs</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Kind</th>
            <th>Requested By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.status}</td>
              <td>{job.kind}</td>
              <td>{job.requestedBy}</td>
              <td>{job.createdAt?.toDate().toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
