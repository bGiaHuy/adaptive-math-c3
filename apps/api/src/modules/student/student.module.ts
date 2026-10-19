import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MathReviewService } from './math-review.service';
import { MathReviewController } from './math-review.controller';
import { AiBudgetService } from '../ai/ai-budget.service';
import { MathPracticeService } from './math-practice.service';
import { MathPracticeController } from './math-practice.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StudentController,MathReviewController,MathPracticeController],
  providers: [StudentService,MathReviewService,AiBudgetService,MathPracticeService],
  exports: [StudentService]
})
export class StudentModule {}
