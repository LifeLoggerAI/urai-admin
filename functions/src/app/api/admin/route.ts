import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner', 'admin']);

    return NextResponse.json(
      {
        error: 'Deprecated generic admin action endpoint disabled. Use a dedicated /api/admin/* route with validation and audit logging.',
      },
      { status: 410 },
    );
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
