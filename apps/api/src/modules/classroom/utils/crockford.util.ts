import * as crypto from 'crypto';

// Crockford's Base32 alphabet (excludes I, L, O, U)
const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Generate a random 8-character Crockford Base32 code
 * e.g. "KTR2QX79"
 */
export function generateCrockfordCode(length: number = 8): string {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CROCKFORD_ALPHABET[bytes[i] % CROCKFORD_ALPHABET.length];
  }
  return result;
}

/**
 * Normalize Crockford code:
 * - uppercase
 * - replace O with 0
 * - replace I, L with 1
 * - strip hyphens and spaces
 */
export function normalizeCrockfordCode(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1');
}

/**
 * Hash Crockford code with HMAC-SHA256
 */
export function hashInviteCode(code: string, secret?: string): string {
  const hmacKey = secret || process.env.INVITE_CODE_HMAC_SECRET || 'adaptivemath_dev_invite_code_hmac_secret_key_32_chars';
  const normalized = normalizeCrockfordCode(code);
  return crypto.createHmac('sha256', hmacKey).update(normalized).digest('hex');
}
