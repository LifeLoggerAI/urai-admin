import { NextResponse } from 'next/server';
export async function POST() {
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set({ name: '__session', value: '', maxAge: -1 });
  return response;
}
