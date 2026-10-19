import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { PrismaClient, TeacherVerificationStatus, UserRole } from '@prisma/client';

const batch = JSON.parse(await readFile('content/english/batch_001.json', 'utf8'));
const port = 4107;
const origin = `http://127.0.0.1:${port}`;
const api = `${origin}/api/v1`;
const databaseUrl = process.env.ADAPTIVE_TEST_DATABASE_URL ||
  'postgresql://am:am_dev_password@127.0.0.1:55432/adaptivelearning_test?schema=public';
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const child = spawn(process.execPath, ['apps/api/dist/main.js'], {
  env: {
    ...process.env,
    DATABASE_URL: databaseUrl,
    NODE_ENV: 'test',
    PORT: String(port),
    WEB_URL: 'http://127.0.0.1:3000',
    SESSION_SECRET: 'adaptive_learning_local_test_secret_32_chars',
    SESSION_COOKIE_NAME: 'am_session',
    INVITE_CODE_HMAC_SECRET: 'adaptive_learning_local_test_invite_secret'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});
let logs = '';
child.stdout.on('data', chunk => { logs += chunk.toString(); });
child.stderr.on('data', chunk => { logs += chunk.toString(); });

async function request(path, { method = 'GET', body, cookie } = {}) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie, origin: 'http://127.0.0.1:3000' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(data)}`);
  return { response, data };
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (child.exitCode !== null) throw new Error(`API exited early: ${logs.slice(-1500)}`);
    try { const health = await request('/health'); if (health.data.status === 'ok') { ready = true; break; } }
    catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  if (!ready) throw new Error(`API did not start: ${logs.slice(-1500)}`);
  const topics = (await request('/english/topics')).data;
  if (topics.length !== 3 || topics.reduce((count, topic) => count + topic.lessons.length, 0) !== 5) {
    throw new Error('Imported catalogue counts do not match batch_001');
  }
  const lesson = (await request('/english/lessons/les-001')).data;
  if (lesson.exercises.length !== 4 || JSON.stringify(lesson.exercises).includes('correctAnswer')) {
    throw new Error('Lesson exercises are missing or expose answers');
  }
  const username = `qa_${Date.now()}`;
  const password = 'P@ssword123!';
  await request('/auth/register/student', { method: 'POST', body: { username, password, fullName: 'QA Student' } });
  const login = await request('/auth/login', { method: 'POST', body: { identifier: username, password } });
  const cookie = login.response.headers.get('set-cookie')?.split(';')[0];
  if (!cookie) throw new Error('Login did not set a session cookie');
  const placement = (await request('/english/placement', { cookie })).data;
  if (placement.length < 6 || placement.some(question => question.level === 'A2' || 'correctAnswer' in question)) {
    throw new Error('Placement does not match available levels or exposes answers');
  }
  const answersById = new Map(batch.lessons.flatMap(item => item.exercises.map(exercise => [exercise.id, exercise.correctAnswer])));
  const placementResult = (await request('/english/placement', {
    method: 'POST', cookie,
    body: { answers: Object.fromEntries(placement.map(question => [question.id, answersById.get(question.id)])) }
  })).data;
  if (placementResult.suggestedLevel !== 'B1' || placementResult.assessedLevels.join(',') !== 'A1,B1') {
    throw new Error(`Unexpected placement result: ${JSON.stringify(placementResult)}`);
  }
  const lessonResult = (await request('/english/lessons/les-001/submit', {
    method: 'POST', cookie,
    body: { answers: Object.fromEntries(lesson.exercises.map(exercise => [exercise.id, answersById.get(exercise.id)])) }
  })).data;
  if (lessonResult.correctCount !== 4) throw new Error('Lesson grading failed');
  const progress = (await request('/english/progress', { cookie })).data;
  if (!progress.some(item => item.lessonId === 'les-001' && item.correctCount === 4)) throw new Error('Progress was not saved');
  const teacherEmail = `qa_teacher_${Date.now()}@example.test`;
  const teacher = (await request('/auth/register/teacher', { method: 'POST',
    body: { email: teacherEmail, password, fullName: 'QA Teacher' } })).data;
  await prisma.user.update({ where: { id: teacher.id }, data: {
    role: UserRole.TEACHER, teacherProfile: { update: { verificationStatus: TeacherVerificationStatus.VERIFIED } }
  } });
  const teacherLogin = await request('/auth/login', { method: 'POST', body: { identifier: teacherEmail, password } });
  const teacherCookie = teacherLogin.response.headers.get('set-cookie')?.split(';')[0];
  if (!teacherCookie) throw new Error('Teacher login did not set a session cookie');
  const classroom = (await request('/classrooms', { method: 'POST', cookie: teacherCookie,
    body: { name: 'QA English class' } })).data.classroom;
  await request(`/english/classes/${classroom.id}/assignments`, { method: 'POST', cookie: teacherCookie,
    body: { lessonId: 'les-001' } });
  await request('/classrooms/join', { method: 'POST', cookie, body: { code: classroom.inviteCode } });
  const studentAssignments = (await request('/english/my-assignments', { cookie })).data;
  if (studentAssignments.length !== 1 || studentAssignments[0].lesson.id !== 'les-001' ||
    !studentAssignments[0].completed) throw new Error('Student assignment or completion failed');
  const classAssignments = (await request(`/english/classes/${classroom.id}/assignments`, { cookie: teacherCookie })).data;
  if (classAssignments.studentCount !== 1 || classAssignments.assignments[0]?.completedCount !== 1) {
    throw new Error('Teacher completion count failed');
  }
  console.log(JSON.stringify({ topics: topics.length, lessons: 5, lessonQuestions: lesson.exercises.length,
    placementQuestions: placement.length, assessedLevels: placementResult.assessedLevels,
    lessonScore: lessonResult.correctCount, progressSaved: true, classAssignment: true }));
} finally {
  child.kill();
  await prisma.$disconnect();
}
