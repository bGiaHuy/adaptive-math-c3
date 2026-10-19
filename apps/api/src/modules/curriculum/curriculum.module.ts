import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { LearningMaterialsController } from './learning-materials.controller';
import { LearningMaterialsService } from './learning-materials.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CurriculumController, LearningMaterialsController],
  providers: [CurriculumService, LearningMaterialsService],
  exports: [CurriculumService]
})
export class CurriculumModule {}
