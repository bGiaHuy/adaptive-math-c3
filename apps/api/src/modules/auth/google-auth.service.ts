import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client, CodeChallengeMethod } from 'google-auth-library';
import { randomBytes } from 'node:crypto';
import { UserRole, UserStatus } from '@prisma/client';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  equalOAuthValue,
  googleCodeChallenge,
  newGoogleFlow,
  openGoogleFlow,
  sealGoogleFlow,
  GoogleFlow,
} from './google-oauth-state';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  enabled() {
    return process.env.GOOGLE_AUTH_ENABLED === 'true';
  }
  ready() {
    try {
      this.configuration();
      return true;
    } catch {
      return false;
    }
  }
  async linkStatus(userId: string) {
    if (!this.ready()) return { linked: false };
    const identity = await this.prisma.externalIdentity.findUnique({
      where: { userId_provider: { userId, provider: 'google' } },
      select: { id: true },
    });
    return { linked: Boolean(identity) };
  }
  webOrigin() {
    return new URL(process.env.WEB_URL || 'http://127.0.0.1:34440').origin;
  }
  private configuration() {
    const {
      GOOGLE_CLIENT_ID: clientId,
      GOOGLE_CLIENT_SECRET: clientSecret,
      GOOGLE_REDIRECT_URI: redirectUri,
      SESSION_SECRET: secret,
    } = process.env;
    if (
      !this.enabled() ||
      !clientId ||
      !clientSecret ||
      !redirectUri ||
      !secret ||
      secret.length < 32
    ) {
      throw new ServiceUnavailableException({
        code: 'GOOGLE_AUTH_UNAVAILABLE',
        message: 'Đăng nhập Google chưa sẵn sàng.',
      });
    }
    const uri = new URL(redirectUri);
    if (
      uri.origin !== this.webOrigin() ||
      uri.pathname !== '/api/v1/auth/google/callback' ||
      uri.search ||
      uri.hash ||
      (process.env.NODE_ENV === 'production' && uri.protocol !== 'https:')
    )
      throw new ServiceUnavailableException('Google callback configuration is invalid.');
    return { clientId, clientSecret, redirectUri, secret };
  }
  protected client() {
    const config = this.configuration();
    return new OAuth2Client({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      transporterOptions: { timeout: 10000, retry: false },
    });
  }
  start(role: string, link?: GoogleFlow['link']) {
    if (!['student', 'teacher'].includes(role))
      throw new BadRequestException('Invalid registration role.');
    const config = this.configuration(),
      flow = newGoogleFlow(role as GoogleFlow['role'], link);
    return {
      cookie: sealGoogleFlow(flow, config.secret),
      url: this.client().generateAuthUrl({
        scope: ['openid', 'email', 'profile'],
        state: flow.state,
        nonce: flow.nonce,
        code_challenge: googleCodeChallenge(flow.verifier),
        code_challenge_method: CodeChallengeMethod.S256,
        access_type: 'online',
        prompt: 'select_account',
      }),
    };
  }
  // Auth owns provider network I/O, identity linking and account/audit writes.
  async finish(
    code: string,
    state: string,
    cookie: string,
    rawSession?: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const config = this.configuration();
    let flow: GoogleFlow;
    try {
      flow = openGoogleFlow(cookie, state, config.secret);
    } catch {
      throw new UnauthorizedException({
        code: 'GOOGLE_FLOW_INVALID',
        message: 'Phiên xác minh Google đã hết hạn hoặc không hợp lệ. Vui lòng bắt đầu lại.',
      });
    }
    if (typeof code !== 'string' || !code || code.length > 4096)
      throw new BadRequestException('Invalid Google authorization code.');
    let identity: { sub: string; email: string; name: string };
    try {
      const client = this.client();
      const { tokens } = await client.getToken({
        code,
        codeVerifier: flow.verifier,
        redirect_uri: config.redirectUri,
      });
      if (!tokens.id_token) throw Error();
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.clientId,
      });
      const payload = ticket.getPayload() as ReturnType<typeof ticket.getPayload> & {
        nonce?: string;
      };
      if (
        !payload ||
        typeof payload.sub !== 'string' ||
        !payload.sub ||
        payload.sub.length > 255 ||
        typeof payload.email !== 'string' ||
        payload.email.length > 320 ||
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email) ||
        payload.email_verified !== true ||
        typeof payload.nonce !== 'string' ||
        !equalOAuthValue(payload.nonce, flow.nonce)
      )
        throw Error();
      identity = {
        sub: payload.sub,
        email: payload.email.toLowerCase(),
        name: (payload.name || payload.email.split('@')[0]).slice(0, 100),
      };
    } catch {
      // Provider exceptions may contain credentials or authorization codes. Never expose/log them.
      throw new UnauthorizedException({
        code: 'GOOGLE_IDENTITY_REJECTED',
        message: 'Không xác minh được tài khoản Google. Vui lòng thử lại.',
      });
    }
    if (flow.link) {
      const current = rawSession ? await this.auth.validateSession(rawSession) : null;
      if (
        !current ||
        current.id !== flow.link.userId ||
        !equalOAuthValue(this.auth.hashSessionToken(rawSession!), flow.link.sessionHash)
      ) {
        throw new ForbiddenException({
          code: 'GOOGLE_LINK_SESSION_CHANGED',
          message: 'Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại trước khi liên kết Google.',
        });
      }
    }
    const randomPasswordHash = flow.link
      ? undefined
      : await this.auth.hashPassword(randomBytes(32).toString('base64url'));
    const user = await this.prisma.$transaction(async (tx) => {
      const existingIdentity = await tx.externalIdentity.findUnique({
        where: { provider_subject: { provider: 'google', subject: identity.sub } },
        include: { user: true },
      });
      const linked = existingIdentity?.user;
      if (flow.link) {
        await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${flow.link.userId} FOR NO KEY UPDATE`;
        const owner = await tx.user.findUniqueOrThrow({ where: { id: flow.link.userId } });
        await tx.$queryRaw`SELECT "id" FROM "Session" WHERE "tokenHash" = ${flow.link.sessionHash} FOR UPDATE`;
        const session = await tx.session.findUnique({
          where: { tokenHash: flow.link.sessionHash },
        });
        if (
          !session ||
          session.userId !== owner.id ||
          session.revokedAt ||
          session.expiresAt <= new Date() ||
          session.permissionVersion !== owner.permissionVersion
        ) {
          throw new ForbiddenException({
            code: 'GOOGLE_LINK_SESSION_CHANGED',
            message:
              'Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại trước khi liên kết Google.',
          });
        }
        const previous = await tx.externalIdentity.findUnique({
          where: { userId_provider: { userId: owner.id, provider: 'google' } },
        });
        if (
          owner.status !== UserStatus.ACTIVE ||
          (linked && linked.id !== owner.id) ||
          (previous && previous.subject !== identity.sub)
        ) {
          throw new ConflictException({
            code: 'GOOGLE_ACCOUNT_CONFLICT',
            message: 'Không thể liên kết tài khoản Google này.',
          });
        }
        await tx.externalIdentity.upsert({
          where: { userId_provider: { userId: owner.id, provider: 'google' } },
          create: { provider: 'google', subject: identity.sub, userId: owner.id },
          update: {},
        });
        const updated = await tx.user.update({
          where: { id: owner.id },
          data: {
            ...(owner.email?.toLowerCase() === identity.email
              ? { emailVerifiedAt: owner.emailVerifiedAt || new Date() }
              : {}),
          },
        });
        await tx.auditLog.create({
          data: {
            actorUserId: owner.id,
            action: 'GOOGLE_ACCOUNT_LINKED',
            targetEntity: 'User',
            targetEntityId: owner.id,
          },
        });
        return updated;
      }
      if (linked) return linked;
      const existingEmail = await tx.user.findFirst({
        where: { email: { equals: identity.email, mode: 'insensitive' } },
      });
      if (existingEmail)
        throw new ConflictException({
          code: 'GOOGLE_LINK_REQUIRED',
          message:
            'Email này đã có tài khoản. Hãy đăng nhập bằng mật khẩu rồi liên kết Google trong quản lý tài khoản.',
        });
      const teacher = flow.role === 'teacher';
      const created = await tx.user.create({
        data: {
          username: `google_${randomBytes(12).toString('hex')}`,
          email: identity.email,
          fullName: identity.name,
          passwordHash: randomPasswordHash!,
          emailVerifiedAt: new Date(),
          status: UserStatus.ACTIVE,
          externalIdentities: { create: { provider: 'google', subject: identity.sub } },
          role: teacher ? UserRole.TEACHER_APPLICANT : UserRole.STUDENT,
          ...(teacher
            ? { teacherProfile: { create: {} } }
            : {
                studentProfile: {
                  create: { grade: 10, targetGoal: 'Ôn thi cuối kỳ', dailyMinutes: 45 },
                },
              }),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: created.id,
          action: 'GOOGLE_ACCOUNT_CREATED',
          targetEntity: 'User',
          targetEntityId: created.id,
        },
      });
      return created;
    });
    if (user.status !== UserStatus.ACTIVE)
      throw new ForbiddenException({
        code: 'ACCOUNT_SUSPENDED',
        message: 'Tài khoản đã bị tạm khóa.',
      });
    if (flow.link) return { linked: true as const };
    return {
      linked: false as const,
      ...(await this.auth.completeGoogleLogin(user.id, userAgent, ipAddress)),
    };
  }
}
