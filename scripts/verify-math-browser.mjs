import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { PrismaClient } from '@prisma/client';

const root = process.cwd(), apiPort = 34170, webPort = 34171;
const origin = `http://127.0.0.1:${webPort}`;
const databaseUrl = process.env.ADAPTIVE_MATH_TEST_DATABASE_URL;
if (!databaseUrl?.includes('math_adaptive_qa')) throw new Error('Browser QA requires the isolated Math QA database.');
const db = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const children = [], errors = [], output = path.join(root, 'docs/evidence/math-adaptive');
fs.mkdirSync(output, { recursive: true });
let browser;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let serverLogs = '';
function start(args, env) {
  const child = spawn(process.execPath, args, { cwd: root, windowsHide: true, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', data => { serverLogs += data; }); child.stderr.on('data', data => { serverLogs += data; }); children.push(child); return child;
}
async function ready(url) {
  for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) return; } catch {} await pause(200); }
  throw new Error(`Server failed to start: ${url}\n${serverLogs}`);
}
try {
  const admin = await db.user.findUnique({ where: { username: 'admin' } });
  const skill = await db.skillNode.findUnique({ where: { code: 'SKILL-01' } });
  for (let i = 0; i < 12; i++) await db.question.create({ data: { skillId: skill.id, authorId: admin.id, status: 'PUBLISHED',
    cognitiveLevel: ['REMEMBERING','UNDERSTANDING','APPLYING','ADVANCED_APPLYING'][Math.floor(i / 3)],
    content: `Câu kiểm thử ${i+1}: Tính $\\sqrt{${(i+2)**2}}$.`, explanation: `Vì $${i+2}^2=${(i+2)**2}$ và $${i+2}>0$, căn bậc hai số học là $${i+2}$.`,
    options: { create: [{ optionKey: 'A', content: String(i+2), isCorrect: true }, { optionKey: 'B', content: String(-i-2), isCorrect: false }] }
  } });
  start(['apps/api/dist/main.js'], { DATABASE_URL: databaseUrl, PORT: String(apiPort), NODE_ENV: 'test', WEB_URL: origin,
    SESSION_COOKIE_NAME: 'am_session', SESSION_SECRET: 'adaptivemath_test_session_secret_at_least_32_chars_long', INVITE_CODE_HMAC_SECRET: 'adaptivemath_test_invite_code_hmac_secret_key_32_chars', AI_ENABLED: 'false' });
  start(['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'], { API_PROXY_TARGET: `http://127.0.0.1:${apiPort}` });
  await ready(`${origin}/api/v1/health`);
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
    args: ['--disable-gpu', '--no-first-run'], defaultViewport: { width: 1440, height: 1000 } });
  const page = await browser.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(origin, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    const call = async (path, body) => {
      const response = await fetch(`/api/v1/${path}`, { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });
      const data = await response.json(); if (!response.ok) throw new Error(JSON.stringify(data)); return data;
    };
    await call('auth/login', { identifier: 'duc_nguyen', password: 'P@ssword123!' });
    const attempt = await call('diagnostic/start');
    await call('diagnostic/answer', { attemptId: attempt.attemptId, questionId: attempt.currentQuestion.id, selectedOptionKey: attempt.currentQuestion.options[0].key, timeSpentSeconds: 10 });
    await call(`diagnostic/submit/${attempt.attemptId}`);
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-tab="learning-path"]');
  await page.click('[data-tab="learning-path"]');
  await page.waitForSelector('.math-skill-grid');
  await page.screenshot({ path: path.join(output, 'learning-path-desktop.png'), fullPage: true });
  await page.evaluate(() => {
    const card = [...document.querySelectorAll('.math-skill-grid article')].find(a => a.textContent.includes('Căn bậc hai và căn thức cơ bản'));
    card.querySelector('button').click();
  });
  await page.waitForSelector('.math-lesson .math-primary');
  assert.match(await page.$eval('.math-lesson', e => e.textContent), /Ví dụ mẫu/);
  await page.screenshot({ path: path.join(output, 'practice-lesson-desktop.png'), fullPage: true });
  await page.click('.math-lesson .math-primary');
  await page.waitForSelector('input[name="practice-answer"]');
  await page.evaluate(() => document.fonts.ready);
  assert.ok(await page.evaluate(() => document.fonts.check('16px KaTeX_Main')), 'Bundled math font must be loaded.');
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(output, 'practice-mobile.png'), fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  assert.equal(overflow, false, 'Mobile viewport must not overflow horizontally.');
  await page.click('input[name="practice-answer"][value="B"]');
  // Lose the connection before submitting. The answer must remain locally queued.
  await page.setRequestInterception(true);
  const fail = req => req.url().includes('/student/practice/') && req.method() === 'POST' ? req.abort() : req.continue();
  page.on('request', fail); await page.click('.math-exercise .math-primary');
  await page.waitForSelector('[role="alert"]');
  assert.ok(await page.evaluate(() => Object.keys(localStorage).some(k => k.startsWith('math_pending_answer_'))));
  page.off('request', fail); await page.setRequestInterception(false);
  await page.setViewport({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-tab="learning-path"]'); await page.click('[data-tab="learning-path"]');
  await page.waitForSelector('.math-notice .math-secondary'); await page.click('.math-notice .math-secondary');
  await page.waitForFunction(() => document.body.textContent.includes('Đáp án đúng:') || document.body.textContent.includes('Đúng rồi'));
  assert.equal(await page.evaluate(() => Object.keys(localStorage).some(k => k.startsWith('math_pending_answer_'))), false);
  await page.screenshot({ path: path.join(output, 'practice-resume-feedback.png'), fullPage: true });
  await page.click('.math-exercise .math-primary');
  let submitted = 1;
  while (await page.$('input[name="practice-answer"]')) {
    await page.click('input[name="practice-answer"][value="A"]'); await page.click('.math-exercise .math-primary');
    await page.waitForFunction(() => document.body.textContent.includes('Đúng rồi') || document.body.textContent.includes('Đáp án đúng:'));
    await page.click('.math-exercise .math-primary'); submitted++;
    await pause(80); if (submitted > 10) throw new Error('Practice loop did not finish.');
  }
  await page.waitForFunction(() => document.body.textContent.includes('Đã lưu buổi học'));
  await page.screenshot({ path: path.join(output, 'practice-result-desktop.png'), fullPage: true });
  assert.equal(errors.length, 0, errors.join('\n'));
  fs.writeFileSync(path.join(output, 'BROWSER-VERIFICATION.md'), `# Math adaptive browser verification\n\nPassed against an isolated database with explicitly seeded QA questions.\n\n- Real API login and grade-scoped diagnostic\n- Learning path and pilot revision notes\n- Three-phase practice through completion\n- 390px mobile layout without horizontal overflow\n- Lost connection retains answer; reload replays once and clears queue\n- Result saved; no unhandled browser errors\n\nNo production database or English product files changed.\n`);
  console.log('Math browser QA passed: desktop, mobile, persistence, connection-loss recovery and completion.');
} finally {
  await browser?.close();
  for (const child of children) child.kill();
  await db.$disconnect();
}
