import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('firebaseIdToken'); 
  const { pathname } = request.nextUrl;

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!cookie && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access the login page, redirect to dashboard
  if (cookie && pathname === '/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
