import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeRequest, containerRequest, runtimeEnvironment } from '../router.mjs';

test('API routing preserves cookies, origin, request id, body and streaming response', async () => {
  const request = new Request('https://c3.example/api/v1/student/review/tutor-stream?x=1', {
    method: 'POST', headers: { cookie: '__Host-am_c3_session=test', origin: 'https://c3.example', 'x-request-id': 'id' }, body: '{"reason":"test"}'
  });
  const response = new Response('event: done\ndata: {}\n\n', {
    headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache, no-transform', 'set-cookie': '__Host-am_c3_session=next; Secure; HttpOnly; Path=/' }
  });
  const env = { API: { getByName(name) { assert.equal(name, 'c3-api'); return { fetch(r) { assert.equal(r, request); return response; } }; } } };
  const result = await routeRequest(request, env);
  assert.equal(result.body, response.body);
  assert.equal(result.headers.get('set-cookie'), response.headers.get('set-cookie'));
  assert.equal(result.headers.get('cache-control'), 'private, no-store, no-transform');
  const forwarded = containerRequest(request);
  assert.equal(forwarded.url, 'http://container/api/v1/student/review/tutor-stream?x=1');
  assert.equal(forwarded.headers.get('origin'), 'https://c3.example');
  assert.equal(forwarded.headers.get('cookie'), '__Host-am_c3_session=test');
  assert.equal(forwarded.headers.get('x-request-id'), 'id');
  assert.equal(await forwarded.text(), '{"reason":"test"}');
});

test('static routes go to assets while every API path goes to the backend', async () => {
  for (const path of ['/', '/assets/a.js', '/api-other']) {
    const request = new Request('https://c3.example' + path);
    assert.equal(await routeRequest(request, { ASSETS: { fetch(r) { assert.equal(r, request); return 'asset'; } } }), 'asset');
  }
  const result = await routeRequest(new Request('https://c3.example/api'), { API: { getByName() { return { fetch() { return new Response('api'); } }; } } });
  assert.equal(await result.text(), 'api');
});

test('runtime secrets are explicitly passed, validated, and never include unrelated bindings', () => {
  const env = { DATABASE_URL: 'test', SESSION_SECRET: 'test', INVITE_CODE_HMAC_SECRET: 'test', WEB_URL: 'https://c3.example', UNRELATED_SECRET: 'private' };
  const runtime = runtimeEnvironment(env);
  assert.equal(runtime.DATABASE_URL, 'test');
  assert.equal(runtime.PORT, '8080');
  assert.equal(runtime.UNRELATED_SECRET, undefined);
  assert.throws(() => runtimeEnvironment({}), /Missing Cloudflare binding/);
});
