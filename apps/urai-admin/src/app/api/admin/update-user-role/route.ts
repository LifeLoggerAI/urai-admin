import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { adminAuthErrorResponse, requireAdminMutationSession } from '@/lib/admin/require-admin-session';
import { updateAdminRole } from '@/lib/admin/update-admin-role';

export const dynamic = 'force-dynamic';

const updateUserRoleSchema = z.object({
  uid: z.string().trim().min(1),
  role: z.enum(['owner', 'admin', 'viewer']),
});

export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdminMutationSession(request, ['owner']);
    const payload = updateUserRoleSchema.parse(await request.json());
    const result = await updateAdminRole({ actor, uid: payload.uid, role: payload.role });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin user role payload', issues: error.issues },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to update admin user role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user role' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
