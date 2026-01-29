
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const jobsSnapshot = await firestore.collection('jobs').get();
    const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
