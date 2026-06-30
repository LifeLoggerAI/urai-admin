import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

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

    const snapshotFile = path.resolve(homeDir, 'deploy_logs', `urai-admin_curr_snapshot_${tag}.json`);
    const allowedDir = path.resolve(homeDir, 'deploy_logs');

    if (!snapshotFile.startsWith(`${allowedDir}${path.sep}`)) {
      return NextResponse.json({ error: 'Invalid log path' }, { status: 400 });
    }

    const snapshotStr = await fs.readFile(snapshotFile, 'utf-8');
    const snapshot = JSON.parse(snapshotStr) as {
      links?: Record<string, number>;
      console?: unknown[];
    };

    return NextResponse.json({
      brokenLinks: Object.entries(snapshot.links ?? {})
        .filter(([, status]) => status !== 200)
        .map(([url, status]) => ({ url, status })),
      consoleErrors: snapshot.console ?? [],
    });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to read QA logs:', error);
    return NextResponse.json({ error: 'Failed to read snapshot file' }, { status: 500 });
  }
}
