import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { generateKeyPairSync, randomUUID, sign } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import {
  GOOGLE_FLOW_TTL_MS,
  googleCodeChallenge,
  newGoogleFlow,
  openGoogleFlow,
  sealGoogleFlow,
} from '../src/modules/auth/google-oauth-state';

const secret = 'test_google_flow_session_secret_over_32_characters';
describe('Google browser flow binding', () => {
  it('encrypts the verifier, binds state and expires after five minutes', () => {
    const flow = newGoogleFlow('student', undefined, 1000);
    const cookie = sealGoogleFlow(flow, secret);
    expect(cookie).not.toContain(flow.verifier);
    expect(openGoogleFlow(cookie, flow.state, secret, 1001)).toEqual(flow);
    expect(googleCodeChallenge(flow.verifier)).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(() => openGoogleFlow(cookie, 'wrong', secret, 1001)).toThrow('GOOGLE_FLOW_INVALID');
    expect(() => openGoogleFlow(cookie, flow.state, secret, 1000 + GOOGLE_FLOW_TTL_MS)).toThrow();
    expect(() => openGoogleFlow(cookie, flow.state, secret + 'other', 1001)).toThrow();
    expect(() =>
      openGoogleFlow(cookie.slice(0, 20) + 'x' + cookie.slice(21), flow.state, secret, 1001),
    ).toThrow();
  });
});

