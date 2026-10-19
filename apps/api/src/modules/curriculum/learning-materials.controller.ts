import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
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

  @Get('questions/:id/images/:segment')
  questionImage(@Param('id') id: string, @Param('segment') segment: string, @Res() response: Response) {
    const file = this.materials.questionImage(id, Number(segment));
    response.setHeader('Cache-Control', 'private, max-age=86400');
    response.type('png').sendFile(file);
  }

  @Get(':id/file')
  file(@Param('id') id: string, @Res() response: Response) {
    const file = this.materials.file(id);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `inline; filename="${id}.pdf"`);
    response.setHeader('Cache-Control', 'private, max-age=300');
    response.sendFile(file);
  }

  @Get(':id/pages/:page')
  async page(@Param('id') id: string, @Param('page') page: string, @Res() response: Response) {
    const file = await this.materials.page(id, Number(page));
    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Cache-Control', 'private, max-age=86400');
    response.sendFile(file, { dotfiles: 'allow' });
  }
}
