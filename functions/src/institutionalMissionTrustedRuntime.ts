/**
 * R1488 review-only production-disabled composition root.
 *
 * There is no approved provider-backed workload identity verifier or two-host
 * identity-to-grant mapping. A trusted runtime cannot be opened safely yet.
 * This module deliberately does not accept an arbitrary verifyCredential callback.
 */
import type { Firestore } from 'firebase-admin/firestore';
export async function createTrustedMissionRuntime(_db:Firestore, _credential:unknown):Promise<never> {
  throw new Error('DENY: provider-verified workload identity and trusted grant binding not configured');
}
