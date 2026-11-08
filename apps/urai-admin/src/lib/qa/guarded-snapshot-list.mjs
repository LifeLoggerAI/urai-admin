import { lstat, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

const SNAPSHOT_NAME = /^urai-admin_curr_snapshot_([a-zA-Z0-9_-]{1,80})\.json$/;
const MAX_QA_FILES = 5000;

// This only enumerates names; never opens or serializes private artifact JSON.
// Reject symlinked HOME/deploy_logs and symlinked snapshot files before listing.
export async function listGuardedQaSnapshotTags(homeDir) {
  if (typeof homeDir !== 'string' || !homeDir.trim()) {
    throw new Error('QA HOME directory is not configured');
  }
  const home = path.resolve(homeDir);
  const logDir = path.join(home, 'deploy_logs');
  const [realHome, realLogDir] = await Promise.all([realpath(home), realpath(logDir)]);
  if (realLogDir !== path.join(realHome, 'deploy_logs')) {
    throw new Error('QA snapshot directory symlink is not permitted');
  }
  const directory = await lstat(logDir);
  if (!directory.isDirectory() || directory.isSymbolicLink()) {
    throw new Error('QA snapshot directory is not a plain directory');
  }
  const entries = await readdir(logDir, { withFileTypes: true });
  if (entries.length > MAX_QA_FILES) throw new Error('QA snapshot listing exceeds limit');
  return entries
    .filter((entry) => entry.isFile() && !entry.isSymbolicLink())
    .map((entry) => entry.name.match(SNAPSHOT_NAME)?.[1])
    .filter(Boolean)
    .sort();
}
