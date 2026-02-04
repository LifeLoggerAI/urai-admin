import { db } from '@/lib/firebase-admin';

async function getPrivacyRequests() {
  const snapshot = await db.collection('privacyRequests').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function PrivacyRequestsPage() {
  const privacyRequests = await getPrivacyRequests();

  return (
    <div>
      <h1>Privacy Requests</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Type</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {privacyRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.status}</td>
              <td>{request.type}</td>
              <td>{request.createdAt?.toDate().toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
