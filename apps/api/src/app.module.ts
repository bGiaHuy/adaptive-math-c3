import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { DiagnosticModule } from './modules/diagnostic/diagnostic.module';
import { StudentModule } from './modules/student/student.module';
import { ClassroomModule } from './modules/classroom/classroom.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { AdminModule } from './modules/admin/admin.module';
import { EnglishModule } from './modules/english/english.module';
import { validateEnvironment } from './config/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      validate: validateEnvironment
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CurriculumModule,
    DiagnosticModule,
    StudentModule,
    ClassroomModule,
    AssignmentModule,
    AdminModule,
    EnglishModule
  ]
})
export class AppModule {}
