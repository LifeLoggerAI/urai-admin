
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { userId, role } = await request.json();
  const actorUid = request.headers.get('x-user-id');
  const actorEmail = (await admin.auth().getUser(actorUid as string)).email;

  if (!userId || !role) {
    return NextResponse.json({ success: false, message: 'User ID and role are required' }, { status: 400 });
  }

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const auditLogRef = admin.firestore().collection('auditLogs').doc();

    const batch = admin.firestore().batch();

    batch.update(userRef, { role });
    batch.set(auditLogRef, {
      ts: new Date(),
      actorUid,
      actorEmail,
      action: 'set-role',
      targetType: 'user',
      targetId: userId,
      meta: { newRole: role },
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
