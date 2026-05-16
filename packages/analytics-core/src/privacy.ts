import { z } from 'zod';

export const PrivacyClassSchema = z.enum([
  'public',
  'internal',
  'customer',
  'personal',
  'sensitive',
  'health_adjacent',
  'passive_signal',
  'derived_ai_insight'
]);

export type PrivacyClass = z.infer<typeof PrivacyClassSchema>;

export const RetentionClassSchema = z.enum(['ephemeral_24h', 'short_30d', 'standard_13m', 'extended_36m', 'contractual']);
export type RetentionClass = z.infer<typeof RetentionClassSchema>;

export const PRIVACY_CLASS_DEFAULT_RETENTION: Record<PrivacyClass, RetentionClass> = {
  public: 'standard_13m',
  internal: 'standard_13m',
  customer: 'standard_13m',
  personal: 'short_30d',
  sensitive: 'short_30d',
  health_adjacent: 'short_30d',
  passive_signal: 'ephemeral_24h',
  derived_ai_insight: 'short_30d'
};

export function defaultRetentionForPrivacyClass(privacyClass: PrivacyClass): RetentionClass {
  return PRIVACY_CLASS_DEFAULT_RETENTION[privacyClass];
}

export function isHighRiskPrivacyClass(privacyClass: PrivacyClass): boolean {
  return privacyClass === 'sensitive' || privacyClass === 'health_adjacent' || privacyClass === 'passive_signal' || privacyClass === 'derived_ai_insight';
}
