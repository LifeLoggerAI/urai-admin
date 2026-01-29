import { auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { idToken } = await request.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
  cookies().set('__session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
  return NextResponse.json({ status: 'success' });
}

export async function DELETE() {
  cookies().delete('__session');
  return NextResponse.json({ status: 'success' });
}
