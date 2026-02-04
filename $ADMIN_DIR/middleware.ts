import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('__session');
  const isAdmin = request.cookies.get('claims')?.value.includes('admin=true');

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    if (!isAdmin) {
      return NextResponse.rewrite(new URL('/admin/access-denied', request.url));
    }
  }

  return NextResponse.next();
}
