
import { firestore } from './firebase-admin';

export async function getDashboardData() {
  const usersSnapshot = await firestore.collection('users').get();
  const jobsSnapshot = await firestore.collection('jobs').get();
  const eventsSnapshot = await firestore.collection('events').get();
  const errorsSnapshot = await firestore.collection('errors').get();

  return {
    totalUsers: usersSnapshot.size,
    totalJobs: jobsSnapshot.size,
    totalEvents: eventsSnapshot.size,
    totalErrors: errorsSnapshot.size,
  };
}
