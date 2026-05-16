import type { JsonValue } from './schemas';

export const DEFAULT_SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /passcode/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /authorization/i,
  /cookie/i,
  /ssn/i,
  /social[_-]?security/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
  /phone/i,
  /email/i,
  /address/i,
  /precise[_-]?location/i,
  /lat/i,
  /lng/i,
  /longitude/i,
  /latitude/i,
  /medical/i,
  /diagnosis/i,
  /therapy/i,
  /biometric/i,
  /voiceprint/i,
  /faceprint/i
];

export const REDACTED_VALUE = '[REDACTED]';

export interface RedactionResult<T = JsonValue> {
  value: T;
  redactedPaths: string[];
}

export function shouldRedactKey(key: string, patterns = DEFAULT_SENSITIVE_KEY_PATTERNS): boolean {
  return patterns.some((pattern) => pattern.test(key));
}

export function redactJsonValue<T extends JsonValue>(value: T, basePath = 'properties'): RedactionResult<T> {
  const redactedPaths: string[] = [];

  function redactInner(input: JsonValue, path: string): JsonValue {
    if (Array.isArray(input)) {
      return input.map((item, index) => redactInner(item, `${path}[${index}]`));
    }
    if (input && typeof input === 'object') {
      const output: Record<string, JsonValue> = {};
      for (const [key, nested] of Object.entries(input)) {
        const nestedPath = `${path}.${key}`;
        if (shouldRedactKey(key)) {
          output[key] = REDACTED_VALUE;
          redactedPaths.push(nestedPath);
        } else {
          output[key] = redactInner(nested, nestedPath);
        }
      }
      return output;
    }
    return input;
  }

  return { value: redactInner(value, basePath) as T, redactedPaths };
}

export function removeUndefinedProperties<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as T;
}
