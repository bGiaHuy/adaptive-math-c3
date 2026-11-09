import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeRequest } from '../router.mjs';

test('auth flood stops before the backend; query/trailing slash and spoofed XFF cannot bypass', async () => {
  for (const path of ['/api/v1/auth/login', '/api/v1/auth/login/?x=1', '/api/v1/AUTH/LOGIN', '/api/v1/auth/register/student']) {
    let calls = 0;
    const response = await routeRequest(new Request('https://c3.example' + path, {
      method: 'POST', headers: { 'cf-connecting-ip': '192.0.2.3', 'x-forwarded-for': 'spoof' }
    }), {
      AUTH_RATE_LIMITER: { async limit({ key }) { assert.equal(key, 'auth:192.0.2.3'); return { success: false }; } },
      API: { getByName() { calls++; throw new Error('must not reach backend'); } }
    });
    assert.equal(calls, 0);
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '60');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal((await response.json()).code, 'RATE_LIMITED');
  }
});

test('successful auth forwards once; AI stream and OPTIONS do not use auth limiter', async () => {
  let limits = 0;
  let forwards = 0;
  const env = {
    AUTH_RATE_LIMITER: { async limit() { limits++; return { success: true }; } },
    API: { getByName() { return { fetch() { forwards++; return new Response('ok'); } }; } }
  };
  for (const [path, method] of [['auth/login', 'POST'], ['auth/login', 'OPTIONS'], ['student/review/tutor-stream', 'POST']]) {
    const result = await routeRequest(new Request('https://c3.example/api/v1/' + path, {
      method, headers: { 'cf-connecting-ip': '192.0.2.3' }
    }), env);
    assert.equal(result.status, 200);
  }
  assert.equal(limits, 1);
  assert.equal(forwards, 3);
});

test('deployment generation selects a fresh container without terminating the previous stream', async () => {
  let selected;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('event: text\ndata: {}\n\n')); } });
  const env = { API_INSTANCE: 'rotation-2', API: { getByName(name) { selected = name; return { fetch() { return new Response(stream, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache, no-transform' } }); } }; } } };
  const result = await routeRequest(new Request('https://c3.example/api/v1/student/review/tutor-stream', { method: 'POST' }), env);
  assert.equal(selected, 'c3-api-rotation-2');
  assert.equal(result.body, stream);
  assert.equal(result.body.locked, false);
  assert.equal(result.headers.get('cache-control'), 'private, no-store, no-transform');
  await result.body.cancel();
});
