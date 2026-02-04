
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const eventsSnapshot = await firestore.collection('events').get();
    const topEvents = eventsSnapshot.docs.reduce((acc, doc) => {
      const eventName = doc.data().name;
      acc[eventName] = (acc[eventName] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const routesSnapshot = await firestore.collection('routes').get();
    const topRoutes = routesSnapshot.docs.reduce((acc, doc) => {
      const routeName = doc.data().name;
      acc[routeName] = (acc[routeName] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    res.status(200).json({ topEvents, topRoutes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
