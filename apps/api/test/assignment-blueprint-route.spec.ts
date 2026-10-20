import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { AssignmentController } from '../src/modules/assignment/assignment.controller';
import { AssignmentService } from '../src/modules/assignment/assignment.service';
import { ExamAiService } from '../src/modules/assignment/exam-ai.service';
import { TeacherWorkspaceService } from '../src/modules/assignment/teacher-workspace.service';
import { ExamDocumentService } from '../src/modules/assignment/exam-document.service';
import { AuthGuard } from '../src/modules/auth/guards/auth.guard';
import { THPT_DIAGNOSTIC_BLUEPRINT_VERSION } from '../src/modules/diagnostic/diagnostic-blueprint';

describe('Assignment blueprint HTTP route', () => {
  it('serves the versioned matrix to verified teachers and denies students', async () => {
    let role = 'TEACHER';
    const module = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [AssignmentService, ExamAiService, TeacherWorkspaceService, ExamDocumentService]
        .map(provide => ({ provide, useValue: {} }))
    }).overrideGuard(AuthGuard).useValue({ canActivate(context: any) {
      context.switchToHttp().getRequest().user = { role, teacherProfile: { verificationStatus: 'VERIFIED' } };
      return true;
    } }).compile();
    const app = module.createNestApplication(new ExpressAdapter());
    app.setGlobalPrefix('api/v1');
    try {
      await app.init();
      const result = await request(app.getHttpServer()).get('/api/v1/assignments/blueprint').expect(200);
      expect(result.body.version).toBe(THPT_DIAGNOSTIC_BLUEPRINT_VERSION);
      expect(result.body.questionCounts).toEqual({SINGLE_CHOICE:12,TRUE_FALSE:2,SHORT_ANSWER:4});
      expect(result.body.slots).toHaveLength(18);
      await request(app.getHttpServer()).get('/api/v1/assignments/blueprint?grade=9').expect(400);
      expect((await request(app.getHttpServer()).get('/api/v1/assignments/blueprint?grade=12').expect(200)).body.grade).toBe(12);
      role = 'STUDENT';
      await request(app.getHttpServer()).get('/api/v1/assignments/blueprint').expect(403);
    } finally { await app.close(); }
  });
});
