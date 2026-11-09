import { requestPath } from './request-path.mjs';

const AUTH = new Set(['/api/v1/auth/login']);
const REGISTER = new Set(['/api/v1/auth/register/student', '/api/v1/auth/register/teacher']);
export const STRICT_AUTH_LIMITS = { login: 120, register: 60 };

async function privateGuardName(env, group, ip) {
  const secret = JSON.parse(env.APP_ENV_JSON || '{}').SESSION_SECRET;
  if (!secret) throw Error('Missing secret for private edge keys.');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const bytes = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, encoder.encode(`edge:${group}:${ip}`)),
  );
  return group + ':' + [...bytes].map((value) => value.toString(16).padStart(2, '0')).join('');
}

export async function edgeLimit(request, env) {
  if (env.EDGE_SECURITY_ENABLED !== 'true') return null;
  if (request.method === 'OPTIONS') return null;
  const pathname = requestPath(request);
  let group = 'api',
    binding = env.EDGE_API_LIMITER;
  if (request.method === 'POST' && AUTH.has(pathname)) {
    group = 'login';
    binding = env.EDGE_AUTH_LIMITER;
  } else if (request.method === 'POST' && REGISTER.has(pathname)) {
    group = 'register';
    binding = env.EDGE_REGISTER_LIMITER;
  } else if (
    request.method === 'POST' &&
    /\/student\/review\/(tutor|chat)(-stream)?$/.test(pathname)
  ) {
    group = 'ai';
    binding = env.EDGE_AI_LIMITER;
  }
  if (!binding) throw Error('Required edge rate-limiter binding is missing.');
  // Cloudflare supplies this header. Never trust client X-Forwarded-For here.
  const ip = request.headers.get('cf-connecting-ip') || 'unavailable';
  let { success } = await binding.limit({ key: `${group}:${ip}` });
  // Native counters are approximate. Sensitive forms also use one atomic SQLite
  // counter per private IP/group so bursts cannot evade distributed local counts.
  if (success && Object.hasOwn(STRICT_AUTH_LIMITS, group)) {
    if (!env.EDGE_AUTH_GUARD) throw Error('Required strict authentication edge guard is missing.');
    const name = await privateGuardName(env, group, ip);
    ({ success } = await env.EDGE_AUTH_GUARD.getByName(name).limit({ group }));
  }
  if (success) return null;
  const requestId = request.headers.get('cf-ray') || crypto.randomUUID();
  // Aggregate security events only: no IP, cookies, credentials, query or body.
  console.info(JSON.stringify({ event: 'edge_rate_limited', group, status: 429, requestId }));
  return Response.json(
    {
      code: 'EDGE_RATE_LIMITED',
      message: 'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau một phút.',
      requestId,
      timestamp: new Date().toISOString(),
    },
    {
      status: 429,
      headers: { 'retry-after': '60', 'cache-control': 'no-store, no-transform' },
    },
  );
}

export function apiResponse(response, env = {}) {
  const protectedResponse = new Response(response.body, response);
  protectedResponse.headers.set('cache-control', 'no-store, no-transform');
  protectedResponse.headers.set('x-content-type-options', 'nosniff');
  protectedResponse.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  protectedResponse.headers.set('strict-transport-security', 'max-age=31536000');
  protectedResponse.headers.set(
    'x-edge-security',
    env.EDGE_SECURITY_ENABLED === 'true' ? 'enabled' : 'disabled',
  );
  return protectedResponse;
}
