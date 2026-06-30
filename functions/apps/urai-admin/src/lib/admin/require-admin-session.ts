import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore } from '@/lib/firebase/admin';

export type AdminRole = 'owner' | 'admin' | 'viewer';

export type AdminSession = {
  uid: string;
  email?: string;
  role: AdminRole;
};

const noStoreHeaders = { 'Cache-Control': 'no-store' } as const;

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminAuthError';
    this.status = status;
  }
}

export async function requireAdminSession(
  req: NextRequest,
  allowedRoles: AdminRole[] = ['owner', 'admin'],
): Promise<AdminSession> {
  const sessionCookie = req.cookies.get('__session')?.value;

  if (!sessionCookie) {
    throw new AdminAuthError('Unauthorized', 401);
  }

  const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
  const role = decodedToken.role as AdminRole | undefined;

  if (!role || !allowedRoles.includes(role)) {
    throw new AdminAuthError('Forbidden', 403);
  }

  const adminUserDoc = await firestore.collection('adminUsers').doc(decodedToken.uid).get();
  const adminUser = adminUserDoc.data();

  if (!adminUserDoc.exists || adminUser?.isActive !== true || adminUser?.role !== role) {
    throw new AdminAuthError('Forbidden', 403);
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    role,
  };
}

export function adminAuthErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders });
  }

  console.error('Admin authorization error:', error);
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStoreHeaders });
}