describe('Google auth with real ID-token cryptographic verification and isolated PostgreSQL', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let nextToken = '';
  const origin = 'https://google-auth.isolated.test';
  const clientId = 'c3-test.apps.googleusercontent.com';
  const key = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const codes = new Set<string>();
  const suffix = randomUUID().replaceAll('-', '');
  function token(nonce: string, overrides: Record<string, unknown> = {}) {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'isolated-key' })).toString(
      'base64url',
    );
    const payload = Buffer.from(
      JSON.stringify({
        iss: 'https://accounts.google.com',
        aud: clientId,
        iat: now - 1,
        exp: now + 600,
        sub: `subject-${suffix}`,
        email: `google-${suffix}@isolated.test`,
        email_verified: true,
        name: 'Google QA',
        nonce,
        ...overrides,
      }),
    ).toString('base64url');
    const body = `${header}.${payload}`;
    return `${body}.${sign('RSA-SHA256', Buffer.from(body), key.privateKey).toString('base64url')}`;
  }
  beforeAll(async () => {
    vi.stubEnv('GOOGLE_AUTH_ENABLED', 'true');
    vi.stubEnv('GOOGLE_CLIENT_ID', clientId);
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'isolated-client-secret');
    vi.stubEnv('GOOGLE_REDIRECT_URI', `${origin}/api/v1/auth/google/callback`);
    vi.stubEnv('WEB_URL', origin);
    vi.stubEnv('SESSION_COOKIE_NAME', 'am_session');
    vi.spyOn(OAuth2Client.prototype, 'getToken').mockImplementation((async (options: any) => {
      if (codes.has(options.code)) throw Error('Code already consumed');
      codes.add(options.code);
      expect(options.codeVerifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(options.redirect_uri).toBe(`${origin}/api/v1/auth/google/callback`);
      return { tokens: { id_token: nextToken } };
    }) as any);
    vi.spyOn(OAuth2Client.prototype, 'getFederatedSignonCertsAsync').mockResolvedValue({
      certs: { 'isolated-key': key.publicKey.export({ type: 'spki', format: 'pem' }).toString() },
      format: 'PEM',
    } as any);
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication(new ExpressAdapter());
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
    prisma = app.get(PrismaService);
  });
  afterAll(async () => {
    await app?.close();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  async function start(role = 'student', session?: string) {
    const r = request(app.getHttpServer()).get(
      `/api/v1/auth/google/${session ? 'link' : `start?role=${role}`}`,
    );
    if (session) r.set('Cookie', session).set('Referer', `${origin}/`);
    const response = await r.expect(303);
    const url = new URL(response.headers.location);
    expect(url.origin).toBe('https://accounts.google.com');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('scope')).toBe('openid email profile');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    const cookie = response.headers['set-cookie'][0].split(';')[0];
    return { cookie, state: url.searchParams.get('state')!, nonce: url.searchParams.get('nonce')! };
  }
  async function finish(
    flow: Awaited<ReturnType<typeof start>>,
    claims = {},
    status = 303,
    session?: string,
  ) {
    nextToken = token(flow.nonce, claims);
    return request(app.getHttpServer())
      .get('/api/v1/auth/google/callback')
      .query({ code: randomUUID(), state: flow.state })
      .set('Cookie', [flow.cookie, ...(session ? [session] : [])].join('; '))
      .expect(status);
  }
  const sessionCookie = (r: any) =>
    r.headers['set-cookie'].find((c: string) => c.startsWith('am_session=')).split(';')[0];

  it('creates a student, issues the existing session cookie and keeps provider identity private', async () => {
    const response = await finish(await start());
    expect(response.headers.location).toBe(origin);
    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', sessionCookie(response))
      .expect(200);
    expect(me.body.user.role).toBe('STUDENT');
    expect(me.body.user.studentProfile.grade).toBe(10);
    expect(me.body.user.googleSubject).toBeUndefined();
    expect(me.body.user.externalIdentities).toBeUndefined();
    expect(me.body.user.passwordHash).toBeUndefined();
  });

  it('rejects audience, issuer, expiry, nonce, missing subject and unverified email without writes', async () => {
    const before = await prisma.session.count();
    for (const claims of [
      { aud: 'foreign-client' },
      { iss: 'https://foreign.invalid' },
      { exp: Math.floor(Date.now() / 1000) - 3600 },
      { nonce: 'wrong' },
      { sub: '' },
      { email_verified: false },
    ]) {
      const response = await finish(await start(), claims, 400);
      expect(response.text).not.toContain(nextToken);
    }
    expect(await prisma.session.count()).toBe(before);
  });

  it('does not silently merge by email and links only after an authenticated owner initiates it', async () => {
    const email = `existing-${suffix}@isolated.test`,
      password = 'ExistingOwnerPassword!123';
    const registration = await request(app.getHttpServer())
      .post('/api/v1/auth/register/student')
      .send({ username: `owner_${suffix}`, email, fullName: 'Existing owner', password })
      .expect(201);
    const id = registration.body.id,
      sub = `linked-${suffix}`;
    const rejected = await finish(await start(), { email, sub }, 400);
    expect(rejected.text).toContain('đã có tài khoản');
    expect(
      await prisma.externalIdentity.findUnique({
        where: { userId_provider: { userId: id, provider: 'google' } },
      }),
    ).toBeNull();
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ identifier: email, password })
      .expect(200);
    const cookie = sessionCookie(login);
    await request(app.getHttpServer())
      .get('/api/v1/auth/google/link')
      .set('Cookie', cookie)
      .set('Referer', 'https://foreign.invalid/')
      .expect(403);
    await finish(await start('student', cookie), { email, sub }, 303, cookie);
    expect((await prisma.user.findUniqueOrThrow({ where: { id } })).role).toBe('STUDENT');
    const google = await finish(await start('teacher'), { email, sub });
    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', sessionCookie(google))
      .expect(200);
    expect(me.body.user.id).toBe(id);
    expect(me.body.user.role).toBe('STUDENT');
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ identifier: email, password })
      .expect(200);
  });

  it('preserves the existing teacher policy and rejects suspended Google accounts', async () => {
    const sub = `teacher-${suffix}`,
      email = `teacher-${suffix}@isolated.test`;
    const created = await finish(await start('teacher'), { sub, email });
    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', sessionCookie(created))
      .expect(200);
    expect(me.body.user.role).toBe('TEACHER');
    expect(me.body.user.teacherProfile.verificationStatus).toBe('VERIFIED');
    await prisma.user.update({ where: { id: me.body.user.id }, data: { status: 'SUSPENDED' } });
    const before = await prisma.session.count();
    await finish(await start(), { sub, email }, 400);
    expect(await prisma.session.count()).toBe(before);
    await request(app.getHttpServer()).get('/api/v1/auth/google/start?role=admin').expect(400);
  });

  it('rejects tampered browser state before exchanging the authorization code', async () => {
    const flow = await start();
    const before = codes.size;
    await request(app.getHttpServer())
      .get('/api/v1/auth/google/callback')
      .query({ code: 'unused', state: 'forged' })
      .set('Cookie', flow.cookie)
      .expect(400);
    expect(codes.size).toBe(before);
    vi.stubEnv('GOOGLE_AUTH_ENABLED', 'false');
    await request(app.getHttpServer()).get('/api/v1/auth/google/start').expect(503);
    vi.stubEnv('GOOGLE_AUTH_ENABLED', 'true');
  });

  it('rejects a tampered JWT signature and does not create a session', async () => {
    const flow = await start(),
      parts = token(flow.nonce).split('.');
    const bytes = Buffer.from(parts[2], 'base64url');
    bytes[0] ^= 1;
    nextToken = `${parts[0]}.${parts[1]}.${bytes.toString('base64url')}`;
    const before = await prisma.session.count();
    await request(app.getHttpServer())
      .get('/api/v1/auth/google/callback')
      .query({ code: randomUUID(), state: flow.state })
      .set('Cookie', flow.cookie)
      .expect(400);
    expect(await prisma.session.count()).toBe(before);
  });

  it('revocation between link start and callback prevents a new identity link', async () => {
    const email = `revoked-${suffix}@isolated.test`,
      password = 'ExistingOwnerPassword!123';
    const registration = await request(app.getHttpServer())
      .post('/api/v1/auth/register/student')
      .send({ username: `revoked_${suffix}`, email, fullName: 'Link owner', password })
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ identifier: email, password })
      .expect(200);
    const cookie = sessionCookie(login),
      flow = await start('student', cookie);
    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', cookie)
      .expect(200);
    await finish(flow, { sub: `revoked-${suffix}`, email }, 400, cookie);
    expect(
      await prisma.externalIdentity.findUnique({
        where: { userId_provider: { userId: registration.body.id, provider: 'google' } },
      }),
    ).toBeNull();
  });

  it('cannot link another account to an already owned Google subject; Google sessions use normal logout', async () => {
    const email = `other-owner-${suffix}@isolated.test`,
      password = 'ExistingOwnerPassword!123';
    const registration = await request(app.getHttpServer())
      .post('/api/v1/auth/register/student')
      .send({ username: `other_${suffix}`, email, fullName: 'Other owner', password })
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ identifier: email, password })
      .expect(200);
    const cookie = sessionCookie(login);
    await finish(await start('student', cookie), {}, 400, cookie);
    expect(
      await prisma.externalIdentity.findUnique({
        where: { userId_provider: { userId: registration.body.id, provider: 'google' } },
      }),
    ).toBeNull();
    const google = await finish(await start());
    const googleCookie = sessionCookie(google);
    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', googleCookie)
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', googleCookie)
      .expect(401);
  });
});
