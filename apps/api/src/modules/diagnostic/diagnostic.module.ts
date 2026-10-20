import { Module } from '@nestjs/common';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AiBudgetService } from '../ai/ai-budget.service';
import { DiagnosticSupplementService } from './diagnostic-supplement.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DiagnosticController],
  providers: [DiagnosticService, DiagnosticSupplementService, AiBudgetService],
  exports: [DiagnosticService]
})
export class DiagnosticModule {}
