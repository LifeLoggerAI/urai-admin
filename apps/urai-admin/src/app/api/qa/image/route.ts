import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { readGuardedQaFile } from '@/lib/qa/guarded-artifact-read.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function contentType(extension: string) {
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.webp') return 'image/webp';
  return 'image/png';
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession(request, ['owner']);

    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    if (!imagePath) {
      return NextResponse.json({ error: 'path is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const homeDir = process.env.HOME;
    if (!homeDir) {
      return NextResponse.json({ error: 'QA artifact directory is not configured' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    let guarded;
    try {
      guarded = await readGuardedQaFile({
        homeDir,
        requestedPath: imagePath,
        allowedDirectories: ['deploy_screenshots', 'deploy_diffs'],
        allowedExtensions: [...IMAGE_EXTENSIONS],
      });
    } catch {
      return NextResponse.json({ error: 'Invalid or unavailable QA image' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    return new NextResponse(guarded.bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType(guarded.extension),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }
    console.error('Failed to load QA image:', error);
    return NextResponse.json({ error: 'Image not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
}
