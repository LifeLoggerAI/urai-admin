
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export async function GET() {
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

    return NextResponse.json({ topEvents, topRoutes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
