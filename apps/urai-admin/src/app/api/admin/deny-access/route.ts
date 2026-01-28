
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  const actorUid = request.headers.get('x-user-id');
  const actorEmail = (await admin.auth().getUser(actorUid as string)).email;

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  try {
    const accessRequestRef = admin.firestore().collection('accessRequests').doc(userId);
    const auditLogRef = admin.firestore().collection('auditLogs').doc();

    const batch = admin.firestore().batch();

    batch.update(accessRequestRef, { status: 'denied', reviewedAt: new Date(), reviewedBy: actorUid });
    batch.set(auditLogRef, {
      ts: new Date(),
      actorUid,
      actorEmail,
      action: 'deny-access',
      targetType: 'user',
      targetId: userId,
      meta: {},
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
