import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { auth, firestore, writeAuditLog } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const roleSchema = z.object({
  role: z.enum(['owner', 'admin', 'viewer']),
});

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  const { uid } = params;

  try {
    const session = await requireAdminSession(req, ['owner']);
    const { role } = roleSchema.parse(await req.json());

    if (session.uid === uid) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    const userRef = firestore.collection('adminUsers').doc(uid);
    const userDoc = await userRef.get();
    const before = userDoc.data();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    await userRef.set({
      role,
      updatedAt: new Date(),
      updatedBy: session.uid,
    }, { merge: true });

    await auth.setCustomUserClaims(uid, { admin: true, role });

    await writeAuditLog({
      actorUid: session.uid,
      actorEmail: session.email ?? 'unknown-admin@urai.local',
      action: 'adminUsers.role.update',
      target: { type: 'adminUser', id: uid },
      metadata: { previousRole: before?.role ?? null, newRole: role },
    });

    return NextResponse.json({ success: true, uid, role }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid role payload', issues: error.issues }, { status: 400 });
    }

    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error(`Error updating role for user ${uid}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
