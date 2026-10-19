import JSZip from 'jszip';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-core';
import axe from 'axe-core';

const root = process.cwd(), output = path.join(root, 'docs/evidence/teacher-workspace');
fs.mkdirSync(output, { recursive: true });
const raw = fs.readFileSync('apps/api/.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)?.[1].trim().replace(/^"|"$/g, '');
const local = new URL(raw);
assert.ok(['localhost', '127.0.0.1'].includes(local.hostname), 'QA must use a local database');
const dbname = `teacher_workspace_qa_${Date.now()}`;
const admin = new PrismaClient({ datasources: { db: { url: local.toString() } } });
await admin.$executeRawUnsafe(`CREATE DATABASE "${dbname}" WITH TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'`); await admin.$disconnect();
local.pathname = `/${dbname}`;
const databaseUrl = local.toString();
const migration = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy', '--schema', 'apps/api/prisma/schema.prisma'], { cwd: root, env: { ...process.env, DATABASE_URL: databaseUrl }, encoding: 'utf8', windowsHide: true });
assert.equal(migration.status, 0, migration.stdout + migration.stderr);
const db = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const apiPort = 34820, webPort = 34821, origin = `http://127.0.0.1:${webPort}`, children = [], errors = [], checks = [];
let logs = '', browser;
const pause = ms => new Promise(r => setTimeout(r, ms));
function start(args, env) { const c = spawn(process.execPath, args, { cwd: root, env: { ...process.env, ...env }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }); c.stdout.on('data', d => logs += d); c.stderr.on('data', d => logs += d); children.push(c); }
async function ready(url) { for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) return; } catch {} await pause(250); } throw new Error(logs); }
async function api(route, { cookie, body, expected = 200, method = body ? 'POST' : 'GET' } = {}) {
  const r = await fetch(`${origin}/api/v1${route}`, { method, headers: { origin, ...(cookie ? { cookie } : {}), ...(body ? { 'content-type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json(); assert.ok(r.status === expected || (expected === 200 && r.status === 201), `${route} ${r.status}: ${JSON.stringify(data)}`); return { data, cookie: r.headers.get('set-cookie')?.split(';')[0] };
}
const password = 'P@ssword123!';
try {
  start(['apps/api/dist/main.js'], { DATABASE_URL: databaseUrl, PORT: String(apiPort), WEB_URL: origin, NODE_ENV: 'test', AI_ENABLED: 'false', SESSION_COOKIE_NAME: 'am_session', SESSION_SECRET: 'teacher_workspace_test_session_secret_32_characters', INVITE_CODE_HMAC_SECRET: 'teacher_workspace_test_invite_secret_32_characters' });
  start(['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'], { API_PROXY_TARGET: `http://127.0.0.1:${apiPort}` });
  await ready(`${origin}/api/v1/health`);
  const registration = await api('/auth/register/teacher', { body: { fullName: 'Nguyễn Minh An', email: 'teacher-workspace@example.test', password, schoolName: 'THCS Thực nghiệm' } });
  const teacherId = registration.data.id;
  await db.user.update({ where: { id: teacherId }, data: { role: 'TEACHER' } });
  await db.teacherProfile.update({ where: { userId: teacherId }, data: { verificationStatus: 'VERIFIED', verifiedAt: new Date() } });
  const teacher = (await api('/auth/login', { body: { identifier: 'teacher-workspace@example.test', password } })).cookie;
  const students = [];
  for (let i = 0; i < 3; i++) {
    await api('/auth/register/student', { body: { username: `workspace_student${i}`, email: `workspace_student${i}@example.test`, fullName: ['Trần Minh Anh', 'Lê Gia Huy', 'Nguyễn Hà Linh'][i], password } });
    students.push((await api('/auth/login', { body: { identifier: `workspace_student${i}`, password } })).cookie);
  }
  const classroom = (await api('/classrooms', { cookie: teacher, body: { name: 'Toán 9A1', grade: 9, academicYear: '2026-2027' } })).data.classroom;
  for (const cookie of students) await api('/classrooms/join', { cookie, body: { code: classroom.inviteCode } });
  const skill = await db.skillNode.create({ data: { code: 'QA_VIETE', title: 'Phương trình bậc hai', chapter: 'Chương 4', grade: 9 } });
  const customQuestions = [
    { questionType: 'SINGLE_CHOICE', content: 'Tổng hai nghiệm của $x^2-5x+6=0$ bằng bao nhiêu?', options: ['5', '-5', '6', '-6'].map((content, i) => ({ key: 'ABCD'[i], content })), correctOption: 'A', explanation: 'Theo Viète, tổng hai nghiệm bằng 5.', skillId: skill.id },
    { questionType: 'TRUE_FALSE', content: 'Xét phương trình $x^2-5x+6=0$.', statements: ['a', 'b', 'c', 'd'].map((key, i) => ({ key, content: ['Có hai nghiệm phân biệt.', 'Tổng hai nghiệm bằng 5.', 'Tích hai nghiệm bằng 6.', 'Một nghiệm bằng 2.'][i], isCorrect: true })), skillId: skill.id },
    { questionType: 'SHORT_ANSWER', content: 'Tính tích hai nghiệm của $x^2-5x+6=0$.', shortAnswer: { mode: 'NUMERIC', acceptedAnswers: ['6'], tolerance: 0.001 }, skillId: skill.id }
  ];
  const sourceZip = new JSZip();
  sourceZip.file('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  sourceZip.file('_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  sourceZip.file('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>ĐỀ KIỂM TRA TOÁN 9 — PHƯƠNG TRÌNH BẬC HAI</w:t></w:r></w:p><w:p><w:r><w:t>Câu 1. Tổng hai nghiệm của x² - 5x + 6 = 0 bằng bao nhiêu? A. 5; B. -5; C. 6; D. -6.</w:t></w:r></w:p><w:p><w:r><w:t>Câu 2. Đánh giá đúng sai bốn ý trong đề.</w:t></w:r></w:p><w:p><w:r><w:t>Câu 3. Tính tích hai nghiệm.</w:t></w:r></w:p></w:body></w:document>');
  const sourceBytes = await sourceZip.generateAsync({type:'nodebuffer'});
  const sourcePath = path.join(output,'source-exam.docx'); fs.writeFileSync(sourcePath,sourceBytes);
  const sourceForm = new FormData(); sourceForm.append('file',new Blob([sourceBytes]),'de-kiem-tra.docx');
  const uploaded = await fetch(`${origin}/api/v1/assignments/documents`,{method:'POST',headers:{origin,cookie:teacher},body:sourceForm});
  assert.equal(uploaded.status,201); const doc = (await uploaded.json()).document;
  const sourcePreview = (await api(`/assignments/documents/${doc.id}`,{cookie:teacher})).data;
  assert.ok(sourcePreview.previewHtml.includes('ĐỀ KIỂM TRA')); assert.ok(!('content' in sourcePreview));
  await api(`/assignments/documents/${doc.id}`,{cookie:students[0],expected:403});
  checks.push('DOCX stored privately and converted for browser preview; unassigned student denied');
  const a = (await api(`/classrooms/${classroom.id}/assignments`, { cookie: teacher, body: { title: 'Kiểm tra định lý Viète — 15 phút', durationMinutes: 15, customQuestions, settings: { documentId: doc.id, mode: 'TEST', resultsPolicy: 'MANUAL', showSolutions: false, folder: 'Chương 4 — Phương trình' } } })).data.assignment;
  const otherRegistration = await api('/auth/register/teacher', { body: { fullName: 'Giáo viên lớp khác', email: 'other-workspace@example.test', password, schoolName: 'THCS Thực nghiệm' } });
  await db.user.update({ where: { id: otherRegistration.data.id }, data: { role: 'TEACHER' } });
  const otherTeacher = (await api('/auth/login', { body: { identifier: 'other-workspace@example.test', password } })).cookie;
  await api(`/classrooms/${classroom.id}/assignments/${a.id}/submissions`, { cookie: otherTeacher, expected: 403 });
  await api(`/classrooms/${classroom.id}/assignments/${a.id}/settings`, { cookie: otherTeacher, body: { published: true }, expected: 403 });
  checks.push('Another teacher cannot read or change the class assignment');
  const taking = (await api(`/assignments/${a.id}/take`, { cookie: students[0] })).data.assignment;
  assert.equal(taking.document.id,doc.id);
  const allowedDocument = await fetch(`${origin}/api/v1/assignments/documents/${doc.id}/file`,{headers:{cookie:students[0]}}); assert.equal(allowedDocument.status,200); assert.equal((await allowedDocument.arrayBuffer()).byteLength,sourceBytes.length);
  assert.ok(taking.questions.every(q => !q.shortAnswer && !q.explanation && q.options.every(o => o.isCorrect === undefined)));
  const qids = taking.questions.map(q => q.id);
  for (const [i, kind] of ['HIDDEN', 'VISIBLE', 'RELOAD'].entries()) {
    const body = { id: `event-${i}`, kind, sessionId: 'qa-session', occurredAt: new Date().toISOString() };
    await api(`/assignments/${a.id}/activity`, { cookie: students[0], body });
    await api(`/assignments/${a.id}/activity`, { cookie: students[0], body });
  }
  const answers = [{ questionId: qids[0], selectedOptionKey: 'B' }, { questionId: qids[1], response: { trueFalseAnswers: { a: true, b: true, c: true, d: false } } }, { questionId: qids[2], response: { shortAnswer: '6' } }];
  const sub = (await api(`/assignments/${a.id}/submit`, { cookie: students[0], body: { timeSpentSeconds: 60, answers } })).data;
  assert.equal(sub.score, null);
  assert.equal((await api(`/assignments/${a.id}/result`, { cookie: students[0] })).data.result.pendingPublication, true);
  assert.equal((await api(`/classrooms/${classroom.id}/assignments`, { cookie: students[0] })).data.assignments[0].studentScore, null);
  checks.push('No answers in take; hidden score blocked in submit, result and assignment list');
  const taking2 = (await api(`/assignments/${a.id}/take`, { cookie: students[1] })).data.assignment;
  await api(`/assignments/${a.id}/submit`, { cookie: students[1], body: { timeSpentSeconds: 90, answers: [{ questionId: qids[0], selectedOptionKey: 'A' }] } });
  let report = (await api(`/classrooms/${classroom.id}/assignments/${a.id}/submissions`, { cookie: teacher })).data;
  assert.equal(report.roster.find(r => r.isSubmitted && r.timeSpentSeconds === 60).activity.count, 1);
  assert.equal(report.roster.find(r => r.timeSpentSeconds === 60).activity.reloads, 1);
  assert.equal(report.questionAnalytics[2].skippedAnswers, 1);
  checks.push('Activity is durable and idempotent; reload separate; skipped separated from wrong');
  const editable = report.questions.map(q => ({ id: q.id, questionType: q.questionType, content: q.content, explanation: q.explanation || '', ...(q.questionType === 'SINGLE_CHOICE' ? { options: q.options.map(o => ({ key: o.optionKey, content: o.content })), correctOption: 'B' } : q.questionType === 'TRUE_FALSE' ? { statements: q.statements } : { shortAnswer: q.shortAnswer }) }));
  const regrade = { revision: 1, reason: 'Sửa đáp án câu 1 theo đề thử nghiệm.', questions: editable, apply: false };
  const preview = (await api(`/classrooms/${classroom.id}/assignments/${a.id}/regrade`, { cookie: teacher, body: regrade })).data;
  assert.equal(preview.changes.length, 2); assert.ok(preview.changes.some(c => c.score > c.oldScore));
  assert.equal((await db.classroomAssignment.findUnique({ where: { id: a.id } })).revision, 1);
  await api(`/classrooms/${classroom.id}/assignments/${a.id}/regrade`, { cookie: teacher, body: { ...regrade, apply: true } });
  await api(`/classrooms/${classroom.id}/assignments/${a.id}/regrade`, { cookie: teacher, body: { ...regrade, apply: true }, expected: 409 });
  const bankQuestion = await db.question.findUnique({ where: { id: qids[0] }, include: { options: true } });
  assert.equal(bankQuestion.options.find(o => o.isCorrect).optionKey, 'A');
  checks.push('Regrade preview is read-only; atomic apply; stale revision rejected; original question unchanged');
  await api(`/classrooms/${classroom.id}/assignments/${a.id}/settings`, { cookie: teacher, body: { published: true } });
  const result = (await api(`/assignments/${a.id}/result`, { cookie: students[0] })).data.result;
  assert.equal(result.score, 8.3); assert.equal(result.resultsUpdated, true); assert.equal(result.questions[2].shortAnswer, null); assert.ok(!result.questions[0].options.some(o => o.isCorrect));
  await api(`/classrooms/${classroom.id}/assignments/${a.id}/submissions`, { cookie: students[0], expected: 403 });
  checks.push('Publication and solutions visibility separate; teacher endpoint denies students');
  await api(`/classrooms/${classroom.id}/assignments`, { cookie: teacher, body: { title: 'Ôn tập phương trình — bản nháp', durationMinutes: 0, customQuestions, status: 'DRAFT' } });

  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true, args: ['--no-sandbox', '--disable-gpu', '--no-first-run'], defaultViewport: { width: 1440, height: 1000 } });
  const page = await browser.newPage(); page.on('pageerror', e => errors.push(e.message));
  console.log('Browser initial navigation'); await page.goto(origin, { waitUntil: 'networkidle2' });
  await page.evaluate(async ({ password }) => { const r = await fetch('/api/v1/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identifier: 'teacher-workspace@example.test', password }) }); if (!r.ok) throw new Error('Login failed'); }, { password });
  console.log('Browser teacher login complete'); await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.tw-class-card');
  await page.screenshot({ path: path.join(output, '01-overview-desktop.png'), fullPage: true });
  await page.click('.tw-class-card');
  await page.waitForSelector('.tw-class-tools');
  await page.screenshot({ path: path.join(output, '02-class-desktop.png'), fullPage: true });
  async function clickText(text, selector = '.teacher-workspace button') { const found = await page.evaluate(({ text, selector }) => { const b = [...document.querySelectorAll(selector)].find(b => b.textContent.trim() === text); if (!b) return false; b.click(); return true; }, { text, selector }); assert.ok(found, `Button: ${text}`); await pause(300); }
  await clickText('Bài tập'); await page.waitForSelector('.tw-assignment-row'); await page.evaluate(() => [...document.querySelectorAll('.tw-assignment-row')].find(b => b.textContent.includes('Kiểm tra định lý')).click());
  await page.screenshot({ path: path.join(output, '03-assignments-desktop.png'), fullPage: true });
  await clickText('Xem kết quả'); await page.waitForSelector('.tw-results-grid');
  await page.screenshot({ path: path.join(output, '04-results-desktop.png'), fullPage: true });
  await clickText('Phân tích từng câu'); await page.click('.tw-analysis-row'); await page.waitForSelector('.tw-drawer');
  await page.screenshot({ path: path.join(output, '05-question-drilldown.png'), fullPage: true });
  await page.click('[aria-label="Đóng chi tiết câu"]');
  await clickText('Đề & đáp án'); await clickText('Chỉnh sửa đề / Đáp án');
  await page.screenshot({ path: path.join(output, '06-answer-editor.png'), fullPage: true });
  await page.select('.tw-question select', 'C');
  await page.type('.tw-surface > label textarea', 'Kiểm thử cập nhật đáp án từ giao diện.');
  await clickText('Xem trước ảnh hưởng'); await page.waitForSelector('.tw-regrade-preview');
  await page.screenshot({ path: path.join(output, '06b-regrade-preview.png'), fullPage: true });
  await clickText('Áp dụng đáp án mới & tính lại điểm');
  await page.waitForFunction(() => document.body.innerText.includes('Đã cập nhật đáp án và tự chấm lại'));
  const appliedUi = (await api(`/classrooms/${classroom.id}/assignments/${a.id}/submissions`, { cookie: teacher })).data;
  assert.equal(appliedUi.revision || appliedUi.assignment.revision, 3);
  assert.equal(appliedUi.questions[0].options.find(o => o.isCorrect).optionKey, 'C');
  checks.push('Teacher UI answer edit, preview and regrade persist to database');
  await clickText('Chỉnh sửa đề / Đáp án');

  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(output, '07-mobile-editor.png'), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No mobile page overflow');
  await page.click('[data-tab="teacher-library"]'); await page.waitForSelector('.tw-assignment-row');
  await page.screenshot({ path: path.join(output, '08-library-mobile.png'), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No mobile library overflow');
  await page.setViewport({ width: 1440, height: 1000 });
  await page.addScriptTag({ content: axe.source });
  const accessibility = await page.evaluate(async () => { const r = await window.axe.run(document.querySelector('.teacher-workspace'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }); return r.violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target) })); });
  await page.setViewport({width:866,height:884});
  await clickText('Tạo đề mới'); await page.waitForSelector('.tec-tabs');
  await clickText('Soạn thủ công');
  const answerSizing = await page.$eval('.tec-answer-choice',row=>({radio:row.querySelector('input[type=radio]').getBoundingClientRect().width,input:row.querySelector('input:not([type=radio])').getBoundingClientRect().width}));
  assert.ok(answerSizing.radio<=22 && answerSizing.input>=200,JSON.stringify(answerSizing));
  await page.screenshot({path:path.join(output,'09-manual-input-sizing.png'),fullPage:true});
  await clickText('Tải đề PDF / Word / Ảnh');
  const uploadInput = await page.$('input[aria-label="Tải đề gốc PDF Word hoặc ảnh"]'); await uploadInput.uploadFile(sourcePath);
  await page.waitForSelector('.exam-document-layout');
  await clickText('Tạo phiếu trả lời');
  await page.waitForSelector('.document-key-choice');
  await page.screenshot({path:path.join(output,'10-document-answer-key.png'),fullPage:true});
  checks.push('866px manual layout keeps radio compact and answer input wide; document upload and answer-key UI work');
  const context = await browser.createBrowserContext();
  const studentPage = await context.newPage();
  studentPage.on('pageerror', e => errors.push(e.message));
  await studentPage.goto(origin, { waitUntil: 'networkidle2' });
  await studentPage.evaluate(async password => { await fetch('/api/v1/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identifier: 'workspace_student2', password }) }); }, password);
  await studentPage.reload({ waitUntil: 'networkidle2' });
  await studentPage.waitForSelector('[data-tab="classroom"]'); await studentPage.click('[data-tab="classroom"]');
  await studentPage.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.textContent.toLowerCase().includes('làm bài')));
  await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.toLowerCase().includes('làm bài')).click());
  await studentPage.waitForSelector('.math-choice-options');
  await studentPage.waitForFunction(() => document.body.innerText.includes('có ghi nhận số lần rời màn hình'));
  await studentPage.waitForSelector('.exam-document-layout');
  await studentPage.screenshot({path:path.join(output,'11-student-document-exam.png'),fullPage:true});
  const otherTab = await context.newPage(); await otherTab.goto('about:blank'); await otherTab.bringToFront(); await pause(1200);
  await studentPage.bringToFront(); await pause(1200); await otherTab.close();
  const journal = (await api(`/classrooms/${classroom.id}/assignments/${a.id}/submissions`, { cookie: teacher })).data;
  const inProgress = journal.roster.find(r => r.status === 'IN_PROGRESS');
  assert.ok(inProgress.activity.count >= 1, 'Real browser tab switch recorded on server');
  await studentPage.reload({ waitUntil: 'networkidle2' });
  await studentPage.click('[data-tab="classroom"]');
  await studentPage.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.textContent.toLowerCase().includes('làm bài')));
  await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.toLowerCase().includes('làm bài')).click());
  await studentPage.waitForSelector('.math-choice-options'); await pause(1000);
  const restored = (await api(`/classrooms/${classroom.id}/assignments/${a.id}/submissions`, { cookie: teacher })).data;
  assert.ok(restored.roster.find(r => r.studentId === inProgress.studentId).activity.count >= inProgress.activity.count);
  await context.close();
  checks.push('Real student browser tab switch saved on server and survives page reload');
  checks.push('Desktop and mobile teacher flow rendered; no page overflow');
  assert.deepEqual(errors, [], 'No browser exceptions');
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ database: dbname, checks, errors, accessibility, classroomId: classroom.id, assignmentId: a.id }, null, 2));
  console.log(JSON.stringify({ checks, errors, accessibility, output }, null, 2));
} catch (e) { console.error('BROWSER ERRORS',errors); console.error(e); fs.writeFileSync(path.join(output, 'server-error.log'), logs); process.exitCode = 1; }
finally { if (browser) await browser.close(); for (const child of children) child.kill(); await db.$disconnect(); }

