export function apiResponse(response) {
  const secured = new Response(response.body, response);
  const noTransform = /(?:^|,)\s*no-transform\s*(?:,|$)/i.test(response.headers.get('cache-control') || '');
  secured.headers.set('cache-control', 'private, no-store' + (noTransform ? ', no-transform' : ''));
  secured.headers.set('cdn-cache-control', 'no-store');
  secured.headers.set('x-content-type-options', 'nosniff');
  secured.headers.set('strict-transport-security', 'max-age=31536000');
  return secured;
}

export async function authRateLimit(request, env) {
  const path = new URL(request.url).pathname.toLowerCase().replace(/\/+$/, '');
  if (request.method !== 'POST' || ![
    '/api/v1/auth/login', '/api/v1/auth/register/student', '/api/v1/auth/register/teacher'
  ].includes(path)) return null;
  // Cloudflare supplies this header. A generous coarse limit accommodates school NATs;
  // the API retains its existing per-user limits and authentication checks.
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) return null;
  const { success } = await env.AUTH_RATE_LIMITER.limit({ key: `auth:${ip}` });
  if (success) return null;
  return Response.json({
    code: 'RATE_LIMITED', message: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.',
    requestId: request.headers.get('x-request-id') || crypto.randomUUID(),
    timestamp: new Date().toISOString()
  }, { status: 429, headers: { 'retry-after': '60' } });
}
