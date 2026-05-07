import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const jobsSnapshot = await firestore.collection('jobs').get();
    const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
