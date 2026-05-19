import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

type FirestoreDoc = {
  data: () => Record<string, unknown>;
};

type CountMap = Record<string, number>;

function incrementByName(acc: CountMap, doc: FirestoreDoc) {
  const data = doc.data();
  const name = typeof data.name === 'string' && data.name.length > 0 ? data.name : 'unknown';
  acc[name] = (acc[name] || 0) + 1;
  return acc;
}

export async function GET() {
  try {
    const eventsSnapshot = await firestore.collection('events').get();
    const topEvents = (eventsSnapshot.docs as FirestoreDoc[]).reduce<CountMap>(incrementByName, {});

    const routesSnapshot = await firestore.collection('routes').get();
    const topRoutes = (routesSnapshot.docs as FirestoreDoc[]).reduce<CountMap>(incrementByName, {});

    return NextResponse.json({ topEvents, topRoutes });
  } catch (error) {
    console.error('Failed to load analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
