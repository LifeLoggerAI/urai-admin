/**
 * R1460 REVIEW-ONLY caller boundary for the EXISTING InstitutionalMissionCoordination.
 *
 * No public endpoint, scheduler, credential issuer, IAM grant, Firestore bootstrap,
 * persistence, or private-memory access is provided here.
 * Only trusted server code may supply verifyCredential and credential.
 * A caller-provided actorId must NEVER be passed through this boundary.
 */
import type { Firestore } from 'firebase-admin/firestore';
import {
  InstitutionalMissionCoordination,
  type MissionAction,
} from './institutionalMissionCoordination';

const WORKER = new Set<MissionAction>([
  'READ', 'CLAIM', 'HEARTBEAT', 'SUBMIT_EVIDENCE',
]);
const REVIEWER = new Set<MissionAction>(['READ', 'VERIFY']);

export type MissionSessionRole = 'WORKER' | 'REVIEWER';
export interface VerifiedMissionPrincipal {
  subject: string;
  issuer: string;
  audience: string;
  tenant: string;
  role: MissionSessionRole;
  issuedAtMs: number;
  notBeforeMs: number;
  expiresAtMs: number;
  taskIds: readonly string[];
}

export interface MissionBoundaryOptions<TCredential> {
  db: Firestore;
  credential: TCredential;
  // REQUIRED: trusted server-side verifier, not user-provided JWT payload parsing.
  // Must verify signatures, issuer keys, revocation, and workload binding.
  verifyCredential: (credential: TCredential) => Promise<VerifiedMissionPrincipal | null>;
  issuer: string;
  audience: string;
  tenant: string;
  now?: () => number;
}

const idPattern = /^[a-z][a-z0-9_-]{3,95}$/;
function validPrincipal(
  p: VerifiedMissionPrincipal | null,
  opts: MissionBoundaryOptions<unknown>,
): p is VerifiedMissionPrincipal {
  if (!p || typeof p !== 'object' ||
      p.issuer !== opts.issuer || p.audience !== opts.audience ||
      p.tenant !== opts.tenant || !idPattern.test(p.subject) ||
      (p.role !== 'WORKER' && p.role !== 'REVIEWER') ||
      !Array.isArray(p.taskIds) || p.taskIds.length === 0 ||
      p.taskIds.length > 16 || !p.taskIds.every(x => typeof x === 'string' && idPattern.test(x)) ||
      new Set(p.taskIds).size !== p.taskIds.length ||
      !Number.isSafeInteger(p.issuedAtMs) || !Number.isSafeInteger(p.notBeforeMs) ||
      !Number.isSafeInteger(p.expiresAtMs)) return false;
  const now = opts.now ? opts.now() : Date.now();
  return Number.isSafeInteger(now) && p.issuedAtMs <= now &&
    p.notBeforeMs <= now && p.expiresAtMs > now &&
    p.expiresAtMs - p.issuedAtMs <= 3_600_000;
}

/**
 * One non-privileged session. Reverify on every operation so revoked/expired
 * credentials fail closed even after a successful earlier read/claim.
 */
export async function createMissionSession<TCredential>(
  opts: MissionBoundaryOptions<TCredential>,
) {

  if (!opts || typeof opts.verifyCredential !== 'function' ||
      typeof opts.issuer !== 'string' || !opts.issuer ||
      typeof opts.audience !== 'string' || !opts.audience ||
      typeof opts.tenant !== 'string' || !opts.tenant) {
    throw new Error('DENY: trusted verifier configuration required');
  }
  // The credential is opaque. No caller-supplied actorId is accepted.
  const check = async (): Promise<VerifiedMissionPrincipal> => {
    let verified: VerifiedMissionPrincipal | null;
    try { verified = await opts.verifyCredential(opts.credential); }
    catch { throw new Error('DENY: trusted identity verification failed'); }
    if (!validPrincipal(verified, opts as MissionBoundaryOptions<unknown>)) {
      throw new Error('DENY: invalid or expired workload principal');
    }
    return verified;
  };
  const initial = await check();
  const subject = initial.subject;
  const role = initial.role;
  const permit = async ({ actorId, action, taskId }: {
    actorId: string; action: MissionAction; taskId?: string;
  }): Promise<boolean> => {
    try {
      const p = await check();
      if (p.subject !== subject || p.role !== role || actorId !== subject ||
          (taskId && !p.taskIds.includes(taskId))) return false;
      const actions = p.role === 'WORKER' ? WORKER : REVIEWER;
      return actions.has(action);
    } catch { return false; }
  };
  const existing = new InstitutionalMissionCoordination(opts.db, permit);
  return Object.freeze({
    principalId: subject,
    readTask: (taskId: string) => existing.readTask(subject, taskId),
    claimTask: (taskId: string, seconds?: number) =>
      existing.claimTask(subject, taskId, seconds),
    heartbeat: (taskId: string, epoch: number, seconds?: number) =>
      existing.heartbeat(subject, taskId, epoch, seconds),
    submitEvidence: (taskId: string, epoch: number, url: string, sha256: string) =>
      existing.submitEvidence(subject, taskId, epoch, url, sha256),
    verifyEvidence: (taskId: string, revision: string, sha256: string, result: 'PASS' | 'FAIL') =>
      existing.verifyEvidence(subject, taskId, revision, sha256, result),
  });
}


