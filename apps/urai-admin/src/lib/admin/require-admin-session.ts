import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth, firestore, writeAuditLog } from '@/lib/firebase/admin';

export type AdminRole = 'owner' | 'admin' | 'viewer';

export type AdminSession = {
  uid: string;
  email?: string;
  role: AdminRole;
};

const noStoreHeaders = { 'Cache-Control': 'no-store' } as const;
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const ADMIN_ROLES = ['owner', 'admin', 'viewer'] as const;
const sessionSchema = z.object({ idToken: z.string().min(1) });
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;
const MAX_AUTH_AGE_SECONDS = 60 * 5;
const MAX_CLOCK_SKEW_SECONDS = 30;

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminAuthError';
    this.status = status;
  }
}

function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && ADMIN_ROLES.includes(role as AdminRole);
}

function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isLoopbackOrigin(value: string) {
  try {
    const url = new URL(value);
    return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch {
    return false;
  }
}

function configuredAdminOrigins() {
  const origins = new Set<string>();
  const candidates = [
    process.env.URAI_ADMIN_BASE_URL,
    process.env.URAI_ADMIN_PRODUCTION_URL,
    ...(process.env.URAI_ADMIN_ALLOWED_ORIGINS ?? '').split(','),
  ];

  for (const candidate of candidates) {
    const raw = candidate?.trim();
    if (!raw) continue;

    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      throw new AdminAuthError('Admin origin allowlist contains an invalid URL', 503);
    }

    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      throw new AdminAuthError('Production admin origins must use HTTPS', 503);
    }
    origins.add(parsed.origin);
  }

  return origins;
}

function allowedAdminOrigins(req: NextRequest) {
  const origins = configuredAdminOrigins();

  if (process.env.NODE_ENV !== 'production') {
    const localOrigin = normalizeOrigin(req.nextUrl.origin);
    if (localOrigin && isLoopbackOrigin(localOrigin)) origins.add(localOrigin);
  }

  if (process.env.NODE_ENV === 'production' && origins.size === 0) {
    throw new AdminAuthError('Admin origin allowlist is not configured', 503);
  }

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

function hasRecentAuthentication(authTime: unknown) {
  if (typeof authTime !== 'number') return false;
  const ageSeconds = Math.floor(Date.now() / 1000) - authTime;
  return ageSeconds >= -MAX_CLOCK_SKEW_SECONDS && ageSeconds <= MAX_AUTH_AGE_SECONDS;
}

export async function exchangeAdminIdToken(req: NextRequest, auditAction: string) {
  requireSameOrigin(req);
  const { idToken } = sessionSchema.parse(await req.json());
  const decodedToken = await auth.verifyIdToken(idToken, true);

  if (!hasRecentAuthentication(decodedToken.auth_time)) {
    return NextResponse.json(
      { success: false, reauthRequired: true, error: 'Recent sign-in required' },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const adminUserRef = firestore.collection('adminUsers').doc(decodedToken.uid);
  const adminUserDoc = await adminUserRef.get();
  const adminUser = adminUserDoc.data();

  if (!adminUserDoc.exists || adminUser?.isActive !== true || !isAdminRole(adminUser.role)) {
    return NextResponse.json(
      { success: false, error: 'Admin access is not active for this account' },
      { status: 403, headers: noStoreHeaders },
    );
  }

  const role = adminUser.role;
  const userRecord = await auth.getUser(decodedToken.uid);
  const existingClaims = userRecord.customClaims ?? {};
  const storedClaimsMatch = existingClaims.admin === true && existingClaims.role === role;
  const tokenClaimsMatch = decodedToken.admin === true && decodedToken.role === role;

  if (!storedClaimsMatch) {
    await auth.setCustomUserClaims(decodedToken.uid, { ...existingClaims, admin: true, role });
  }

  if (!tokenClaimsMatch) {
    await writeAuditLog({
      actorUid: decodedToken.uid,
      actorEmail: decodedToken.email ?? adminUser.email ?? 'unknown-admin@urai.local',
      action: 'auth.claims.refreshRequired',
      target: { type: 'adminUser', id: decodedToken.uid },
      metadata: { canonicalRole: role },
    });
    return NextResponse.json(
      { success: false, refreshRequired: true, uid: decodedToken.uid, role },
      { status: 409, headers: noStoreHeaders },
    );
  }

  const now = new Date();
  await adminUserRef.set({
    email: decodedToken.email ?? adminUser.email ?? null,
    lastLoginAt: now,
    lastSessionAt: now,
    updatedAt: now,
  }, { merge: true });

  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
  const response = NextResponse.json(
    { success: true, role, uid: decodedToken.uid },
    { status: 200, headers: noStoreHeaders },
  );

  response.cookies.set('__session', sessionCookie, {
    maxAge: SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  await writeAuditLog({
    actorUid: decodedToken.uid,
    actorEmail: decodedToken.email ?? adminUser.email ?? 'unknown-admin@urai.local',
    action: auditAction,
    target: { type: 'adminUser', id: decodedToken.uid },
    metadata: {
      provider: decodedToken.firebase?.sign_in_provider ?? null,
      authTime: decodedToken.auth_time,
    },
  });

  return response;
}

export function adminSessionExchangeError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: 'Invalid admin session payload', issues: error.issues },
      { status: 400, headers: noStoreHeaders },
    );
  }

  if (error instanceof AdminAuthError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status, headers: noStoreHeaders },
    );
  }

  console.error('Admin session exchange failed:', error);
  return NextResponse.json(
    { success: false, error: 'Admin session exchange failed' },
    { status: 401, headers: noStoreHeaders },
  );
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
