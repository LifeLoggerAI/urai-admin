
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth, adminDb } from './lib/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value || '';

  // Redirect to login if no session cookie is present and the route is not /login
  if (!session && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session) {
    try {
      const decodedToken = await adminAuth.verifySessionCookie(session, true);
      const userDoc = await adminDb.collection('adminUsers').doc(decodedToken.uid).get();

      // Check for bootstrap
      const adminUsers = await adminDb.collection('adminUsers').get();
      if (adminUsers.empty && process.env.ALLOW_ADMIN_BOOTSTRAP === 'true') {
        await adminDb.collection('adminUsers').doc(decodedToken.uid).set({
          email: decodedToken.email,
          role: 'owner',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Bootstrapped first admin user: ${decodedToken.email}`);
      } else if (!userDoc.exists || !userDoc.data()?.isActive) {
        // If user is not an active admin, redirect to access denied page and sign out
        const response = NextResponse.redirect(new URL('/access-denied', request.url));
        response.cookies.delete('session');
        return response;
      }

      // If on the login page and authenticated, redirect to the dashboard
      if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      // If session is invalid, redirect to login page and clear the cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
