import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AdminAuthError, adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

const updateUserRoleSchema = z.object({
  uid: z.string().trim().min(1),
  role: z.enum(['owner', 'admin', 'viewer']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession(request, ['owner']);
    const payload = updateUserRoleSchema.parse(await request.json());

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
        role: payload.role,
        updatedAt: now,
        updatedBy: session.uid,
      }, { merge: true });

      transaction.set(auditLogRef, {
        actorUid: session.uid,
        actorEmail: session.email ?? null,
        actorRole: session.role,
        action: 'adminUsers.updateRole',
        target: { type: 'adminUser', id: payload.uid },
        metadata: {
          before: { role: before?.role ?? null },
          after: { role: payload.role },
        },
        createdAt: now,
      });
    });

    return NextResponse.json({ success: true, uid: payload.uid, role: payload.role });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin user role payload', issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === 'Admin user not found') {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('Failed to update admin user role:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin user role' }, { status: 500 });
  }
}
