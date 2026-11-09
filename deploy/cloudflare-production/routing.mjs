import { edgeLimit, apiResponse } from './security.mjs';
import { publicChallengeConfig, verifyChallenge } from './challenge.mjs';
import { assetImage } from './asset-images.mjs';
import { requestPath } from './request-path.mjs';

export async function route(request, env, ctx) {
  const url = new URL(request.url);
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return new Response(null, {
      status: 308,
      headers: { location: url.toString(), 'cache-control': 'no-store' },
    });
  }
  const pathname = requestPath(request);
  if (pathname === '/api/security/config' && request.method === 'GET')
    return apiResponse(publicChallengeConfig(env), env);
  // Keep the complete Request and Response, including cookies and SSE bodies.
  // A single instance preserves existing process-local limits during the pilot.
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    const denied = await edgeLimit(request, env);
    if (denied) return apiResponse(denied, env);
    const rejected = await verifyChallenge(request, env);
    if (rejected) return apiResponse(rejected, env);
    return apiResponse(
      await env.API.getByName(env.API_INSTANCE_KEY || 'primary').fetch(request),
      env,
    );
  }
  const image = await assetImage(request, env, ctx);
  return image || env.ASSETS.fetch(request);
}

export function containerEnvironment(env) {
  const configured = JSON.parse(env.APP_ENV_JSON || '{}');
  for (const key of ['GOOGLE_AUTH_ENABLED', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI']) {
    if (typeof env[key] === 'string') configured[key] = env[key];
  }
  for (const [key, value] of Object.entries(configured)) {
    if (!/^[A-Z][A-Z0-9_]*$/.test(key) || typeof value !== 'string')
      throw Error('Invalid runtime environment.');
  }
  if (
    !configured.DATABASE_URL ||
    !configured.SESSION_SECRET ||
    !configured.SESSION_COOKIE_NAME?.startsWith('__Host-')
  ) {
    throw Error('Production secrets must be provisioned before starting the API.');
  }
  if (!configured.WEB_URL?.startsWith('https://'))
    throw Error('A production HTTPS web origin is required.');
  return { ...configured, NODE_ENV: 'production', PORT: '4000', MATH_PROJECT_ROOT: '/app' };
}
