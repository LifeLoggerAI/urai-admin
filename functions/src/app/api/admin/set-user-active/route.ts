import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AdminAuthError, adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

const setUserActiveSchema = z.object({
  uid: z.string().trim().min(1),
  isActive: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession(request, ['owner', 'admin']);
    const payload = setUserActiveSchema.parse(await request.json());

    if (payload.uid === session.uid && payload.isActive === false) {
      return NextResponse.json({ success: false, error: 'You cannot deactivate your own admin account' }, { status: 400 });
    }

    const now = new Date();
    const userRef = firestore.collection('adminUsers').doc(payload.uid);
    const auditLogRef = firestore.collection('auditLogs').doc();

    await firestore.runTransaction(async (transaction) => {
      const current = await transaction.get(userRef);

      if (!current.exists) {
        throw new Error('Admin user not found');
      }

      const before = current.data();

      transaction.set(userRef, {
        isActive: payload.isActive,
        updatedAt: now,
        updatedBy: session.uid,
      }, { merge: true });

      transaction.set(auditLogRef, {
        actorUid: session.uid,
        actorEmail: session.email ?? null,
        actorRole: session.role,
        action: payload.isActive ? 'adminUsers.activate' : 'adminUsers.deactivate',
        target: { type: 'adminUser', id: payload.uid },
        metadata: {
          before: { isActive: before?.isActive ?? null },
          after: { isActive: payload.isActive },
        },
        createdAt: now,
      });
    });

    return NextResponse.json({ success: true, uid: payload.uid, isActive: payload.isActive });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin user active-state payload', issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === 'Admin user not found') {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('Failed to update admin user active state:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin user active state' }, { status: 500 });
  }
}
