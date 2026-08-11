import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { adminAuthErrorResponse, requireAdminMutationSession } from '@/lib/admin/require-admin-session';
import { updateAdminRole } from '@/lib/admin/update-admin-role';

export const dynamic = 'force-dynamic';

const roleSchema = z.object({
  role: z.enum(['owner', 'admin', 'viewer']),
});

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  const { uid } = params;

  try {
    const actor = await requireAdminMutationSession(req, ['owner']);
    const { role } = roleSchema.parse(await req.json());
    const result = await updateAdminRole({ actor, uid, role });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid role payload', issues: error.issues },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error(`Error updating role for user ${uid}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
