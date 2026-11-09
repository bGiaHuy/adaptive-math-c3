import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

// Fixture writes are allowed only in this task's dedicated restored preview project.
const secrets = Object.fromEntries((await readFile('.cache/c3-cloudflare-preview.env', 'utf8')).split(/\r?\n/).filter(Boolean).map(line => {
  const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)];
}));
assert.equal(secrets.C3_PREVIEW_PROJECT, 'otpekgrqjnzjecieiqra');
assert.ok(new URL(secrets.C3_PREVIEW_DATABASE_URL).username.endsWith('.otpekgrqjnzjecieiqra'));
const base = 'https://adaptive-math-c3-candidate.adaptive-learning-c3.workers.dev';
const prisma = new PrismaClient({ datasources: { db: { url: secrets.C3_PREVIEW_DATABASE_URL } } });
const suffix = randomUUID().replaceAll('-', '').slice(0, 12);
const checks = [];
const accounts = {};
async function api(path, status, { actor, method = 'GET', body } = {}) {
  const response = await fetch(base + '/api/v1' + path, {
    method, headers: { origin: base, ...(actor ? { cookie: actor.cookie } : {}), ...(body ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000)
  });
  const data = await response.json();
  assert.equal(response.status, status, `${method} ${path}: ${data.code || ''} ${data.message || ''}`);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
  checks.push({ method, path, status });
  return { data, response };
}
async function account(name, role, teacher = false) {
  const identifier = teacher ? `cfqa_${name}_${suffix}@example.com` : `cfqa_${name}_${suffix}`;
  const password = 'QA!' + randomUUID();
  const { data } = await api('/auth/register/' + (teacher ? 'teacher' : 'student'), 201, {
    method: 'POST', body: { fullName: 'Cloudflare QA ' + name, password, ...(teacher ? { email: identifier, schoolName: 'QA isolated preview' } : { username: identifier }) }
  });
  // Explicit role fixtures; do not infer the registration policy from this test.
  await prisma.user.update({ where: { id: data.id }, data: { role } });
  if (role === 'TEACHER') await prisma.teacherProfile.update({ where: { userId: data.id }, data: { verificationStatus: 'VERIFIED', verifiedAt: new Date() } });
  const login = await api('/auth/login', 200, { method: 'POST', body: { identifier, password } });
  const actor = { id: data.id, identifier, password, cookie: login.response.headers.get('set-cookie').split(';')[0] };
  // Existing application policy auto-approves teacher applicants at login.
  assert.equal((await api('/auth/me', 200, { actor })).data.user.role, role === 'TEACHER_APPLICANT' ? 'TEACHER' : role);
  accounts[name] = actor;
  return actor;
}

try {
  await api('/health', 200);
  const teacher = await account('teacher', 'TEACHER', true);
  const otherTeacher = await account('other', 'TEACHER', true);
  const student = await account('student', 'STUDENT');
  const admin = await account('admin', 'ADMIN');
  const author = await account('author', 'CONTENT_AUTHOR');
  const reviewer = await account('reviewer', 'CONTENT_REVIEWER');
  const pending = await account('pending', 'TEACHER_APPLICANT', true);
  // These are disposable clone credentials for browser and AI validation, never Git.
  await writeFile('.cache/c3-cloudflare-qa.json', JSON.stringify(Object.fromEntries(Object.entries(accounts).map(([name, a]) => [name, { identifier: a.identifier, password: a.password, id: a.id }])), null, 2), { mode: 0o600 });
  for (const actor of [teacher, admin, author, reviewer, pending]) await api('/admin/questions', 200, { actor });
  await api('/admin/questions', 403, { actor: student });
  await api('/admin/overview', 200, { actor: admin });
  await api('/admin/overview', 403, { actor: teacher });
  const classA = (await api('/classrooms', 201, { actor: teacher, method: 'POST', body: { name: 'Cloudflare QA ' + suffix, grade: 10, academicYear: '2026-2027' } })).data.classroom.id;
  const classC = (await api('/classrooms', 201, { actor: otherTeacher, method: 'POST', body: { name: 'Cloudflare other QA ' + suffix, grade: 10, academicYear: '2026-2027' } })).data.classroom.id;
  await prisma.classroomMembership.create({ data: { classId: classA, studentId: student.id, status: 'ACTIVE' } });
  const skill = await prisma.skillNode.findFirstOrThrow();
  const source = [];
  for (const [index, content] of ['Tính đạo hàm của hàm số f(x) = 2x.', 'Giá trị của log_2(4) bằng bao nhiêu?'].entries()) {
    source.push(await prisma.question.create({ data: {
      skillId: skill.id, authorId: teacher.id, status: 'PUBLISHED', questionType: 'SINGLE_CHOICE',
      content: `${content} (Cloudflare QA ${suffix}-${index})`, explanation: 'Đáp án bằng 2.',
      options: { create: ['1', '2', '3', '4'].map((value, i) => ({ optionKey: 'ABCD'[i], content: value, isCorrect: i === 1 })) }
    }, include: { options: true } }));
  }
  source.sort((a, b) => a.id.localeCompare(b.id));
  const bankBefore = await prisma.question.findMany({ include: { options: true }, orderBy: { id: 'asc' } });
  const questionIds = source.map(q => q.id);
  const makeAssignment = async (classId, actor, title) => (await api(`/classrooms/${classId}/assignments`, 201, { actor, method: 'POST', body: { title, durationMinutes: 30, questionIds } })).data.assignment.id;
  const assignmentA = await makeAssignment(classA, teacher, 'Cloudflare assignment A');
  const assignmentB = await makeAssignment(classA, teacher, 'Cloudflare assignment B');
  const assignmentC = await makeAssignment(classC, otherTeacher, 'Cloudflare assignment C');
  const snapshots = id => prisma.assignmentQuestion.findMany({ where: { assignmentId: id }, orderBy: { id: 'asc' } });
  const beforeB = await snapshots(assignmentB), beforeC = await snapshots(assignmentC);
  const route = `/classrooms/${classA}/assignments/${assignmentA}`;
  await api(route + '/submissions', 403, { actor: otherTeacher });
  const taken = (await api(`/assignments/${assignmentA}/take`, 200, { actor: student })).data.assignment;
  for (const q of taken.questions) for (const option of q.options) assert.equal('isCorrect' in option, false);
  const report = (await api(route + '/submissions', 200, { actor: teacher })).data;
  const changes = report.questions.map(q => ({ id: q.id, questionType: q.questionType, difficulty: q.difficulty, content: q.content, explanation: q.explanation || '', points: q.points, options: q.options.map(o => ({ key: o.optionKey, content: o.content })), correctOption: q.options.find(o => o.isCorrect).optionKey }));
  const revision = report.assignment.revision;
  await api(route + '/regrade', 400, { actor: teacher, method: 'POST', body: { revision, reason: 'QA started-attempt restriction', questions: changes.map((q, i) => i ? q : { ...q, content: q.content + ' changed' }), apply: true } });
  const answers = taken.questions.map(q => ({ questionId: q.id, selectedOptionKey: changes.find(x => x.id === q.id).correctOption }));
  await api(`/assignments/${assignmentA}/draft`, 201, { actor: student, method: 'POST', body: { timeSpentSeconds: 5, answers } });
  const resumed = (await api(`/assignments/${assignmentA}/take`, 200, { actor: student })).data.assignment;
  assert.equal(resumed.startedAt, taken.startedAt); assert.equal(resumed.draftAnswers.length, 2);
  const submitted = (await api(`/assignments/${assignmentA}/submit`, 200, { actor: student, method: 'POST', body: { timeSpentSeconds: 10, answers } })).data;
  assert.equal(submitted.score, 10);
  changes[0].correctOption = changes[0].options.find(o => o.key !== changes[0].correctOption).key;
  const payload = { revision, reason: 'Cloudflare QA snapshot isolation', questions: changes, apply: false };
  const beforeGrade = await prisma.assignmentSubmission.findUniqueOrThrow({ where: { assignmentId_studentId: { assignmentId: assignmentA, studentId: student.id } } });
  const auditWhere = { targetEntityId: assignmentA, action: 'ASSIGNMENT_REGRADED' };
  const beforeAudit = await prisma.auditLog.count({ where: auditWhere });
  const preview = (await api(route + '/regrade', 201, { actor: teacher, method: 'POST', body: payload })).data;
  assert.equal(preview.applied, false);
  assert.equal((await prisma.assignmentSubmission.findUniqueOrThrow({ where: { id: beforeGrade.id } })).score, 10);
  assert.equal(await prisma.auditLog.count({ where: auditWhere }), beforeAudit);
  const applied = (await api(route + '/regrade', 201, { actor: teacher, method: 'POST', body: { ...payload, apply: true } })).data;
  assert.equal(applied.applied, true); assert.equal(applied.revision, revision + 1);
  assert.equal((await prisma.assignmentSubmission.findUniqueOrThrow({ where: { id: beforeGrade.id } })).score, preview.changes[0].score);
  assert.equal(await prisma.auditLog.count({ where: auditWhere }), beforeAudit + 1);
  await api(route + '/regrade', 409, { actor: teacher, method: 'POST', body: { ...payload, apply: true } });
  assert.deepEqual(await prisma.question.findMany({ where: { id: { in: questionIds } }, include: { options: true }, orderBy: { id: 'asc' } }), source);
  assert.deepEqual(await prisma.question.findMany({ include: { options: true }, orderBy: { id: 'asc' } }), bankBefore);
  assert.deepEqual(await snapshots(assignmentB), beforeB); assert.deepEqual(await snapshots(assignmentC), beforeC);
  const result = (await api(`/assignments/${assignmentA}/result`, 200, { actor: student })).data.result;
  assert.equal(result.score, preview.changes[0].score);
  await api(`/assignments/${assignmentA}/draft`, 400, { actor: student, method: 'POST', body: { timeSpentSeconds: 11, answers: [] } });
  const evidence = { pass: true, at: new Date().toISOString(), base, project: secrets.C3_PREVIEW_PROJECT, checks, invariants: ['five effective session roles and existing teacher-applicant auto-approval', 'source bank unchanged', 'other assignment unchanged', 'other teacher assignment unchanged', 'ownership', 'pre-submit answer secrecy', 'started-attempt restrictions', 'draft resume', 'grading', 'preview no mutation', 'regrade revision and audit', 'stale revision rejected'] };
  await writeFile('.cache/cloudflare-live-regression.json', JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify({ pass: true, requests: checks.length, invariants: evidence.invariants }));
} finally { await prisma.$disconnect(); }
