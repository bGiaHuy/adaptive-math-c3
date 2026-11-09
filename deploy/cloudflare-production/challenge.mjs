import { requestPath } from './request-path.mjs';

const paths = new Set([
  '/api/v1/auth/login',
  '/api/v1/auth/register/student',
  '/api/v1/auth/register/teacher',
]);

export function publicChallengeConfig(env) {
  const enabled = env.TURNSTILE_ENABLED === 'true';
  if (enabled && (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY)) {
    return Response.json(
      {
        code: 'SECURITY_CONFIGURATION_UNAVAILABLE',
        message: 'Xác minh bảo mật tạm thời chưa sẵn sàng.',
      },
      { status: 503 },
    );
  }
  return Response.json({
    turnstile: { enabled, ...(enabled ? { siteKey: env.TURNSTILE_SITE_KEY } : {}) },
  });
}

export async function verifyChallenge(request, env, transport = fetch) {
  if (
    env.TURNSTILE_ENABLED !== 'true' ||
    request.method !== 'POST' ||
    !paths.has(requestPath(request))
  )
    return null;
  const token = request.headers.get('x-cf-turnstile-token');
  const denied = () =>
    Response.json(
      {
        code: 'SECURITY_CHALLENGE_REQUIRED',
        message: 'Vui lòng hoàn tất xác minh bảo mật rồi thử lại.',
      },
      { status: 403 },
    );
  if (!env.TURNSTILE_SECRET_KEY)
    return Response.json(
      { code: 'SECURITY_UNAVAILABLE', message: 'Xác minh bảo mật tạm thời chưa sẵn sàng.' },
      { status: 503 },
    );
  if (!token || token.length > 2048) return denied();
  try {
    const response = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(request.headers.get('cf-connecting-ip')
          ? { remoteip: request.headers.get('cf-connecting-ip') }
          : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (
      !response.ok ||
      result.success !== true ||
      result.hostname !== new URL(request.url).hostname ||
      result.action !== 'auth'
    )
      return denied();
    return null;
  } catch {
    return Response.json(
      {
        code: 'SECURITY_UNAVAILABLE',
        message: 'Chưa kết nối được dịch vụ xác minh. Vui lòng thử lại.',
      },
      { status: 503 },
    );
  }
}
