import 'reflect-metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { academicYear } from '../src/common/domain/academic-year';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('THPT product flows and private mixed-format review', () => {
  let app: any, db: PrismaService;
  const users: any[] = [], initial: any[] = [];
  const suffix = Date.now().toString(36);
  const get = (index: number, path: string) => request(app.getHttpServer()).get(`/api/v1/${path}`).set('Cookie', users[index].cookie);
  const post = (index: number, path: string, body = {}) => request(app.getHttpServer()).post(`/api/v1/${path}`).set('Cookie', users[index].cookie).send(body);
  const profile = (index: number, body: any) => request(app.getHttpServer()).patch('/api/v1/student/onboarding').set('Cookie', users[index].cookie).send(body);
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication(new ExpressAdapter()); app.use(cookieParser()); app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init(); db = app.get(PrismaService);
    for (let index = 0; index < 3; index++) {
      const username = `thpt_${suffix}_${index}`;
      const reg = await request(app.getHttpServer()).post('/api/v1/auth/register/student').send({ username, fullName: 'THPT product test', password: 'ThptStrong123!' }).expect(201);
      initial.push(reg.body);
      const login = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ identifier: username, password: 'ThptStrong123!' }).expect(200);
      users.push({ id: reg.body.id, username, cookie: login.headers['set-cookie'][0].split(';')[0] });
    }
  });
  afterAll(async () => { await app?.close(); }); // Global setup drops only this run's isolated schema.

  it('starts at grade 10, rejects university goals for grades 10/11, and accepts them only for grade 12', async () => {
    for (const registered of initial) expect(registered.studentProfile).toMatchObject({ grade: 10, targetGoal: 'Ôn thi cuối kỳ' });
    for (const grade of [10,11]) {
      await profile(1, { grade, targetGoal: 'Ôn thi cuối kỳ' }).expect(200);
      expect((await profile(1, { targetGoal: 'Ôn thi đại học' }).expect(400)).body.code).toBe('GOAL_REQUIRES_GRADE_12');
      expect((await get(1,'student/profile').expect(200)).body.profile).toMatchObject({grade,targetGoal:'Ôn thi cuối kỳ'});
    }
    expect((await profile(0, { grade: 12, targetGoal: 'Ôn thi đại học' }).expect(200)).body.profile).toMatchObject({grade:12,targetGoal:'Ôn thi đại học'});
    await profile(0, { grade: 11 }).expect(200);
    expect((await get(0,'student/profile').expect(200)).body.profile.targetGoal).toBe('Ôn thi cuối kỳ');
    await profile(0, { grade: 12, targetGoal: 'Ôn thi đại học' }).expect(200);
    for (const grade of [6,7,8,9,13]) await profile(0,{grade}).expect(400);
  });

  it('normalizes a legacy profile on login without deleting historical evidence or offering old-grade content', async () => {
    const oldSkill=await db.skillNode.create({data:{code:`HISTORICAL-${suffix}`,title:'Historical skill',chapter:'Historical records',grade:9,orderIndex:1}});
    const author=await db.user.findUniqueOrThrow({where:{username:'admin'}});
    const oldQuestion=await db.question.create({data:{authorId:author.id,skillId:oldSkill.id,status:'PUBLISHED',content:'Historical question',options:{create:[{optionKey:'A',content:'3',isCorrect:true}]}}});
    const oldAttempt=await db.diagnosticAttempt.create({data:{studentId:users[2].id,status:'COMPLETED',skillIds:[oldSkill.id],completedAt:new Date()}});
    const unfinished=await db.diagnosticAttempt.create({data:{studentId:users[2].id,status:'IN_PROGRESS',skillIds:[oldSkill.id],questionIds:[oldQuestion.id]}});
    await db.mistakeRecord.create({data:{studentId:users[2].id,questionId:oldQuestion.id}});
    await db.studentProfile.update({where:{userId:users[2].id},data:{grade:9,targetGoal:'Ôn thi vào lớp 10',examDate:'01/06/2025'}});
    const loggedIn=await request(app.getHttpServer()).post('/api/v1/auth/login').send({identifier:users[2].username,password:'ThptStrong123!'}).expect(200);
    expect(loggedIn.body.user.studentProfile).toMatchObject({grade:10,targetGoal:'Ôn thi cuối kỳ',examDate:null});
    expect(await db.diagnosticAttempt.findUnique({where:{id:oldAttempt.id}})).not.toBeNull();
    expect((await db.diagnosticAttempt.findUniqueOrThrow({where:{id:unfinished.id}})).status).toBe('ABANDONED');
    expect((await get(2,'diagnostic/latest').expect(200)).body.status).toBe('NOT_STARTED');
    expect(await db.question.findUnique({where:{id:oldQuestion.id}})).not.toBeNull();
    expect(await db.mistakeRecord.count({where:{studentId:users[2].id,questionId:oldQuestion.id}})).toBe(1);
    expect((await get(2,'student/mistakes').expect(200)).body.total).toBe(0);
    expect(await db.auditLog.findFirst({where:{actorUserId:users[2].id,action:'STUDENT_THPT_PROFILE_NORMALIZED'}})).not.toBeNull();
  });

  it('reviews all three formats from private AI and shared checked drafts, while hiding keys until reveal', async () => {
    const skill=await db.skillNode.findUniqueOrThrow({where:{code:'THPT-TEST-12'}});
    const questions:any[]=[];
    for(const type of ['SINGLE_CHOICE','TRUE_FALSE','SHORT_ANSWER']) {
      const q=await db.question.create({data:{authorId:users[0].id,skillId:skill.id,status:'DRAFT',questionType:type as any,cognitiveLevel:'UNDERSTANDING',difficulty:'EASY',
        content:`Mixed THPT review ${type}: 1 + 2`,explanation:'1 + 2 = 3.',
        source:type==='TRUE_FALSE'?{importBatchId:'thpt-text-intake-8-v1',reviewStatus:'SOURCE_KEY_AND_SOLUTION_CHECKED'}:{studentId:users[0].id,reviewStatus:'AI_DIAGNOSTIC_CHECKED',humanReviewed:false},
        ...(type==='SINGLE_CHOICE'?{options:{create:['A','B','C','D'].map((optionKey,index)=>({optionKey,content:String(index+3),isCorrect:index===0}))}}
          :type==='TRUE_FALSE'?{statements:['a','b','c','d'].map((key,index)=>({key,content:`1 + 2 = ${index+3}`,isCorrect:index===0}))}
          :{shortAnswer:{mode:'NUMERIC',instructions:'Nhập số.',acceptedAnswers:['3'],tolerance:0}})}});
      questions.push(q);
      await db.mistakeRecord.create({data:{studentId:users[0].id,questionId:q.id}});
      await post(0,`student/review/enroll/${q.id}`).expect(201);
    }
    const queue=(await get(0,'student/review/queue').expect(200)).body;
    expect(queue).toHaveLength(3);
    for(const card of queue) {
      expect(card).not.toHaveProperty('explanation'); expect(card).not.toHaveProperty('shortAnswer');
      for(const option of card.options||[])expect(option).not.toHaveProperty('isCorrect');
      for(const statement of card.statements||[])expect(statement).not.toHaveProperty('isCorrect');
      const answer=card.questionType==='SINGLE_CHOICE'?{selectedOptionKey:'A'}:card.questionType==='TRUE_FALSE'?{response:{trueFalseAnswers:{a:true,b:false,c:false,d:false}}}:{response:{shortAnswer:'3'}};
      const reveal=(await post(0,`student/review/cards/${card.id}/reveal`,answer).expect(201)).body;
      expect(reveal.correct).toBe(true); expect(reveal.question.questionType).toBe(card.questionType);
      expect((await post(0,`student/review/logs/${reveal.reviewId}`,{rating:4}).expect(201)).body.rating).toBe(4);
      await post(1,`student/review/cards/${card.id}/reveal`,answer).expect(404);
    }
    // Even an orphan reference in another student's notebook cannot grant access.
    await db.mistakeRecord.create({data:{studentId:users[1].id,questionId:questions[0].id}});
    await post(1,`student/review/enroll/${questions[0].id}`).expect(404);
    const forbidden=await db.mathReviewCard.create({data:{studentId:users[1].id,questionId:questions[0].id,scheduler:{}}});
    expect((await get(1,'student/review/queue').expect(200)).body.some((card:any)=>card.id===forbidden.id)).toBe(false);
    await post(1,`student/review/cards/${forbidden.id}/reveal`,{answer:'A'}).expect(400);
    // Shared/owned checked drafts remain answerable after practice chooses one.
    const practice=(await post(0,`student/practice/start/${skill.id}`).expect(201)).body;
    const chosen=await db.question.findUniqueOrThrow({where:{id:practice.currentQuestion.id}});
    expect(chosen.status).toBe('DRAFT');
    await post(0,`student/practice/${practice.sessionId}/answer`,{questionId:chosen.id,answer:'A',timeSpentSeconds:5}).expect(201);
    await post(0,`student/practice/${practice.sessionId}/abandon`).expect(201);
  });
  it('reviews only released, completed teacher assignment snapshots and hides active exam answers', async () => {
    const author=await db.user.findUniqueOrThrow({where:{username:'admin'}});
    const skill=await db.skillNode.create({data:{code:`LEGACY-DOCUMENT-${suffix}`,title:'Teacher document',chapter:'Document',grade:0,orderIndex:0}});
    const q=await db.question.create({data:{authorId:author.id,skillId:skill.id,status:'DRAFT',questionType:'SHORT_ANSWER',content:'Original source',shortAnswer:{mode:'NUMERIC',acceptedAnswers:['3'],tolerance:0}}});
    const classroom=await db.classroom.create({data:{teacherId:author.id,name:'THPT snapshot review',grade:12}});
    const assignment=await db.classroomAssignment.create({data:{classId:classroom.id,title:'Private paper',settings:{resultsPolicy:'MANUAL'},questions:{create:{questionId:q.id,snapshot:{...q,content:'Assignment snapshot: 3 + 4',skill,options:[],explanation:'3 + 4 = 7',shortAnswer:{mode:'NUMERIC',acceptedAnswers:['7'],tolerance:0}}}}}});
    const submission=await db.assignmentSubmission.create({data:{assignmentId:assignment.id,studentId:users[0].id,status:'GRADED',submittedAt:new Date()}});
    await db.mistakeRecord.create({data:{studentId:users[0].id,questionId:q.id}});
    await post(0,`student/review/enroll/${q.id}`).expect(404);
    expect((await get(0,'student/mistakes').expect(200)).body.mistakes.some((m:any)=>m.questionId===q.id)).toBe(false);
    await db.classroomAssignment.update({where:{id:assignment.id},data:{settings:{resultsPolicy:'MANUAL',published:true}}});
    await post(0,`student/review/enroll/${q.id}`).expect(201);
    const card=(await get(0,'student/review/queue').expect(200)).body.find((c:any)=>c.questionId===q.id);
    expect(card.content).toBe('Assignment snapshot: 3 + 4');
    expect(JSON.stringify(card)).not.toContain('acceptedAnswers');
    const notebook=(await get(0,'student/mistakes').expect(200)).body.mistakes.find((m:any)=>m.questionId===q.id);
    expect(notebook.shortAnswer.acceptedAnswers).toEqual(['7']);
    expect((await post(0,`student/review/cards/${card.id}/reveal`,{response:{shortAnswer:'7'}}).expect(201)).body.correct).toBe(true);
    expect((await db.question.findUniqueOrThrow({where:{id:q.id}})).shortAnswer).toMatchObject({acceptedAnswers:['3']});
    await db.mistakeRecord.create({data:{studentId:users[1].id,questionId:q.id}});
    await post(1,`student/review/enroll/${q.id}`).expect(404);
    await db.assignmentSubmission.update({where:{id:submission.id},data:{status:'IN_PROGRESS'}});
    expect((await get(0,'student/review/queue').expect(200)).body.some((c:any)=>c.questionId===q.id)).toBe(false);
    await post(0,`student/review/cards/${card.id}/reveal`,{response:{shortAnswer:'7'}}).expect(400);
    expect((await get(0,'student/mistakes').expect(200)).body.mistakes.some((m:any)=>m.questionId===q.id)).toBe(false);
    await db.assignmentSubmission.update({where:{id:submission.id},data:{status:'GRADED'}});
  });

  it('promotes once, shows only the new grade in mastery and path, and preserves previous evidence', async () => {
    const studentId=users[2].id;
    const old=await db.skillNode.findUniqueOrThrow({where:{code:'THPT-TEST-10'}});
    const next=await db.skillNode.findUniqueOrThrow({where:{code:'THPT-TEST-11'}});
    await db.studentProfile.update({where:{userId:studentId},data:{grade:10,targetGoal:'Ôn thi cuối kỳ'}});
    await db.skillMastery.create({data:{studentId,skillId:old.id,masteryScore:100,evidenceCount:10}});
    await db.auditLog.create({data:{actorUserId:studentId,action:'STUDENT_GRADE_ANCHOR',targetEntity:'User',targetEntityId:studentId,metadata:{grade:10,academicYear:academicYear()-1}}});
    const mastery=(await get(2,'student/mastery').expect(200)).body;
    expect(mastery.grade).toBe(11);expect(mastery.catalog.some((s:any)=>s.skillId===old.id)).toBe(false);
    expect(mastery.catalog.some((s:any)=>s.skillId===next.id)).toBe(true);expect(mastery.totalAssessedSkills).toBe(0);
    const path=(await get(2,'student/learning-path').expect(200)).body;
    expect(path.grade).toBe(11);expect(path.modules.some((s:any)=>s.id===old.id)).toBe(false);
    expect(path.modules.some((s:any)=>s.id===next.id)).toBe(true);
    expect((await get(2,'student/profile').expect(200)).body.profile.grade).toBe(11);
    expect(await db.skillMastery.findUnique({where:{studentId_skillId:{studentId,skillId:old.id}}})).not.toBeNull();
    expect(await db.auditLog.count({where:{actorUserId:studentId,action:'STUDENT_GRADE_PROMOTED'}})).toBe(1);
  });

});
