import { constants } from 'node:fs';
import { open, realpath } from 'node:fs/promises';
import path from 'node:path';
import { Buffer } from 'node:buffer';

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
      !Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > DEFAULT_MAX_BYTES) {
    throw new Error('QA artifact type or size policy is invalid');
  }

  const home = path.resolve(homeDir);
  // Accept canonical HOME-relative references from the diff API, while keeping
  // absolute legacy image paths contained by the same policy.
  const candidate = path.resolve(home, requestedPath);
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
    // A file can grow after fstat(). Never call readFile() without a hard
    // independent byte cap: read at most maxBytes + 1, even under append races.
    const chunks = [];
    let length = 0;
    while (true) {
      const chunk = Buffer.allocUnsafe(Math.min(65536, maxBytes - length + 1));
      const { bytesRead } = await file.read(chunk, 0, chunk.length, null);
      if (bytesRead === 0) break;
      length += bytesRead;
      if (length > maxBytes) throw new Error('QA artifact exceeds size limit');
      chunks.push(chunk.subarray(0, bytesRead));
    }
    return { bytes: Buffer.concat(chunks, length), extension };
  } finally {
    await file.close();
  }
}
