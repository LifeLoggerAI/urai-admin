
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('__session');

  // Return to login if session is not set
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decodedToken = await auth().verifyIdToken(session.value);
    const isAdmin = decodedToken.admin;

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
