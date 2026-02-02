
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  return response;
}
