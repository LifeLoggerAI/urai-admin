import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { readGuardedQaFile } from '@/lib/qa/guarded-artifact-read.mjs';
import { parseQaSnapshot, qaLogSummary } from '@/lib/qa/safe-snapshot-summary.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TAG_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner']);

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');

    if (!tag || !TAG_PATTERN.test(tag)) {
      return NextResponse.json({ error: 'A valid tag is required' }, { status: 400 });
    }

    const homeDir = process.env.HOME;

    if (!homeDir) {
      return NextResponse.json({ error: 'Log directory is not configured' }, { status: 500 });
    }

    const snapshotFile = `deploy_logs/urai-admin_curr_snapshot_${tag}.json`;
    const { bytes } = await readGuardedQaFile({
      homeDir,
      requestedPath: snapshotFile,
      allowedDirectories: ['deploy_logs'],
      allowedExtensions: ['.json'],
      maxBytes: 1024 * 1024,
    });
    const summary = qaLogSummary(parseQaSnapshot(bytes));
    return NextResponse.json(summary, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to read QA logs:', error);
    return NextResponse.json({ error: 'Failed to read snapshot file' }, { status: 500 });
  }
}
