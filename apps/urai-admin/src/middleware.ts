
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
      const { uid, role } = decodedToken;

      if (!role || !['owner', 'admin', 'viewer'].includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      const headers = new Headers(req.headers);
      headers.set('x-user-id', uid);
      headers.set('x-user-role', role);

      return NextResponse.next({ request: { headers } });
    } catch (error) {
      console.error('Middleware error:', error);
      cookieStore.delete('__session');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/'],
};
