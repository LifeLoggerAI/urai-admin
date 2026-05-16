import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdminSession(req, ['owner', 'admin', 'viewer']);
    return NextResponse.json({ status: 'success', role: session.role });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
