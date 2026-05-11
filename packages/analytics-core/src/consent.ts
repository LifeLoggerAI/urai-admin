import type { ConsentCategory, ConsentSnapshot } from './schemas';

export const REQUIRED_INGEST_CONSENT_CATEGORIES: ConsentCategory[] = ['necessary', 'product_analytics'];

export function hasConsentCategory(consent: ConsentSnapshot, category: ConsentCategory): boolean {
  return consent.granted && consent.categories.includes(category);
}

export function assertAnalyticsConsent(consent: ConsentSnapshot): { ok: true } | { ok: false; reason: string } {
  if (!consent.granted) {
    return { ok: false, reason: 'consent_not_granted' };
  }
  for (const category of REQUIRED_INGEST_CONSENT_CATEGORIES) {
    if (!consent.categories.includes(category)) {
      return { ok: false, reason: `missing_${category}_consent` };
    }
  }
  return { ok: true };
}

export function consentSnapshotForNecessaryOnly(policyVersion = 'v1'): ConsentSnapshot {
  return {
    granted: true,
    categories: ['necessary'],
    policyVersion,
    capturedAt: new Date().toISOString()
  };
}
