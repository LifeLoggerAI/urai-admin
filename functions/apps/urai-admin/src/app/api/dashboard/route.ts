import { NextRequest, NextResponse } from 'next/server';
import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { getDashboardData } from '@/lib/dashboard';

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession(request, ['owner', 'admin', 'viewer']);
    const data = await getDashboardData();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof Error && 'status' in error) return adminAuthErrorResponse(error);
    console.error('Failed to load dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
