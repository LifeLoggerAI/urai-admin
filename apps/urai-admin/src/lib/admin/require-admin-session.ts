import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore } from '@/lib/firebase/admin';

export type AdminRole = 'owner' | 'admin' | 'viewer';

export type AdminSession = {
  uid: string;
  email?: string;
  role: AdminRole;
};

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminAuthError';
    this.status = status;
  }
}

const ADMIN_ROLES: AdminRole[] = ['owner', 'admin', 'viewer'];

function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && ADMIN_ROLES.includes(role as AdminRole);
}

export async function verifyAdminSessionCookie(
  sessionCookie: string | undefined,
  allowedRoles: AdminRole[] = ['owner', 'admin'],
): Promise<AdminSession> {
  if (!sessionCookie) {
    throw new AdminAuthError('Unauthorized', 401);
  }

  const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
  const adminUserDoc = await firestore.collection('adminUsers').doc(decodedToken.uid).get();
  const adminUser = adminUserDoc.data();
  const role = adminUser?.role;

  if (!adminUserDoc.exists || adminUser?.isActive !== true || !isAdminRole(role)) {
    throw new AdminAuthError('Forbidden', 403);
  }

  if (!allowedRoles.includes(role)) {
    throw new AdminAuthError('Forbidden', 403);
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email ?? adminUser.email,
    role,
  };
}

export async function requireAdminSession(
  req: NextRequest,
  allowedRoles: AdminRole[] = ['owner', 'admin'],
): Promise<AdminSession> {
  const sessionCookie = req.cookies.get('__session')?.value;
  return verifyAdminSessionCookie(sessionCookie, allowedRoles);
}

export function adminAuthErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error('Admin authorization error:', error);
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
