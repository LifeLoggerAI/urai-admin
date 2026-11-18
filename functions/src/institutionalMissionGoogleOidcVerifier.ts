/**
 * R1494 REVIEW ONLY — provider-signed, owner-pinned identity verification.
 * NOT connected to the active runtime, not an IAM or launch authorization.
 * A token, worker request, or Pod configuration MUST NOT choose this policy.
 * A separately approved owner-controlled deployment must pin all policy fields.
 */
import { createPublicKey, verify as verifySignature } from 'node:crypto';

const GOOGLE_ISSUER = 'https://accounts.google.com';
const GOOGLE_JWKS = 'https://www.googleapis.com/oauth2/v3/certs';
const ID = /^[a-z][a-z0-9_-]{3,95}$/;
const SERVICE_ACCOUNT = /^[a-z0-9][a-z0-9._-]*@[a-z0-9][a-z0-9.-]*\.iam\.gserviceaccount\.com$/;
type Role = 'WORKER' | 'REVIEWER';
export type GoogleMissionIdentityPolicy = Readonly<{
  audience: string;
  serviceAccountEmail: string;
  googleSubject: string;
  actorId: string;
  tenant: string;
  role: Role;
  taskIds: readonly string[];
}>;
export type GoogleMissionPrincipal = Readonly<{
  subject: string; issuer: string; audience: string; tenant: string; role: Role;
  issuedAtMs: number; notBeforeMs: number; expiresAtMs: number; taskIds: readonly string[];
}>;
function deny(): never { throw new Error('DENY: independently trusted workload identity required'); }
function object(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function decoded(b64: string): Record<string, unknown> {
  if (typeof b64 !== 'string' || b64.length > 8192 || !/^[A-Za-z0-9_-]+$/.test(b64)) deny();
  let parsed: unknown;
  try { parsed = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8')); } catch { deny(); }
  if (!object(parsed)) deny();
  return parsed;
}
function validPolicy(p: GoogleMissionIdentityPolicy): void {
  if (!object(p) || typeof p.audience !== 'string' || p.audience.length < 12 ||
      p.audience.length > 512 || !SERVICE_ACCOUNT.test(p.serviceAccountEmail) ||
      typeof p.googleSubject !== 'string' || !/^\d{8,32}$/.test(p.googleSubject) ||
      !ID.test(p.actorId) || !ID.test(p.tenant) ||
      (p.role !== 'WORKER' && p.role !== 'REVIEWER') ||
      !Array.isArray(p.taskIds) || p.taskIds.length < 1 || p.taskIds.length > 16 ||
      !p.taskIds.every(v => typeof v === 'string' && ID.test(v)) ||
      new Set(p.taskIds).size !== p.taskIds.length) deny();
}
/**
 * Validates signature against Google's fixed public-key endpoint (never
 * worker-supplied), then binds token subject/email to the owner-pinned map.
 * No authority is derived from worker-provided role, task IDs, or actor IDs.
 * Per-action grant/revocation must still be checked in the Firestore transaction.
 */
export async function verifyGoogleMissionWorkloadToken(
  token: unknown, policy: GoogleMissionIdentityPolicy,
): Promise<GoogleMissionPrincipal> {
  validPolicy(policy);
  if (typeof token !== 'string' || token.length > 16384) deny();
  const parts = token.split('.');
  if (parts.length !== 3 || !parts.every(s => /^[A-Za-z0-9_-]+$/.test(s))) deny();
  const header = decoded(parts[0]), claims = decoded(parts[1]);
  if (header.alg !== 'RS256' || typeof header.kid !== 'string' ||
      header.kid.length < 4 || header.kid.length > 256 ||
      (header.typ !== undefined && header.typ !== 'JWT')) deny();
  const now = Math.floor(Date.now() / 1000);
  if (claims.iss !== GOOGLE_ISSUER || claims.aud !== policy.audience ||
      claims.sub !== policy.googleSubject || claims.email !== policy.serviceAccountEmail ||
      claims.email_verified !== true ||
      typeof claims.iat !== 'number' || !Number.isSafeInteger(claims.iat) ||
      typeof claims.exp !== 'number' || !Number.isSafeInteger(claims.exp) ||
      claims.iat > now || now - claims.iat > 900 ||
      claims.exp <= now || claims.exp <= claims.iat ||
      claims.exp - claims.iat > 3600 ||
      (claims.nbf !== undefined &&
        (typeof claims.nbf !== 'number' || !Number.isSafeInteger(claims.nbf) ||
         claims.nbf > now || claims.nbf >= claims.exp))) deny();
  // No arbitrary URL, certificate, key ID, or issuer supplied by the worker.
  let jwks: unknown;
  try {
    const response = await fetch(GOOGLE_JWKS, { redirect: 'error', signal: AbortSignal.timeout(4000) });
    if (!response.ok) deny();
    jwks = await response.json();
  } catch { deny(); }
  if (!object(jwks) || !Array.isArray(jwks.keys)) deny();
  const matches = jwks.keys.filter((key: unknown) =>
    object(key) && key.kid === header.kid && key.kty === 'RSA' &&
    key.alg === 'RS256' && (key.use === undefined || key.use === 'sig'));
  if (matches.length !== 1) deny();
  let good = false;
  try {
    const pub = createPublicKey({ key: matches[0] as import('node:crypto').JsonWebKey, format: 'jwk' });
    const signature = Buffer.from(parts[2], 'base64url');
    good = signature.length >= 128 && verifySignature(
      'RSA-SHA256', Buffer.from(parts[0] + '.' + parts[1]), pub, signature);
  } catch { deny(); }
  if (!good) deny();
  return Object.freeze({
    subject: policy.actorId, issuer: GOOGLE_ISSUER, audience: policy.audience,
    tenant: policy.tenant, role: policy.role,
    issuedAtMs: claims.iat * 1000,
    notBeforeMs: (typeof claims.nbf === 'number' ? claims.nbf : claims.iat) * 1000,
    expiresAtMs: claims.exp * 1000, taskIds: Object.freeze([...policy.taskIds]),
  });
}
