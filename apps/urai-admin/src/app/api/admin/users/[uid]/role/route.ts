
import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore, writeAuditLog } from '@/lib/firebase/admin';

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  const { uid } = params;
  try {
    const sessionCookie = req.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const { uid: actorUid, email: actorEmail, role: actorRole } = decodedToken;

    if (actorRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { role } = await req.json();

    if (!['owner', 'admin', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // You can't change your own role.
    if (actorUid === uid) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    const userRef = firestore.collection('adminUsers').doc(uid);
    await userRef.update({ role });

    await auth.setCustomUserClaims(uid, { role });

    await writeAuditLog({
        actorUid,
        actorEmail,
        action: 'update_role',
        target: { type: 'user', id: uid },
        metadata: { newRole: role },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(`Error updating role for user ${uid}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
