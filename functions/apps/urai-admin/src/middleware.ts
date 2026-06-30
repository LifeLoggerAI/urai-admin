import { NextRequest, NextResponse } from 'next/server';

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

async function verifyAdminSession(req: NextRequest) {
  const verifyUrl = new URL('/api/auth/admin-session', req.url);

  const response = await fetch(verifyUrl, {
    method: 'GET',
    headers: {
      cookie: req.headers.get('cookie') ?? '',
    },
    cache: 'no-store',
  });

  return response;
}

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

    return redirectToLogin(req);
  }

  const verification = await verifyAdminSession(req);

  if (!verification.ok) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: verification.status === 403 ? 'Forbidden' : 'Unauthorized' },
        { status: verification.status === 403 ? 403 : 401 },
      );
    }

    return redirectToLogin(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
