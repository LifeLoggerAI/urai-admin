import { db } from '@/lib/firebase-admin';

async function getJob(jobId) {
  const doc = await db.collection('jobs').doc(jobId).get();
  return { id: doc.id, ...doc.data() };
}

export default async function JobPage({ params }) {
  const job = await getJob(params.jobId);

  return (
    <div>
      <h1>Job Details</h1>
      <p>ID: {job.id}</p>
      <p>Status: {job.status}</p>
      <p>Kind: {job.kind}</p>
      <p>Input: {JSON.stringify(job.input)}</p>
      <p>Output: {JSON.stringify(job.output)}</p>
      <p>Errors: {JSON.stringify(job.errors)}</p>
      {/* Add job runs and artifacts links */}
    </div>
  );
}
