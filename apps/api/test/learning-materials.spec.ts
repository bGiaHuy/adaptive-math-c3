import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { Reflector } from '@nestjs/core';
import { LearningMaterialsController } from '../src/modules/curriculum/learning-materials.controller';
import { LearningMaterialsService } from '../src/modules/curriculum/learning-materials.service';
import { RolesGuard } from '../src/modules/auth/guards/roles.guard';

describe('THPT material access', () => {
  it('permits only established learning roles, rejecting teacher applicants', () => {
    const guard = new RolesGuard(new Reflector());
    const ctx = (role: string) => ({getHandler:()=>LearningMaterialsController.prototype.catalog,getClass:()=>LearningMaterialsController,switchToHttp:()=>({getRequest:()=>({user:{role,teacherProfile:{verificationStatus:'VERIFIED'}}})})}) as any;
    for (const role of ['TEACHER','ADMIN','CONTENT_AUTHOR','CONTENT_REVIEWER','STUDENT']) expect(guard.canActivate(ctx(role))).toBe(true);
    for (const role of ['TEACHER_APPLICANT','UNKNOWN']) expect(()=>guard.canActivate(ctx(role))).toThrow();
  });

  it('rejects filesystem input before any file can be served', async () => {
    const service = new LearningMaterialsService();
    for (const id of ['../../.env','THPT-10/../../.env','unknown','THPT-13-CUOI_HK1-001']) expect(()=>service.file(id)).toThrow();
    (service as any).catalog=()=>({items:[{id:'THPT-10-CUOI_HK1-001',pageCount:3}]});
    for (const page of [0,-1,4,NaN,1.1]) await expect(service.page('THPT-10-CUOI_HK1-001',page)).rejects.toThrow();
    (service as any).questions=()=>({items:[{id:'q',images:['../secret.png']}]});
    expect(()=>service.questionImage('q',1)).toThrow();
    expect(()=>service.questionImage('q',0)).toThrow();
    expect(()=>service.questionImage('q',2)).toThrow();
  });
});
