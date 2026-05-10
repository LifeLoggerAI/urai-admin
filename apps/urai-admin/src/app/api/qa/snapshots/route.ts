import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

const SNAPSHOT_FILE_PATTERN = /^urai-admin_curr_snapshot_([a-zA-Z0-9_-]{1,80})\.json$/;

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner']);

    const homeDir = process.env.HOME;

    if (!homeDir) {
      return NextResponse.json({ error: 'Deploy artifact directory is not configured' }, { status: 500 });
    }

    const logDir = path.resolve(homeDir, 'deploy_logs');
    const files = await fs.readdir(logDir);
    const tags = files
      .map((file) => file.match(SNAPSHOT_FILE_PATTERN)?.[1])
      .filter((tag): tag is string => Boolean(tag));

    return NextResponse.json(tags);
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('Failed to read QA snapshots:', error);
    return NextResponse.json({ error: 'Failed to read snapshot directory' }, { status: 500 });
  }
}
