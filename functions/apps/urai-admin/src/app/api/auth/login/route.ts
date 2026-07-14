import { NextRequest, NextResponse } from 'next/server';

import { adminSessionExchangeError, exchangeAdminIdToken } from '@/lib/admin/require-admin-session';
import { auth } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (typeof auth.verifyIdToken !== 'function' || typeof auth.createSessionCookie !== 'function') {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin session exchange is unavailable' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return await exchangeAdminIdToken(request, 'auth.login');
  } catch (error) {
    return adminSessionExchangeError(error);
  }
}
