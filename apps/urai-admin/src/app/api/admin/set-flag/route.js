import { NextResponse } from 'next/server';
import { z } from 'zod';

import { AdminAuthError, adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

const setFlagSchema = z.object({
  flagId: z.string().trim().min(1),
  enabled: z.boolean(),
  rollout: z.number().min(0).max(100).optional(),
});

export async function POST(request) {
  try {
    const session = await requireAdminSession(request, ['owner', 'admin']);
    const payload = setFlagSchema.parse(await request.json());

    const now = new Date();
    const flagRef = firestore.collection('featureFlags').doc(payload.flagId);
    const auditLogRef = firestore.collection('auditLogs').doc();

    const update = {
      enabled: payload.enabled,
      updatedAt: now,
      updatedBy: session.uid,
    };

    if (payload.rollout !== undefined) {
      update.rollout = payload.rollout;
    }

    const batch = firestore.batch();

    batch.set(flagRef, update, { merge: true });
    batch.set(auditLogRef, {
      actorUid: session.uid,
      actorEmail: session.email ?? null,
      actorRole: session.role,
      action: 'featureFlags.set',
      target: { type: 'featureFlag', id: payload.flagId },
      metadata: {
        enabled: payload.enabled,
        rollout: payload.rollout ?? null,
      },
      createdAt: now,
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthErrorResponse(error);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid feature flag payload', issues: error.issues },
        { status: 400 },
      );
    }

    console.error('Failed to update feature flag:', error);
    return NextResponse.json({ success: false, error: 'Failed to update feature flag' }, { status: 500 });
  }
}
