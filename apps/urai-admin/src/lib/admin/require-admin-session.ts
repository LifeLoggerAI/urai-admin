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

type NextDynamicServerError = Error & {
  digest?: string;
  description?: string;
  message?: string;
};

const isFirebaseBuildStub =
  process.env.URAI_ADMIN_BUILD_STUB_FIREBASE === '1' || process.env.NEXT_PHASE === 'phase-production-build';

export function isNextDynamicServerError(error: unknown): error is NextDynamicServerError {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as NextDynamicServerError;
  const description = typeof candidate.description === 'string' ? candidate.description : '';
  const message = typeof candidate.message === 'string' ? candidate.message : '';

  return (
    candidate.digest === 'DYNAMIC_SERVER_USAGE' ||
    description.includes('Dynamic server usage') ||
    message.includes('Dynamic server usage') ||
    message.includes("couldn't be rendered statically")
  );
}

export async function requireAdminSession(
  req: NextRequest,
  allowedRoles: AdminRole[] = ['owner', 'admin'],
): Promise<AdminSession> {
  if (isFirebaseBuildStub) {
    throw new AdminAuthError('Unauthorized', 401);
  }

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
  if (isNextDynamicServerError(error)) {
    throw error;
  }

  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error('Admin authorization error:', error);
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
