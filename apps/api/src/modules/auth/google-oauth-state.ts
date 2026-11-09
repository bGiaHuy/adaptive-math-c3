import {
  createCipheriv,
  createDecipheriv,
  createHash,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

export const GOOGLE_FLOW_TTL_MS = 5 * 60 * 1000;
export type GoogleFlow = {
  state: string;
  nonce: string;
  verifier: string;
  expiresAt: number;
  role: 'student' | 'teacher';
  link?: { userId: string; sessionHash: string };
};
const token = () => randomBytes(32).toString('base64url');
export function newGoogleFlow(
  role: GoogleFlow['role'],
  link?: GoogleFlow['link'],
  now = Date.now(),
): GoogleFlow {
  return {
    state: token(),
    nonce: token(),
    verifier: token(),
    expiresAt: now + GOOGLE_FLOW_TTL_MS,
    role,
    ...(link ? { link } : {}),
  };
}
export function googleCodeChallenge(verifier: string) {
  return createHash('sha256').update(verifier).digest('base64url');
}
export function equalOAuthValue(a: string, b: string) {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function key(secret: string) {
  if (!secret || secret.length < 32) throw Error('OAuth requires a configured session secret.');
  return Buffer.from(hkdfSync('sha256', secret, '', 'adaptive-math-c3-google-oauth-v1', 32));
}
export function sealGoogleFlow(flow: GoogleFlow, secret: string) {
  const iv = randomBytes(12),
    cipher = createCipheriv('aes-256-gcm', key(secret), iv);
  cipher.setAAD(Buffer.from('google-oauth-v1'));
  const bytes = Buffer.concat([cipher.update(JSON.stringify(flow)), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), bytes]).toString('base64url');
}
export function openGoogleFlow(
  cookie: string,
  state: string,
  secret: string,
  now = Date.now(),
): GoogleFlow {
  try {
    if (
      !cookie ||
      cookie.length > 3000 ||
      !/^[A-Za-z0-9_-]+$/.test(cookie) ||
      typeof state !== 'string'
    )
      throw Error();
    const bytes = Buffer.from(cookie, 'base64url');
    if (bytes.length < 29) throw Error();
    const decipher = createDecipheriv('aes-256-gcm', key(secret), bytes.subarray(0, 12));
    decipher.setAAD(Buffer.from('google-oauth-v1'));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const flow = JSON.parse(
      Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString(),
    ) as GoogleFlow;
    if (
      !(['state', 'nonce', 'verifier'] as const).every(
        (field) => typeof flow[field] === 'string' && /^[A-Za-z0-9_-]{43}$/.test(flow[field]),
      ) ||
      !Number.isSafeInteger(flow.expiresAt) ||
      flow.expiresAt <= now ||
      flow.expiresAt > now + GOOGLE_FLOW_TTL_MS ||
      !['student', 'teacher'].includes(flow.role) ||
      !equalOAuthValue(flow.state, state) ||
      (flow.link &&
        (typeof flow.link.userId !== 'string' || !/^[a-f0-9]{64}$/.test(flow.link.sessionHash)))
    )
      throw Error();
    return flow;
  } catch {
    throw Error('GOOGLE_FLOW_INVALID');
  }
}
