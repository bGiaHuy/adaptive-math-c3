import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const batch = JSON.parse(await readFile('content/english/batch_001.json', 'utf8'));
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true, args: ['--no-sandbox']
});

try {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => {
    const pathname = new URL(request.url()).pathname;
    const respond = value => request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(value) });
    if (pathname === '/api/v1/auth/me') return respond({ user: { id: 'student-1', username: 'demo', fullName: 'Minh Anh', role: 'STUDENT' } });
    if (pathname === '/api/v1/english/topics') return respond(batch.topics.map(topic => ({
      ...topic, lessons: batch.lessons.filter(lesson => lesson.topicId === topic.id)
        .map(({ id, title, summary, level, kind, audioUrl }) => ({ id, title, summary, level, kind, audioUrl }))
    })));
    if (pathname === '/api/v1/english/progress') return respond([]);
    if (pathname.startsWith('/api/v1/english/lessons/')) {
      const lesson = batch.lessons.find(item => item.id === pathname.split('/').at(-1));
      if (lesson) return respond({ ...lesson,
        topic: batch.topics.find(topic => topic.id === lesson.topicId),
        exercises: lesson.exercises.map(({ id, kind, prompt, options, segmentId }) => ({ id, kind, prompt, options, segmentId }))
      });
    }
    if (pathname.startsWith('/api/v1/')) return respond({});
    return request.continue();
  });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(origin, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.english-lesson-card');
  const count = await page.$$eval('.english-lesson-card', nodes => nodes.length);
  if (count !== 5) throw new Error(`Expected five lessons, found ${count}`);
  await page.click('.english-lesson-card');
  await page.waitForSelector('.english-lesson-head');
  await page.waitForFunction(() => document.querySelector('audio')?.readyState >= 1);
  const audioDuration = await page.$eval('audio', node => node.duration);
  if (Math.abs(audioDuration - 29.558) > 1) throw new Error(`Unexpected audio duration: ${audioDuration}`);
  await page.click('.english-transcript > button');
  const unverifiedNote = await page.$('.english-transcript-note');
  const replayButtons = await page.$$('.english-segment > button');
  if (!unverifiedNote || replayButtons.length) throw new Error('Unverified transcript should not allow segment replay');
  await page.screenshot({ path: join(tmpdir(), 'adaptive-learning-batch-001-desktop.png'), fullPage: true });
  await page.setViewport({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.screenshot({ path: join(tmpdir(), 'adaptive-learning-batch-001-mobile.png'), fullPage: true });
  if (overflow > 0) throw new Error(`Mobile horizontal overflow: ${overflow}`);
  console.log(JSON.stringify({ lessons: count, audioDuration, unverifiedSegmentReplayDisabled: true, mobileOverflow: overflow }));
} finally {
  await browser.close();
}
