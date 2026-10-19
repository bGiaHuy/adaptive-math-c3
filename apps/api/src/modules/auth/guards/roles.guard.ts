import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, TeacherVerificationStatus } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException({
        code: 'FORBIDDEN_ACCESS',
        message: 'Bạn không có quyền thực hiện hành động này.'
      });
    }

    // Special Check: If TEACHER role is required, Teacher Applicant cannot access!
    if (requiredRoles.includes(UserRole.TEACHER)) {
      if (user.role === UserRole.TEACHER_APPLICANT) {
        throw new ForbiddenException({
          code: 'TEACHER_NOT_VERIFIED',
          message: 'Hồ sơ giáo viên của bạn đang trong trạng thái chờ ban quản trị thẩm định.'
        });
      }

      if (user.role === UserRole.TEACHER && user.teacherProfile?.verificationStatus !== TeacherVerificationStatus.VERIFIED) {
        throw new ForbiddenException({
          code: 'TEACHER_VERIFICATION_REQUIRED',
          message: 'Tài khoản cần hoàn tất xác minh chuyên môn trước khi sử dụng tính năng này.'
        });
      }
    }

    // Role check
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException({
        code: 'FORBIDDEN_ROLE_ACCESS',
        message: `Tài khoản với vai trò ${user.role} không được phép truy cập chức năng này.`
      });
    }

    return true;
  }
}
