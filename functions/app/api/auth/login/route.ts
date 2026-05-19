import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth, firestore } from '@/lib/firebase/admin';

const loginSchema = z.object({
  idToken: z.string().min(1),
});

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = loginSchema.parse(await request.json());
    const decodedToken = await auth.verifyIdToken(idToken, true);
    const adminUserRef = firestore.collection('adminUsers').doc(decodedToken.uid);
    const adminUserDoc = await adminUserRef.get();
    const adminUser = adminUserDoc.data();

    if (!adminUserDoc.exists || adminUser?.isActive !== true) {
      return NextResponse.json({ success: false, error: 'Admin access is not active for this account' }, { status: 403 });
    }

    if (!['owner', 'admin', 'viewer'].includes(adminUser.role)) {
      return NextResponse.json({ success: false, error: 'Admin role is not valid for this account' }, { status: 403 });
    }

    const isPrivilegedAdmin = adminUser.role === 'owner' || adminUser.role === 'admin';

    await auth.setCustomUserClaims(decodedToken.uid, {
      admin: isPrivilegedAdmin,
      role: adminUser.role,
    });

    await adminUserRef.set({
      email: decodedToken.email ?? adminUser.email ?? null,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    const refreshedUser = await auth.getUser(decodedToken.uid);
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
    const response = NextResponse.json({ success: true, role: adminUser.role, uid: refreshedUser.uid });

    response.cookies.set('__session', sessionCookie, {
      maxAge: SESSION_MAX_AGE_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    await firestore.collection('auditLogs').add({
      actorUid: decodedToken.uid,
      actorEmail: decodedToken.email ?? adminUser.email ?? null,
      actorRole: adminUser.role,
      action: 'auth.login',
      target: { type: 'adminUser', id: decodedToken.uid },
      metadata: { provider: decodedToken.firebase?.sign_in_provider ?? null },
      createdAt: new Date(),
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid login payload', issues: error.issues }, { status: 400 });
    }

    console.error('Admin login failed:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 401 });
  }
}
