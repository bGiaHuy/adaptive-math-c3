import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { UpdateMistakeDto } from './dto/update-mistake.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Student Experience & Competency')
@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @Get('activity')
  getActivity(@CurrentUser('id') studentId: string) { return this.studentService.getActivity(studentId); }

  @Get('profile')
  @ApiOperation({ summary: 'Lấy hồ sơ cá nhân và các chỉ số học tập của học sinh' })
  @ApiResponse({ status: 200, description: 'Thông tin hồ sơ học sinh' })
  async getProfile(@CurrentUser('id') studentId: string) {
    return this.studentService.getProfile(studentId);
  }

  @Patch('onboarding')
  @ApiOperation({ summary: 'Cập nhật thiết lập ban đầu (khối lớp, mục tiêu, thời gian học, ngày thi)' })
  @ApiResponse({ status: 200, description: 'Cập nhật onboarding thành công' })
  async updateOnboarding(
    @CurrentUser('id') studentId: string,
    @Body() dto: UpdateOnboardingDto
  ) {
    return this.studentService.updateOnboarding(studentId, dto);
  }

  @Get('mastery')
  @ApiOperation({ summary: 'Lấy bảng năng lực tổng quan và chi tiết từng kỹ năng' })
  @ApiResponse({ status: 200, description: 'Bảng năng lực học sinh' })
  async getMasteryOverview(@CurrentUser('id') studentId: string) {
    return this.studentService.getMasteryOverview(studentId);
  }

  @Get('learning-path')
  @ApiOperation({ summary: 'Lấy lộ trình học tập cá nhân hóa được thuật toán đề xuất' })
  @ApiResponse({ status: 200, description: 'Lộ trình học tập cá nhân hóa' })
  async getLearningPath(@CurrentUser('id') studentId: string) {
    return this.studentService.getLearningPath(studentId);
  }

  @Get('mistakes')
  @ApiOperation({ summary: 'Lấy danh sách các câu hỏi trong sổ tay lỗi sai' })
  @ApiQuery({ name: 'isMastered', required: false, type: Boolean, description: 'Lọc theo trạng thái đã thành thạo hay chưa' })
  @ApiResponse({ status: 200, description: 'Danh sách sổ tay lỗi sai' })
  async getMistakes(
    @CurrentUser('id') studentId: string,
    @Query('isMastered') isMastered?: string
  ) {
    const isMasteredBool = isMastered === undefined ? undefined : isMastered === 'true';
    return this.studentService.getMistakes(studentId, isMasteredBool);
  }

  @Patch('mistakes/:id')
  @ApiOperation({ summary: 'Cập nhật trạng thái thành thạo hoặc ghi chú cá nhân trong sổ tay lỗi sai' })
  @ApiResponse({ status: 200, description: 'Cập nhật lỗi sai thành công' })
  async updateMistake(
    @CurrentUser('id') studentId: string,
    @Param('id') mistakeId: string,
    @Body() dto: UpdateMistakeDto
  ) {
    return this.studentService.updateMistake(studentId, mistakeId, dto);
  }
}
