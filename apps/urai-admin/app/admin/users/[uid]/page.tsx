import { db } from '@/lib/firebase-admin';

async function getUser(uid) {
  const doc = await db.collection('users').doc(uid).get();
  return { id: doc.id, ...doc.data() };
}

export default async function UserPage({ params }) {
  const user = await getUser(params.uid);

  return (
    <div>
      <h1>User Details</h1>
      <p>UID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Roles/Claims: {JSON.stringify(user.customClaims)}</p>
      {/* Add last activity if available */}
    </div>
  );
}
