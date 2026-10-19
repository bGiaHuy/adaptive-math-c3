import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Auth and RBAC integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const suffix = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const username = `student_${suffix}`.slice(0, 30);
  const email = `${suffix}@test.adaptivemath.local`;
  let userId: string | undefined;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.SESSION_COOKIE_NAME = 'am_session';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication(new ExpressAdapter());
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    }
    await app.close();
  });

  it('creates a cookie session, enforces RBAC, and invalidates stale permissions', async () => {
    // 1. Register student
    const registration = await request(app.getHttpServer())
      .post('/api/v1/auth/register/student')
      .send({ username, email, fullName: 'Học sinh kiểm thử', password: 'P@ssword123!' })
      .expect(201);
    userId = registration.body.id;

    // 2. Login
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ identifier: username, password: 'P@ssword123!' })
      .expect(200);

    expect(login.body.sessionToken).toBeUndefined();
    expect(login.body.user.passwordHash).toBeUndefined();
    expect(login.headers['set-cookie']?.[0]).toContain('am_session=');
    expect(login.headers['set-cookie']?.[0]).toContain('HttpOnly');
    expect(login.headers['set-cookie']?.[0]).toContain('SameSite=Lax');

    const cookie = login.headers['set-cookie'][0].split(';')[0];

    // 3. /auth/me returns student profile
    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(200);
    expect(me.body.user.id).toBe(userId);
    expect(me.body.user.role).toBe('STUDENT');

    // 4. RBAC check: Student calling Teacher-only endpoint (create classroom) is blocked with 403
    await request(app.getHttpServer())
      .post('/api/v1/classrooms')
      .set('Cookie', cookie)
      .send({ name: 'Lớp học cấm học sinh tạo', grade: 9 })
      .expect(403);

    // 5. RBAC check: Student calling Admin-only endpoint is blocked with 403
    await request(app.getHttpServer())
      .get('/api/v1/admin/overview')
      .set('Cookie', cookie)
      .expect(403);

    // 6. PermissionVersion increment invalidates active session
    await prisma.user.update({
      where: { id: userId },
      data: { permissionVersion: { increment: 1 } }
    });

    // 7. Request with old session returns 401 SESSION_EXPIRED
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(401);

    const sessions = await prisma.session.findMany({ where: { userId } });
    expect(sessions).toHaveLength(1);
    expect(sessions[0].revokedAt).not.toBeNull();
  });
});
