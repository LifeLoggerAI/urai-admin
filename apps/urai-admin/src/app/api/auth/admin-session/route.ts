import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdminSession(req, ['owner', 'admin', 'viewer']);

    return NextResponse.json(
      {
        ok: true,
        uid: session.uid,
        email: session.email ?? null,
        role: session.role,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
