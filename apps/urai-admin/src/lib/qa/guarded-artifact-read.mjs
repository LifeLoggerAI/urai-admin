import { constants } from 'node:fs';
import { open, realpath } from 'node:fs/promises';
import path from 'node:path';

const KNOWN_QA_DIRECTORIES = new Set(['deploy_screenshots', 'deploy_diffs', 'deploy_logs']);
const DEFAULT_MAX_BYTES = 32 * 1024 * 1024;

function isStrictDescendant(directory, candidate) {
  const relative = path.relative(directory, candidate);
  return relative.length > 0 && relative !== '..' &&
    !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

// Server-only. The incoming path may be absolute, but only regular, non-symlink
// artifacts in a specifically allowed HOME/deploy_* directory may be read.
export async function readGuardedQaFile({
  homeDir,
  requestedPath,
  allowedDirectories,
  allowedExtensions,
  maxBytes = DEFAULT_MAX_BYTES,
}) {
  if (typeof homeDir !== 'string' || !homeDir.trim() ||
      typeof requestedPath !== 'string' || !requestedPath.trim()) {
    throw new Error('QA artifact path is not configured');
  }
  if (!Array.isArray(allowedDirectories) || allowedDirectories.length === 0 ||
      allowedDirectories.some((name) => !KNOWN_QA_DIRECTORIES.has(name))) {
    throw new Error('QA artifact roots are not allowlisted');
  }
  if (!Array.isArray(allowedExtensions) || allowedExtensions.length === 0 ||
      !Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new Error('QA artifact type or size policy is invalid');
  }

  const home = path.resolve(homeDir);
  const candidate = path.resolve(requestedPath);
  const allowed = allowedDirectories.some((directory) =>
    isStrictDescendant(path.join(home, directory), candidate));
  if (!allowed) throw new Error('QA artifact is outside allowed directories');

  const extension = path.extname(candidate).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new Error('QA artifact extension is not authorized');
  }

  // Reject file, parent-directory and deploy-root symlinks, including ones
  // which point back into HOME. This is stricter than a path-prefix check.
  const [realHome, realCandidate] = await Promise.all([realpath(home), realpath(candidate)]);
  const expectedRealPath = path.resolve(realHome, path.relative(home, candidate));
  if (realCandidate !== expectedRealPath) {
    throw new Error('QA artifact symbolic link is not authorized');
  }

  // Open the canonical pathname, never the unverified caller pathname.
  // O_NOFOLLOW additionally rejects a final-component link swapped in later.
  const file = await open(realCandidate, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const stat = await file.stat();
    if (!stat.isFile()) throw new Error('QA artifact is not a regular file');
    if (stat.size > maxBytes) throw new Error('QA artifact exceeds size limit');
    const bytes = await file.readFile();
    if (bytes.byteLength > maxBytes) throw new Error('QA artifact exceeds size limit');
    return { bytes, extension };
  } finally {
    await file.close();
  }
}
