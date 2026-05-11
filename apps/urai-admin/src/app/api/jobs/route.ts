import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

type FirestoreDoc = {
  id: string;
  data: () => Record<string, unknown>;
};

export async function GET() {
  try {
    const jobsSnapshot = await firestore.collection('jobs').get();
    const jobs = (jobsSnapshot.docs as FirestoreDoc[]).map((doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to load jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
