import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/firebase';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the user from the session
  const user = auth.currentUser;

  // If the user is not logged in and is trying to access an admin route, redirect to login
  if (!user && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in, check for admin claim
  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    // If the user does not have the admin claim and is trying to access an admin route, show not authorized
    if (!idTokenResult.claims.admin && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/not-authorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
