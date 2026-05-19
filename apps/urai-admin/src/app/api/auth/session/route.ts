import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth, firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const sessionSchema = z.object({
  idToken: z.string().min(1),
});

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;
const ADMIN_ROLES = ['owner', 'admin', 'viewer'] as const;

type AdminRole = (typeof ADMIN_ROLES)[number];

function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && ADMIN_ROLES.includes(role as AdminRole);
}

function clearSessionResponse() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set('__session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = sessionSchema.parse(await request.json());
    const decodedToken = await auth.verifyIdToken(idToken, true);
    const adminUserRef = firestore.collection('adminUsers').doc(decodedToken.uid);
    const adminUserDoc = await adminUserRef.get();
    const adminUser = adminUserDoc.data();

    if (!adminUserDoc.exists || adminUser?.isActive !== true || !isAdminRole(adminUser.role)) {
      return NextResponse.json({ success: false, error: 'Admin access is not active for this account' }, { status: 403 });
    }

    await auth.setCustomUserClaims(decodedToken.uid, {
      admin: true,
      role: adminUser.role,
    });

    await adminUserRef.set({
      email: decodedToken.email ?? adminUser.email ?? null,
      lastSessionAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
    const response = NextResponse.json({ success: true, uid: decodedToken.uid, role: adminUser.role }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });

    response.cookies.set('__session', sessionCookie, {
      maxAge: SESSION_MAX_AGE_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid session payload', issues: error.issues }, { status: 400 });
    }

    console.error('Admin session refresh failed:', error);
    return NextResponse.json({ success: false, error: 'Session refresh failed' }, { status: 401 });
  }
}

export async function DELETE() {
  return clearSessionResponse();
}
