#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const rules = readFileSync('firestore.rules', 'utf8');
const failures = [];

const requiredSnippets = [
  "rules_version = '2'",
  'match /{document=**}',
  'allow read, write: if false',
  'function isOwnerOrAdmin()',
  'function isViewerOrAbove()',
  'match /adminUsers/{uid}',
  'match /adminAuditLogs/{logId}',
  'match /adminReleaseEvidence/{evidenceId}',
  'match /systemRegistry/{systemId}',
  'match /governanceEvidence/{evidenceId}',
  'allow update, delete: if false'
];

for (const snippet of requiredSnippets) {
  if (!rules.includes(snippet)) failures.push(`missing Firestore rules snippet: ${snippet}`);
}

const forbiddenBroadAllows = [
  /allow\s+read,\s*write:\s*if\s+true/,
  /allow\s+write:\s*if\s+isSignedIn\(\)/,
  /allow\s+read:\s*if\s+isSignedIn\(\)\s*;/
];

for (const pattern of forbiddenBroadAllows) {
  if (pattern.test(rules)) failures.push(`unsafe broad rule matched: ${pattern}`);
}

if (failures.length) {
  console.error('Firestore rules contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Firestore rules contract passed.');
