import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdminSession(req, ['owner', 'admin']);

    const usersSnapshot = await firestore.collection('adminUsers').orderBy('createdAt', 'desc').limit(100).get();
    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        uid: doc.id,
        email: data.email ?? null,
        role: data.role ?? null,
        isActive: data.isActive === true,
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
        lastLoginAt: data.lastLoginAt ?? null,
      };
    });

    await firestore.collection('auditLogs').add({
      actorUid: session.uid,
      actorEmail: session.email ?? null,
      actorRole: session.role,
      action: 'adminUsers.list',
      target: { type: 'adminUsers', id: 'list' },
      metadata: { count: users.length },
      createdAt: new Date(),
    });

    return NextResponse.json({ users });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
