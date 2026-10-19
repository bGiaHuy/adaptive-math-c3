import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EnglishService } from './english.service';

@ApiTags('English learning')
@Controller('english')
export class EnglishController {
  constructor(private readonly english: EnglishService) {}

  @Get('topics')
  topics() { return this.english.topics(); }

  @Get('lessons/:id')
  lesson(@Param('id') id: string) { return this.english.lesson(id); }

  @Post('lessons/:id/submit')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  submit(@Param('id') id: string, @CurrentUser('id') studentId: string, @Body() body: unknown) {
    return this.english.submit(id, studentId, body);
  }

  @Get('progress')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  progress(@CurrentUser('id') studentId: string) { return this.english.progress(studentId); }

  @Get('placement')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  placement() { return this.english.placementQuestions(); }

  @Get('placement/result')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  placementResult(@CurrentUser('id') studentId: string) { return this.english.placementResult(studentId); }

  @Post('placement')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  submitPlacement(@CurrentUser('id') studentId: string, @Body() body: unknown) {
    return this.english.submitPlacement(studentId, body);
  }

  @Post('import')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_AUTHOR)
  import(
    @Body() body: unknown,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole
  ) {
    return this.english.importBatch(body, role, userId);
  }

  @Get('admin/lessons')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_REVIEWER)
  adminLessons(@Query('status') status?: 'all' | 'published' | 'draft') {
    return this.english.adminLessons(status);
  }

  @Post('lessons/:id/review')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_REVIEWER)
  reviewLesson(
    @Param('id') id: string,
    @CurrentUser('id') reviewerId: string,
    @Body() body: { published: boolean; note?: string }
  ) {
    return this.english.reviewLesson(id, reviewerId, body);
  }

  @Get('my-assignments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  myAssignments(@CurrentUser('id') studentId: string) { return this.english.myAssignments(studentId); }

  @Get('classes/:classId/assignments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  classAssignments(@CurrentUser('id') teacherId: string, @Param('classId') classId: string) {
    return this.english.classAssignments(teacherId, classId);
  }

  @Post('classes/:classId/assignments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  assignLesson(@CurrentUser('id') teacherId: string, @Param('classId') classId: string, @Body() body: unknown) {
    return this.english.assignLesson(teacherId, classId, body);
  }

  @Delete('classes/:classId/assignments/:assignmentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  removeAssignment(@CurrentUser('id') teacherId: string, @Param('classId') classId: string,
    @Param('assignmentId') assignmentId: string) {
    return this.english.removeAssignment(teacherId, classId, assignmentId);
  }
}
