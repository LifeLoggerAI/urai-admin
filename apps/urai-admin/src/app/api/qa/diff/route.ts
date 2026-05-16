import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, isNextDynamicServerError, requireAdminSession } from '@/lib/admin/require-admin-session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TAG_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;
const isFirebaseBuildStub =
  process.env.URAI_ADMIN_BUILD_STUB_FIREBASE === '1' || process.env.NEXT_PHASE === 'phase-production-build';

type Snapshot = {
  screenshots?: Record<string, string>;
};

function resolveDeployPath(homeDir: string, directory: string, fileOrDir: string) {
  const baseDir = path.resolve(homeDir, directory);
  const resolved = path.resolve(baseDir, fileOrDir);

  if (resolved !== baseDir && !resolved.startsWith(`${baseDir}${path.sep}`)) {
    throw new Error('Invalid deploy artifact path');
  }

  return resolved;
}

export async function GET(req: NextRequest) {
  if (isFirebaseBuildStub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await requireAdminSession(req, ['owner']);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  try {
    const { searchParams } = new URL(req.url);
    const prevTag = searchParams.get('prevTag');
    const currTag = searchParams.get('currTag');

    if (!prevTag || !currTag || !TAG_PATTERN.test(prevTag) || !TAG_PATTERN.test(currTag)) {
      return NextResponse.json({ error: 'Valid prevTag and currTag are required' }, { status: 400 });
    }

    const homeDir = process.env.HOME;

    if (!homeDir) {
      return NextResponse.json({ error: 'Deploy artifact directory is not configured' }, { status: 500 });
    }

    const currSnapshotFile = resolveDeployPath(homeDir, 'deploy_logs', `urai-admin_curr_snapshot_${currTag}.json`);
    const prevSnapshotFile = resolveDeployPath(homeDir, 'deploy_logs', `urai-admin_curr_snapshot_${prevTag}.json`);
    const diffDir = resolveDeployPath(homeDir, 'deploy_diffs', `urai-admin_${currTag}`);
    const prevScreenshotDir = resolveDeployPath(homeDir, 'deploy_screenshots', `urai-admin_${prevTag}`);
    const currScreenshotDir = resolveDeployPath(homeDir, 'deploy_screenshots', `urai-admin_${currTag}`);

    const [currSnapshotStr, prevSnapshotStr] = await Promise.all([
      fs.readFile(currSnapshotFile, 'utf-8'),
      fs.readFile(prevSnapshotFile, 'utf-8'),
    ]);

    const currSnapshot = JSON.parse(currSnapshotStr) as Snapshot;
    const prevSnapshot = JSON.parse(prevSnapshotStr) as Snapshot;
    const currScreenshots = currSnapshot.screenshots ?? {};
    const prevScreenshots = prevSnapshot.screenshots ?? {};

    const visualRegressions = Object.keys(currScreenshots)
      .filter((key) => prevScreenshots[key] && prevScreenshots[key] !== currScreenshots[key])
      .map((key) => {
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        return {
          key,
          diff: path.join(diffDir, `${safeKey}_diff.png`),
          prev: path.join(prevScreenshotDir, `${safeKey}.png`),
          curr: path.join(currScreenshotDir, `${safeKey}.png`),
        };
      });

    return NextResponse.json({ visualRegressions });
  } catch (error) {
    if (isNextDynamicServerError(error)) {
      throw error;
    }

    console.error('Failed to generate QA diff:', error);
    return NextResponse.json({ error: 'Failed to generate diff' }, { status: 500 });
  }
}
