import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already done.
if (getApps().length === 0) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    request.nextUrl.pathname = '/login';
    return NextResponse.redirect(request.nextUrl);
  }

  try {
    const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
    if (decodedToken.admin !== true) {
        request.nextUrl.pathname = '/unauthorized';
        return NextResponse.redirect(request.nextUrl);
    }
    return NextResponse.next();
  } catch (error) {
    request.nextUrl.pathname = '/login';
    return NextResponse.redirect(request.nextUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};