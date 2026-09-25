import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

type FirestoreDoc = {
  id: string;
  data: () => Record<string, unknown>;
};

const JOB_FIELDS = ['jobId', 'type', 'jobType', 'status', 'retryCount', 'createdAt', 'updatedAt', 'completedAt'] as const;

function normalize(value: unknown): unknown {
  if (value === null || value === undefined) return value ?? null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  return value;
}

function minimizedJob(id: string, data: Record<string, unknown>) {
  return {
    id,
    ...Object.fromEntries(JOB_FIELDS.map((key) => [key, normalize(data[key])])),
  };
}

// Compatibility route only. Canonical Admin screens use /api/admin/collection.
// Keep function-level authorization because middleware intentionally protects
// only /api/admin/* and must not be relied on for this legacy alias.
export async function GET(request: NextRequest) {
  try {
    await requireAdminSession(request, ['owner', 'admin', 'viewer']);
    const jobsSnapshot = await firestore.collection('jobs').limit(100).get();
    const jobs = (jobsSnapshot.docs as FirestoreDoc[]).map((doc) => minimizedJob(doc.id, doc.data()));

    return NextResponse.json(
      {
        authority: 'canonical-jobs-ledger-compatibility-read',
        deprecated: true,
        successor: '/api/admin/collection?collection=jobs',
        jobs,
      },
      { headers: { 'Cache-Control': 'no-store', Deprecation: 'true' } },
    );
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to load jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
