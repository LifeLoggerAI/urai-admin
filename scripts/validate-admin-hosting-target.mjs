#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ADMIN_HOSTING_TARGET = 'urai-admin-production';
const PROJECT = 'urai-4dc1d';
const forbiddenSites = new Set([PROJECT, 'urai-analytics', 'urai-b2bportal', 'urai-foundation', 'urai-jobs', 'urai-web-final']);

export function validateAdminHostingTarget({ cwd = process.cwd(), requireBound = false, hostingSite = process.env.URAI_ADMIN_HOSTING_SITE } = {}) {
  const config = JSON.parse(readFileSync(path.join(cwd, 'firebase.json'), 'utf8'));
  const rc = JSON.parse(readFileSync(path.join(cwd, '.firebaserc'), 'utf8'));
  const hosting = config.hosting;
  if (!hosting || Array.isArray(hosting) || hosting.target !== ADMIN_HOSTING_TARGET || 'site' in hosting) {
    throw new Error('Admin Hosting must use only the reviewed urai-admin-production symbolic target; default or concrete-site fallback is forbidden.');
  }
  if (hosting.source !== 'apps/urai-admin') throw new Error('Admin Hosting source must remain apps/urai-admin.');
  if (rc.projects?.default !== PROJECT || rc.projects?.admin !== PROJECT) throw new Error('Admin Firebase project aliases must remain urai-4dc1d.');
  const binding = rc.targets?.[PROJECT]?.hosting?.[ADMIN_HOSTING_TARGET];
  const validSite = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(value) && !forbiddenSites.has(value);
  if (binding !== undefined && (!Array.isArray(binding) || binding.length !== 1 || !validSite(binding[0]))) {
    throw new Error('Admin Hosting binding must name exactly one dedicated Admin site and cannot name the primary or another estate site.');
  }
  if (requireBound && (!validSite(hostingSite) || !binding || binding[0] !== hostingSite)) {
    throw new Error('Admin Hosting remains unbound: require the protected URAI_ADMIN_HOSTING_SITE and the matching reviewed .firebaserc target binding before deployment or rollback.');
  }
  return { project: PROJECT, target: ADMIN_HOSTING_TARGET, bound: binding !== undefined };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    let cwd = process.cwd();
    let requireBound = false;
    for (let i = 2; i < process.argv.length; i++) {
      if (process.argv[i] === '--require-bound') requireBound = true;
      else if (process.argv[i] === '--cwd' && process.argv[i + 1]) cwd = path.resolve(process.argv[++i]);
      else throw new Error('Unsupported Admin Hosting boundary option.');
    }
    validateAdminHostingTarget({ cwd, requireBound });
    console.log('Admin Hosting boundary PASS: symbolic target only; protected provider-proven binding remains required for deployment.');
  } catch (error) {
    console.error('Admin Hosting boundary BLOCKED: ' + error.message);
    process.exitCode = 1;
  }
}
