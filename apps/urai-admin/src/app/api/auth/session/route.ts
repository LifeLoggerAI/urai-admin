import { NextRequest, NextResponse } from 'next/server';

import {
  adminSessionExchangeError,
  exchangeAdminIdToken,
  requireSameOrigin,
} from '@/lib/admin/require-admin-session';
import { auth } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

function clearSessionResponse() {
  const response = NextResponse.json(
    { success: true },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
  response.cookies.set('__session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    if (typeof auth.verifyIdToken !== 'function' || typeof auth.createSessionCookie !== 'function') {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin session exchange is unavailable' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return await exchangeAdminIdToken(request, 'auth.session.refresh');
  } catch (error) {
    return adminSessionExchangeError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireSameOrigin(request);
    return clearSessionResponse();
  } catch (error) {
    return adminSessionExchangeError(error);
  }
}
