import { Controller, Get, Param, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UserRole } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LearningMaterialsService } from './learning-materials.service';

@Controller('curriculum/materials')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.CONTENT_AUTHOR, UserRole.CONTENT_REVIEWER, UserRole.STUDENT)
export class LearningMaterialsController {
  constructor(private readonly materials: LearningMaterialsService) {}

  @Get()
  catalog() { const {items, preparedAt} = this.materials.catalog(); return {items, preparedAt}; }

  @Get('questions')
  questions() { return this.materials.questions(); }

  @Get('bulk-review')
  @Roles(UserRole.TEACHER,UserRole.ADMIN,UserRole.CONTENT_AUTHOR,UserRole.CONTENT_REVIEWER)
  bulkReview() { return this.materials.bulkReview(); }

  @Get('bulk-review/assets/:id')
  @Roles(UserRole.TEACHER,UserRole.ADMIN,UserRole.CONTENT_AUTHOR,UserRole.CONTENT_REVIEWER)
  bulkAsset(@Param('id') id: string,@Res() response: Response) {
    response.setHeader('Cache-Control','private, max-age=86400');
    response.sendFile(this.materials.bulkAsset(id));
  }

  @Get('questions/:id/images/:segment')
  questionImage(@Param('id') id: string, @Param('segment') segment: string, @Res() response: Response) {
    const file = this.materials.questionImage(id, Number(segment));
    response.setHeader('Cache-Control', 'private, max-age=86400');
    response.type('png').sendFile(file);
  }

  @Get(':id/file')
  file(@Param('id') id: string, @Res() response: Response) {
    throw new NotFoundException('Tài liệu nguồn không được phân phối trên web.');
  }

  @Get(':id/question-index')
  questionIndex(@Param('id') id: string) { return this.materials.questionIndex(id); }

  @Get(':id/pages/:page')
  async page(@Param('id') id: string, @Param('page') page: string, @Res() response: Response) {
    throw new NotFoundException('Trang tài liệu nguồn không được phân phối trên web.');
  }
}
