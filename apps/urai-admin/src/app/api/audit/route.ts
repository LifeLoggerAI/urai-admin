
import { getFirestore } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const { uid, email, role } = decodedToken;

    if (!role || !['owner', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, target, metadata } = await req.json();

    if (!action || !target) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.collection('auditLogs').add({
      actorUid: uid,
      actorEmail: email,
      action,
      target,
      metadata: metadata || {},
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error writing audit log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
