
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { flagId, enabled } = await request.json();
  const actorUid = request.headers.get('x-user-id');
  const actorEmail = (await admin.auth().getUser(actorUid as string)).email;

  if (!flagId || typeof enabled !== 'boolean') {
    return NextResponse.json({ success: false, message: 'Flag ID and enabled status are required' }, { status: 400 });
  }

  try {
    const flagRef = admin.firestore().collection('featureFlags').doc(flagId);
    const auditLogRef = admin.firestore().collection('auditLogs').doc();

    const batch = admin.firestore().batch();

    batch.update(flagRef, { enabled });
    batch.set(auditLogRef, {
      ts: new Date(),
      actorUid,
      actorEmail,
      action: 'set-flag',
      targetType: 'featureFlag',
      targetId: flagId,
      meta: { enabled },
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
