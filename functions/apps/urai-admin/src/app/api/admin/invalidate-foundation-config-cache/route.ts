
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { auth } from 'firebase-admin';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    const decodedToken = await auth().verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const configRef = firestore.doc('foundationConfig/config');

    await configRef.update({ cacheInvalidatedAt: new Date() });

    await firestore.collection('auditLogs').add({
      uid: decodedToken.uid,
      action: 'invalidateFoundationConfigCache',
      ts: new Date(),
      meta: {}, 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
