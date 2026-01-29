import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET() {
  const session = cookies().get('__session')?.value || '';

  if (!session) {
    return new NextResponse('Session not found', { status: 401 });
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    return NextResponse.json({ status: 'success', role: decodedClaims.role });
  } catch (error) {
    return new NextResponse('Invalid session cookie', { status: 401 });
  }
}
