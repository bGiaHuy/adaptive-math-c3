import { apiResponse, authRateLimit } from './security.mjs';

// Bodies and cookies pass through without buffering SSE.
export async function routeRequest(request, env) {
  const path = new URL(request.url).pathname;
  if (path === '/api' || path.startsWith('/api/')) {
    const limited = await authRateLimit(request, env);
    const instance = env.API_INSTANCE ? `c3-api-${env.API_INSTANCE}` : 'c3-api';
    return apiResponse(limited || await env.API.getByName(instance).fetch(request));
  }
  return env.ASSETS.fetch(request);
}

export function containerRequest(request) {
  const url = new URL(request.url);
  url.protocol = 'http:';
  url.host = 'container';
  const forwarded = new Request(url, request);
  forwarded.headers.delete('host');
  return forwarded;
}

const keys = [
  'DATABASE_URL', 'SESSION_SECRET', 'SESSION_COOKIE_NAME', 'SESSION_TTL_SECONDS',
  'INVITE_CODE_HMAC_SECRET', 'WEB_URL', 'WEB_ALLOWED_ORIGINS',
  'AI_ENABLED', 'AI_PROVIDER', 'AI_MODEL', 'MATH_MWAPI_AUTH_TOKEN',
  'ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN',
  'AI_INPUT_USD_PER_MILLION', 'AI_OUTPUT_USD_PER_MILLION',
  'AI_LIFETIME_BUDGET_USD', 'AI_MONTHLY_BUDGET_USD', 'AI_DAILY_BUDGET_USD',
  'AI_USER_DAILY_BUDGET_USD', 'AI_USER_DAILY_REQUESTS',
  'AI_USER_REQUESTS_PER_MINUTE', 'AI_IP_REQUESTS_PER_MINUTE', 'AI_MAX_CONCURRENT_REQUESTS'
];

export function runtimeEnvironment(env) {
  const result = { NODE_ENV: 'production', PORT: '8080', MATH_PROJECT_ROOT: '/app' };
  for (const key of keys) if (typeof env[key] === 'string') result[key] = env[key];
  for (const key of ['DATABASE_URL', 'SESSION_SECRET', 'INVITE_CODE_HMAC_SECRET', 'WEB_URL']) {
    if (!result[key]) throw new Error(`Missing Cloudflare binding: ${key}`);
  }
  return result;
}
