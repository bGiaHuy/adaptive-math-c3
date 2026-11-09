import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runAuthChallenge } from '../src/lib/securityChallenge.js';

test('existing successful login does not load a challenge', async () => {
  assert.equal(await runAuthChallenge(async options => {
    assert.deepEqual(options, {});
    return 'session';
  }, () => assert.fail('unexpected challenge')), 'session');
});

test('edge rejection obtains a fresh token for registration and post-registration login', async () => {
  let issued = 0;
  const seen = [];
  for (const operation of ['register', 'login']) {
    let calls = 0;
    await runAuthChallenge(async options => {
      calls++;
      if (calls === 1) throw { status: 403, code: 'SECURITY_CHALLENGE_REQUIRED' };
      assert.equal(calls, 2);
      seen.push([operation, options.headers['x-cf-turnstile-token']]);
    }, async () => `fresh-${++issued}`);
  }
  assert.deepEqual(seen, [['register', 'fresh-1'], ['login', 'fresh-2']]);
});

test('network errors and invalid credentials never retry auth mutations', async () => {
  for (const error of [Error('network'), { status: 401, code: 'UNAUTHORIZED' }, { status: 403, code: 'FORBIDDEN' }]) {
    let calls = 0;
    await assert.rejects(runAuthChallenge(async () => { calls++; throw error; }, () => assert.fail('unexpected challenge')), e => e === error);
    assert.equal(calls, 1);
  }
});

test('cancelled or rejected token never causes another automatic attempt', async () => {
  let calls = 0;
  const rejection = { status: 403, code: 'SECURITY_CHALLENGE_REQUIRED' };
  await assert.rejects(runAuthChallenge(async () => { calls++; throw rejection; }, async () => ''), /Chưa hoàn tất/);
  assert.equal(calls, 1);
  calls = 0;
  await assert.rejects(runAuthChallenge(async () => { calls++; throw rejection; }, async () => 'expired'), e => e === rejection);
  assert.equal(calls, 2);
});
