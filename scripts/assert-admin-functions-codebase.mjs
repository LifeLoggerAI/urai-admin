#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// REVIEW-ONLY PROPOSED namespace. Migration and live ownership require separate approval.
export const ADMIN_FUNCTIONS_CODEBASE = 'urai-admin-functions';

export function assertAdminFunctionsCodebase({ cwd = process.cwd() } = {}) {
  const config = JSON.parse(readFileSync(path.join(cwd, 'firebase.json'), 'utf8'));
  const entries = Array.isArray(config.functions) ? config.functions : [config.functions];
  if (entries.length !== 1 || !entries[0] || typeof entries[0] !== 'object') {
    throw new Error('Admin Functions must have exactly one dedicated codebase; shared default and multi-codebase deployments are HOLD.');
  }
  const selected = entries[0];
  if (selected.source !== 'functions' || selected.runtime !== 'nodejs22' || selected.codebase !== ADMIN_FUNCTIONS_CODEBASE) {
    throw new Error('Admin Functions codebase is not independently isolated: configured source must be functions, runtime nodejs22, proposed codebase urai-admin-functions. Current default codebase is HOLD pending approved migration.');
  }
  return { codebase: ADMIN_FUNCTIONS_CODEBASE, source: 'functions', runtime: 'nodejs22' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    let cwd = process.cwd();
    for (let i = 2; i < process.argv.length; i++) {
      if (process.argv[i] === '--cwd' && process.argv[i + 1]) cwd = path.resolve(process.argv[++i]);
      else throw new Error('Unsupported Admin Functions codebase guard option.');
    }
    const found = assertAdminFunctionsCodebase({ cwd });
    console.log(`Admin Functions codebase source PASS: ${found.codebase}; live provider ownership and migration still unverified.`);
  } catch (error) {
    console.error('Admin Functions deployment HOLD: ' + error.message);
    process.exitCode = 1;
  }
}
