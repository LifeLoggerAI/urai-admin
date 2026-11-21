#!/usr/bin/env node
/**
 * R1653 offline-only human-review snapshot projector.
 * Usage: node scripts/export-founder-delivery-inbox.mjs SNAPSHOT.json
 * The input must be an authorized, already-exported JSON array of
 * {task, execution, verification} rows. This command does not connect to
 * provider APIs, retrieve artifacts, schedule work or notify the founder.
 */
import { readFileSync, statSync } from 'node:fs';
import { buildFounderDeliveryInbox } from './founder-delivery-inbox.mjs';

function main() {
  if (process.argv.length !== 3 || !process.argv[2] ||
      process.argv[2].startsWith('-')) {
    throw Error('usage: node scripts/export-founder-delivery-inbox.mjs SNAPSHOT.json');
  }
  const path = process.argv[2];
  const stat = statSync(path);
  if (!stat.isFile() || stat.size > 1024 * 1024 || stat.size === 0) {
    throw Error('DENY: snapshot must be a nonempty regular file <= 1 MiB');
  }
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  const projection = buildFounderDeliveryInbox(rows);
  process.stdout.write(JSON.stringify(projection, null, 2) + '\n');
}
try {
  main();
} catch (error) {
  process.stderr.write('Founder inbox export DENIED: ' + String(error.message) + '\n');
  process.exitCode = 2;
}
