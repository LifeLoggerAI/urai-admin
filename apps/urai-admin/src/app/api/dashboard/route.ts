import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/dashboard';

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
