import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('__session')?.value;

  if (!sessionCookie) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const { uid, role } = decodedToken;

    if (!role || !['owner', 'admin', 'viewer'].includes(role)) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    const headers = new Headers(req.headers);
    headers.set('x-user-id', uid);
    headers.set('x-user-role', role);

    return NextResponse.next({ request: { headers } });
  } catch (error) {
    console.error('Middleware error:', error);

    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('__session');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
