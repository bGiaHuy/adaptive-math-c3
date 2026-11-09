import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

// This creates a permanent QA student. Run only against a disposable restored clone.
if (process.env.C3_SMOKE_ALLOW_WRITES !== 'isolated-clone') {
  throw new Error('Set C3_SMOKE_ALLOW_WRITES=isolated-clone only for a disposable database clone.');
}
const base = process.env.C3_SMOKE_URL || 'http://127.0.0.1:8080';
const origin = process.env.C3_SMOKE_ORIGIN || 'https://c3-preview.invalid';
const results = [];
async function request(path, status, options = {}) {
  const response = await fetch(`${base}/api/v1${path}`, {
    ...options, signal: AbortSignal.timeout(15000)
  });
  assert.equal(response.status, status, `${options.method || 'GET'} ${path}`);
  results.push({ path, method: options.method || 'GET', status });
  return response;
}
const health = await (await request('/health', 200)).json();
assert.equal(health.status, 'ok');
assert.equal(health.database, 'connected');
await request('/auth/me', 401);
const username = `cfqa_${randomUUID().replaceAll('-', '').slice(0, 16)}`;
const password = `QA!${randomUUID()}`;
const post = body => ({ method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body) });
await request('/auth/register/student', 201, post({ fullName: 'Cloudflare isolated QA', username, password }));
const login = await request('/auth/login', 200, post({ identifier: username, password }));
const setCookie = login.headers.get('set-cookie');
assert.match(setCookie, /^__Host-/);
for (const flag of ['HttpOnly', 'Secure', 'Path=/', 'SameSite=None']) assert.ok(setCookie.includes(flag), flag);
const cookie = setCookie.split(';')[0];
const user = await (await request('/auth/me', 200, { headers: { cookie } })).json();
assert.equal(user.user.role, 'STUDENT');
const materials = await (await request('/curriculum/materials', 200, { headers: { cookie } })).json();
assert.ok(materials.items.length > 0);
await request('/curriculum/materials/bulk-review', 403, { headers: { cookie } });
await request('/auth/logout', 403, { method: 'POST', headers: { cookie, origin: 'https://untrusted.invalid' } });
await request('/auth/me', 200, { headers: { cookie } });
await request('/auth/logout', 200, { method: 'POST', headers: { cookie, origin } });
await request('/auth/me', 401, { headers: { cookie } });
console.log(JSON.stringify({ pass: true, base, origin, scope: 'isolated restored PostgreSQL; AI disabled', results }, null, 2));
