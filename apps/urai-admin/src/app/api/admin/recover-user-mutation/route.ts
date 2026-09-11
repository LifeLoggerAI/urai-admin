import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  AdminAuthError,
  adminAuthErrorResponse,
  requireAdminMutationSession,
} from '@/lib/admin/require-admin-session';
import { recoverAdminMutation } from '@/lib/admin/recover-admin-mutation';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store' } as const;
const recoverySchema = z.object({
  uid: z.string().trim().min(1),
  mutationId: z.string().trim().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdminMutationSession(request, ['owner']);
    const payload = recoverySchema.parse(await request.json());
    const result = await recoverAdminMutation({ actor, ...payload });
    return NextResponse.json(result, { headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin mutation recovery payload', issues: error.issues },
        { status: 400, headers: noStoreHeaders },
      );
    }
    if (error instanceof AdminAuthError) return adminAuthErrorResponse(error);
    console.error('Failed to recover admin mutation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to recover admin mutation' },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
