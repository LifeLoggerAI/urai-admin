import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { auth, firestore, writeAuditLog } from '@/lib/firebase/admin';

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  const { uid } = params;

  try {
    const session = await requireAdminSession(req, ['owner']);
    const { role } = await req.json();

    if (!['owner', 'admin', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (session.uid === uid) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    const userRef = firestore.collection('adminUsers').doc(uid);
    await userRef.update({ role });
    await auth.setCustomUserClaims(uid, { admin: role === 'owner' || role === 'admin', role });

    await writeAuditLog({
      actorUid: session.uid,
      actorEmail: session.email ?? 'unknown-admin@urai.local',
      action: 'update_role',
      target: { type: 'user', id: uid },
      metadata: { newRole: role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error(`Error updating role for user ${uid}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
