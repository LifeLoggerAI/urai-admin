import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  executeInstitutionalFeatureFlag,
  InstitutionalWorkflowError,
} from '@/lib/admin/execute-institutional-feature-flag';
import {
  AdminAuthError,
  adminAuthErrorResponse,
  requireAdminMutationSession,
} from '@/lib/admin/require-admin-session';

export const dynamic = 'force-dynamic';

const setFlagSchema = z.object({
  operationId: z.string().uuid(),
  flagId: z.string().trim().min(1),
  enabled: z.boolean(),
  rollout: z.number().min(0).max(100).optional(),
});

function jsonNoStore(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminMutationSession(request, ['owner', 'admin']);
    const payload = setFlagSchema.parse(await request.json());
    const result = await executeInstitutionalFeatureFlag({
      actor: session,
      operationId: payload.operationId,
      flagId: payload.flagId,
      enabled: payload.enabled,
      rollout: payload.rollout,
    });
    return jsonNoStore(result);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    if (error instanceof InstitutionalWorkflowError) {
      return jsonNoStore({ success: false, error: error.message }, error.status);
    }

    if (error instanceof z.ZodError) {
      return jsonNoStore(
        { success: false, error: 'Invalid feature flag payload', issues: error.issues },
        400,
      );
    }

    console.error('Failed to update feature flag:', error);
    return jsonNoStore({ success: false, error: 'Failed to update feature flag' }, 500);
  }
}
