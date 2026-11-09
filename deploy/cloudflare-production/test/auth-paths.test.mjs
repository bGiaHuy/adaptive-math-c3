import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyChallenge } from '../challenge.mjs';
import { edgeLimit } from '../security.mjs';

const base = 'https://adaptive-math-c3.adaptive-learning-c3.workers.dev';
for (const path of ['/api/v1/auth/login', '/api/v1/auth/login/', '/api/v1/AUTH/LOGIN?x=1', '/API/v1/auth/login']) {
  test(`Turnstile and login rate limits protect equivalent route ${path}`, async () => {
    const request = new Request(base + path, { method: 'POST', headers: { 'cf-connecting-ip': '192.0.2.1' } });
    const response = await verifyChallenge(request, { TURNSTILE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'fixture' }, () => assert.fail('no token to verify'));
    assert.equal(response?.status, 403);
    const groups = [];
    const limit = group => ({ limit: async () => { groups.push(group); return { success: false }; } });
    const denied = await edgeLimit(request, { EDGE_SECURITY_ENABLED: 'true', EDGE_API_LIMITER: limit('api'), EDGE_AUTH_LIMITER: limit('login') });
    assert.equal(denied.status, 429);
    assert.deepEqual(groups, ['login']);
  });
}

test('registration aliases require verification without consuming a token or retrying the backend', async () => {
  for (const path of ['/api/v1/auth/register/student/', '/api/v1/AUTH/REGISTER/TEACHER']) {
    const request = new Request(base + path, { method: 'POST' });
    assert.equal((await verifyChallenge(request, { TURNSTILE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'fixture' })).status, 403);
  }
});

test('server rejects an invalid token and preserves hostname/action validation', async () => {
  const request = new Request(base + '/api/v1/auth/login/', { method: 'POST', headers: { 'x-cf-turnstile-token': 'fixture-token' } });
  for (const result of [{ success: false }, { success: true, hostname: 'foreign.invalid', action: 'auth' }, { success: true, hostname: new URL(base).hostname, action: 'register' }]) {
    assert.equal((await verifyChallenge(request, { TURNSTILE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'fixture' }, async () => Response.json(result))).status, 403);
  }
  assert.equal(await verifyChallenge(request, { TURNSTILE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'fixture' }, async () => Response.json({ success: true, hostname: new URL(base).hostname, action: 'auth' })), null);
});
