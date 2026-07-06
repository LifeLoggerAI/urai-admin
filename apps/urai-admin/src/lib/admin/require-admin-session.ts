import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore } from '@/lib/firebase/admin';

export type AdminRole = 'owner' | 'admin' | 'viewer';

export type AdminSession = {
  uid: string;
  email?: string;
  role: AdminRole;
};

const noStoreHeaders = { 'Cache-Control': 'no-store' } as const;
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminAuthError';
    this.status = status;
  }
}

function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function allowedAdminOrigins(req: NextRequest) {
  const origins = new Set<string>([req.nextUrl.origin]);
  const candidates = [
    process.env.URAI_ADMIN_BASE_URL,
    process.env.URAI_ADMIN_PRODUCTION_URL,
    ...(process.env.URAI_ADMIN_ALLOWED_ORIGINS ?? '').split(','),
  ];

  for (const candidate of candidates) {
    const origin = normalizeOrigin(candidate?.trim());
    if (origin) origins.add(origin);
  }

  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') ?? 'https';
  const forwardedOrigin = normalizeOrigin(forwardedHost ? `${forwardedProto}://${forwardedHost}` : null);
  if (forwardedOrigin) origins.add(forwardedOrigin);

  return origins;
}

export function requireSameOrigin(req: NextRequest) {
  if (SAFE_METHODS.has(req.method.toUpperCase())) return;

  const origin = normalizeOrigin(req.headers.get('origin'));
  if (!origin) {
    throw new AdminAuthError('Origin header required', 403);
  }

  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') {
    throw new AdminAuthError('Cross-site admin request rejected', 403);
  }

  if (!allowedAdminOrigins(req).has(origin)) {
    throw new AdminAuthError('Admin request origin is not allowed', 403);
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

export async function requireAdminMutationSession(
  req: NextRequest,
  allowedRoles: AdminRole[] = ['owner', 'admin'],
) {
  requireSameOrigin(req);
  return requireAdminSession(req, allowedRoles);
}

export function adminAuthErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders });
  }

  console.error('Admin authorization error:', error);
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStoreHeaders });
}
