import { Controller, ForbiddenException, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from './google-auth.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { getSessionCookieName } from './session-cookie';
import { GOOGLE_FLOW_TTL_MS } from './google-oauth-state';
import { trustedRequestOrigin, webOrigins } from '../../config/web-origins';

@Controller('auth')
export class GoogleAuthController {
  constructor(
    private readonly google: GoogleAuthService,
    private readonly auth: AuthService,
  ) {}
  private cookieName() {
    return process.env.NODE_ENV === 'production' ? '__Host-c3_google_oauth' : 'c3_google_oauth';
  }
  private cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: GOOGLE_FLOW_TTL_MS,
    };
  }

  @Get('google/config')
  config() {
    return { enabled: this.google.ready(), origin: this.google.webOrigin() };
  }

  @Get('google/status')
  @UseGuards(AuthGuard)
  async status(@CurrentUser('id') userId: string) {
    return this.google.linkStatus(userId);
  }

  @Get('google/start')
  start(@Query('role') role: string = 'student', @Res() res: Response) {
    const flow = this.google.start(role);
    res.setHeader('cache-control', 'no-store');
    res.cookie(this.cookieName(), flow.cookie, this.cookieOptions());
    return res.redirect(303, flow.url);
  }

  @Get('google/link')
  @UseGuards(AuthGuard)
  link(
    @Req() req: Request & { user?: { id: string }; sessionToken?: string },
    @Res() res: Response,
  ) {
    if (
      !req.user ||
      !req.sessionToken ||
      !trustedRequestOrigin(req.header('origin'), req.header('referer'), webOrigins())
    ) {
      throw new ForbiddenException({
        code: 'GOOGLE_LINK_ORIGIN_REJECTED',
        message: 'Hãy bắt đầu liên kết Google từ trang quản lý tài khoản.',
      });
    }
    const flow = this.google.start('student', {
      userId: req.user.id,
      sessionHash: this.auth.hashSessionToken(req.sessionToken),
    });
    res.setHeader('cache-control', 'no-store');
    res.cookie(this.cookieName(), flow.cookie, this.cookieOptions());
    return res.redirect(303, flow.url);
  }

  @Get('google/callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    res.setHeader('cache-control', 'private, no-store');
    res.setHeader('referrer-policy', 'no-referrer');
    const cookie = req.cookies?.[this.cookieName()];
    const { maxAge, ...clearOptions } = this.cookieOptions();
    res.clearCookie(this.cookieName(), clearOptions);
    try {
      if (error) throw Error('Provider cancelled');
      const result = await this.google.finish(
        code,
        state,
        cookie,
        req.cookies?.[getSessionCookieName()],
        req.header('user-agent'),
        req.ip,
      );
      if (result.linked === false)
        res.cookie(getSessionCookieName(), result.sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          expires: result.expiresAt,
          path: '/',
        });
      return res.redirect(303, this.google.webOrigin());
    } catch (failure) {
      const response = typeof failure?.getResponse === 'function' ? failure.getResponse() : null;
      const needsLink =
        response && typeof response === 'object' && response.code === 'GOOGLE_LINK_REQUIRED';
      const message = needsLink
        ? 'Email này đã có tài khoản. Hãy đăng nhập bằng mật khẩu, mở quản lý phiên đăng nhập và chọn liên kết Google.'
        : 'Chưa hoàn tất đăng nhập Google. Vui lòng quay lại và thử lại. Tài khoản, quyền và mật khẩu hiện có vẫn được giữ nguyên.';
      return res
        .status(400)
        .type('html')
        .send(
          `<!doctype html><html lang="vi"><meta charset="utf-8"><title>Đăng nhập Google</title><main><h1>Đăng nhập Google</h1><p>${message}</p><a href="${this.google.webOrigin()}">Quay lại Adaptive Math C3</a></main></html>`,
        );
    }
  }
}
