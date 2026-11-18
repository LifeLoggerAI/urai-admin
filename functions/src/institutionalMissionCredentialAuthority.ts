/**
 * R1488 REVIEW ONLY: No provider-validated workload identity integration exists.
 * Fail closed: callbacks alone cannot become trusted credential verifiers.
 * Do not enable until an independent reviewer certifies concrete issuer,
 * audience, JWKS or provider attestation, workload binding, and revocation.
 */
export function isApprovedMissionCredentialVerifier(_verifier:unknown): boolean {
  return false;
}
