import { auth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();
const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    const adminUserRef = db.collection('adminUsers').doc(uid);
    const adminUserDoc = await adminUserRef.get();

    if (adminUserDoc.exists && adminUserDoc.data()?.isActive) {
      const user = adminUserDoc.data();
      const role = user?.role;

      if (!['owner', 'admin', 'viewer'].includes(role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      await auth.setCustomUserClaims(uid, { role, admin: role === 'owner' || role === 'admin' });
      await adminUserRef.update({ lastLoginAt: new Date(), updatedAt: new Date() });

      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      cookies().set('__session', sessionCookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: expiresIn / 1000,
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    const snapshot = await db.collection('adminUsers').limit(1).get();

    if (snapshot.empty && process.env.ALLOW_ADMIN_BOOTSTRAP === 'true') {
      await adminUserRef.set({
        email,
        role: 'owner',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      });

      await auth.setCustomUserClaims(uid, { role: 'owner', admin: true });
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

      cookies().set('__session', sessionCookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: expiresIn / 1000,
      });

      return NextResponse.json({ success: true, isBootstrap: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
