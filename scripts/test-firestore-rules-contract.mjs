#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const rules = readFileSync('firestore.rules', 'utf8');
const failures = [];

const required = [
  "rules_version = '2'",
  "match /{document=**}",
  "allow read, write: if false",
  "request.auth.token.admin == true"
];

for (const item of required) {
  if (!rules.includes(item)) failures.push(`Missing required Firestore rule pattern: ${item}`);
}

const forbidden = [
  /allow\s+read,\s*write:\s*if\s+true/,
  /allow\s+write:\s*if\s+true/,
  /allow\s+read:\s*if\s+true/
];

for (const pattern of forbidden) {
  if (pattern.test(rules)) failures.push(`Unsafe Firestore rule pattern found: ${pattern}`);
}

if (failures.length) {
  console.error('Firestore rules contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: Firestore rules contract passed.');
