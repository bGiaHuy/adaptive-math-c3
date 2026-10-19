import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MathPracticeService } from './math-practice.service';
export class PracticeAnswerDto {
  @IsString() @IsNotEmpty() questionId: string;
  @IsString() @IsNotEmpty() answer: string;
  @IsInt() @Min(0) @Max(3600) timeSpentSeconds: number;
}
@Controller('student/practice')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class MathPracticeController {
  constructor(private readonly practice: MathPracticeService) {}
  @Get('active') active(@CurrentUser('id') id: string) { return this.practice.active(id); }
  @Post('start/:skillId') start(@CurrentUser('id') id: string, @Param('skillId') skillId: string) { return this.practice.start(id, skillId); }
  @Post(':sessionId/answer') answer(@CurrentUser('id') id: string, @Param('sessionId') sessionId: string, @Body() dto: PracticeAnswerDto) {
    return this.practice.answer(id, sessionId, dto.questionId, dto.answer, dto.timeSpentSeconds);
  }
  @Post(':sessionId/abandon') abandon(@CurrentUser('id') id: string, @Param('sessionId') sessionId: string) { return this.practice.abandon(id, sessionId); }
}
