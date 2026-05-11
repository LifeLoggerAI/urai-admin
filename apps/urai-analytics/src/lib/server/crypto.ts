import crypto from 'node:crypto';

export function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a, 'hex');
  const bBuffer = Buffer.from(b, 'hex');
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function hashApiKey(rawKey: string, salt = process.env.URAI_ANALYTICS_API_KEY_SALT ?? 'local-dev-salt'): string {
  return sha256Hex(`${salt}:${rawKey}`);
}

export function hashIp(value: string | null, salt = process.env.URAI_ANALYTICS_IP_HASH_SALT ?? 'local-dev-ip-salt'): string | undefined {
  if (!value) return undefined;
  return sha256Hex(`${salt}:${value}`);
}
