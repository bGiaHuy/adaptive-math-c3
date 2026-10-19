import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { getSessionCookieName } from './session-cookie';

function extractClientIp(req: Request): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim().length > 0) {
    return xff.split(',')[0].trim();
  }
  return req.ip || 'Unknown';
}

@ApiTags('Authentication & Identity')
@Controller('auth')
export class AuthController {
  private readonly isProd = process.env.NODE_ENV === 'production';
  private readonly cookieName = getSessionCookieName();

  constructor(private readonly authService: AuthService) {}

  private setSessionCookie(res: Response, token: string, expiresAt: Date) {
    const cookieOptions = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: (this.isProd ? 'none' : 'lax') as 'none' | 'lax',
      expires: expiresAt,
      path: '/'
    };

    res.cookie(this.cookieName, token, cookieOptions);
  }

  private clearSessionCookie(res: Response) {
    const clearOptions = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: (this.isProd ? 'none' : 'lax') as 'none' | 'lax',
      path: '/'
    };

    res.clearCookie(this.cookieName, clearOptions);
  }

  @Post('register/student')
  @ApiOperation({ summary: 'Đăng ký tài khoản học sinh mới' })
  @ApiResponse({ status: 201, description: 'Học sinh đăng ký thành công' })
  async registerStudent(@Body() dto: RegisterStudentDto) {
    return this.authService.registerStudent(dto);
  }

  @Post('register/teacher')
  @ApiOperation({ summary: 'Đăng ký tài khoản giáo viên (chờ quản trị viên duyệt)' })
  @ApiResponse({ status: 201, description: 'Giáo viên nộp hồ sơ đăng ký thành công' })
  async registerTeacher(@Body() dto: RegisterTeacherDto) {
    return this.authService.registerTeacher(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập hệ thống (sinh cookie session an toàn)' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = extractClientIp(req);

    const result = await this.authService.login(dto, userAgent, ipAddress);

    this.setSessionCookie(res, result.sessionToken, result.expiresAt);

    return {
      message: 'Đăng nhập thành công',
      user: result.user
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Lấy thông tin tài khoản và vai trò của phiên hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin tài khoản' })
  async getCurrentUser(@CurrentUser() user: any) {
    return {
      user
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Đăng xuất phiên hiện tại' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async logout(
    @Req() req: Request & { sessionToken?: string; user?: any },
    @Res({ passthrough: true }) res: Response
  ) {
    const ipAddress = extractClientIp(req);
    if (req.sessionToken) {
      await this.authService.logout(req.sessionToken, req.user?.id, ipAddress);
    }
    this.clearSessionCookie(res);

    return {
      message: 'Đăng xuất thành công'
    };
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Đăng xuất tất cả các phiên đăng nhập của người dùng' })
  @ApiResponse({ status: 200, description: 'Toàn bộ phiên đã bị thu hồi' })
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logoutAll(userId);
    this.clearSessionCookie(res);

    return {
      message: 'Toàn bộ các phiên đăng nhập đã được hủy'
    };
  }

  @Get('sessions')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Liệt kê các phiên đăng nhập còn hiệu lực' })
  async listSessions(
    @CurrentUser('id') userId: string,
    @Req() req: Request & { sessionToken?: string }
  ) {
    return {
      sessions: await this.authService.listSessions(userId, req.sessionToken)
    };
  }

  @Post('sessions/:sessionId/revoke')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Thu hồi một phiên đăng nhập thuộc tài khoản hiện tại' })
  async revokeSession(
    @CurrentUser('id') userId: string,
    @Param('sessionId') sessionId: string,
    @Req() req: Request & { sessionToken?: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const ipAddress = extractClientIp(req);
    const sessions = await this.authService.listSessions(userId, req.sessionToken);
    const target = sessions.find((session) => session.id === sessionId);
    await this.authService.revokeSession(userId, sessionId, ipAddress);
    if (target?.isCurrent) this.clearSessionCookie(res);
    return { message: 'Phiên đăng nhập đã được thu hồi.' };
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản hiện tại' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.changePassword(userId, dto);
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = extractClientIp(req);
    const newSession = await this.authService.createSessionForUser(userId, userAgent, ipAddress);
    this.setSessionCookie(res, newSession.sessionToken, newSession.expiresAt);
    return {
      ...result,
      message: 'Đổi mật khẩu thành công. Các phiên đăng nhập trên thiết bị khác đã được thu hồi an toàn.'
    };
  }

  @Put('teacher-profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin và nộp lại hồ sơ giáo viên để duyệt' })
  @ApiResponse({ status: 200, description: 'Hồ sơ đã được nộp lại thành công' })
  async updateTeacherProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateTeacherProfileDto
  ) {
    return this.authService.updateTeacherProfile(userId, dto);
  }
}
