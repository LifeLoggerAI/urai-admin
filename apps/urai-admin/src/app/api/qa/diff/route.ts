import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { readGuardedQaFile } from '@/lib/qa/guarded-artifact-read.mjs';
import { parseQaSnapshot, qaDiffSummary, safeQaTag } from '@/lib/qa/safe-snapshot-summary.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner']);

    const { searchParams } = new URL(req.url);
    const prevTag = searchParams.get('prevTag');
    const currTag = searchParams.get('currTag');

    if (!safeQaTag(prevTag) || !safeQaTag(currTag)) {
      return NextResponse.json({ error: 'Valid prevTag and currTag are required' }, { status: 400 });
    }

    const homeDir = process.env.HOME;

    if (!homeDir) {
      return NextResponse.json({ error: 'Deploy artifact directory is not configured' }, { status: 500 });
    }

    const [curr, prev] = await Promise.all([
      readGuardedQaFile({
        homeDir,
        requestedPath: `deploy_logs/urai-admin_curr_snapshot_${currTag}.json`,
        allowedDirectories: ['deploy_logs'],
        allowedExtensions: ['.json'],
        maxBytes: 1024 * 1024,
      }),
      readGuardedQaFile({
        homeDir,
        requestedPath: `deploy_logs/urai-admin_curr_snapshot_${prevTag}.json`,
        allowedDirectories: ['deploy_logs'],
        allowedExtensions: ['.json'],
        maxBytes: 1024 * 1024,
      }),
    ]);
    return NextResponse.json(
      qaDiffSummary(parseQaSnapshot(prev.bytes), parseQaSnapshot(curr.bytes), prevTag!, currTag!),
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to generate QA diff:', error);
    return NextResponse.json({ error: 'Failed to generate diff' }, { status: 500 });
  }
}
