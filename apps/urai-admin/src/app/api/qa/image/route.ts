import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function resolveAllowedImagePath(homeDir: string, requestedPath: string) {
  const candidate = path.resolve(requestedPath);
  const allowedRoots = [
    path.resolve(homeDir, 'deploy_screenshots'),
    path.resolve(homeDir, 'deploy_diffs'),
  ];

  const insideAllowedRoot = allowedRoots.some(
    (root) => candidate === root || candidate.startsWith(`${root}${path.sep}`),
  );
  if (!insideAllowedRoot) throw new Error('Image path is outside the authorized QA artifact roots');

  const extension = path.extname(candidate).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(extension)) throw new Error('Unsupported QA image type');
  return { candidate, extension };
}

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

    let resolved;
    try {
      resolved = resolveAllowedImagePath(homeDir, imagePath);
    } catch {
      return NextResponse.json({ error: 'Invalid QA image path' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const imageBuffer = await fs.readFile(resolved.candidate);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType(resolved.extension),
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
