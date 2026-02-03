
import { auth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Check if user is in adminUsers collection
    const adminUserRef = db.collection('adminUsers').doc(uid);
    const adminUserDoc = await adminUserRef.get();

    if (adminUserDoc.exists && adminUserDoc.data()?.isActive) {
      const user = adminUserDoc.data();

      await auth.setCustomUserClaims(uid, { role: user.role });

      await adminUserRef.update({ lastLoginAt: new Date() });

      const cookieStore = cookies();
      cookieStore.set('__session', sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      const adminUsersCollection = db.collection('adminUsers');
      const snapshot = await adminUsersCollection.get();

      if (snapshot.empty && process.env.ALLOW_ADMIN_BOOTSTRAP === 'true') {
        await adminUserRef.set({
          email,
          role: 'owner',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
        });

        await auth.setCustomUserClaims(uid, { role: 'owner' });

        const cookieStore = cookies();
        cookieStore.set('__session', sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return NextResponse.json({ success: true, isBootstrap: true }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
