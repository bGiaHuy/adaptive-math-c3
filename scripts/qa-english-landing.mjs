import puppeteer from 'puppeteer-core';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox']
});
try {
  const page = await browser.newPage();
  for (const [width, height, label] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    await page.setViewport({ width, height });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
    const heading = await page.$eval('h1', node => node.innerText);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await page.screenshot({ path: join(tmpdir(), `english-landing-${label}.png`), fullPage: true });
    console.log({ label, heading, overflow });
    if (overflow > 0) throw new Error(`${label} has horizontal overflow`);
  }
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    const json = value => request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(value) });
    if (url.endsWith('/auth/me')) return json({ user: { id: 'student-1', username: 'demo', fullName: 'Minh Anh', role: 'STUDENT' } });
    if (url.endsWith('/students/profile')) return json({ profile: null, stats: {} });
    if (url.endsWith('/english/topics')) return json([{ id: 'daily', title: 'Đời sống hằng ngày', lessons: [{ id: 'hello', title: 'A morning conversation', summary: 'Một cuộc hội thoại ngắn', level: 'A1', kind: 'LISTENING', audioUrl: 'https://example.org/audio.mp3' }] }]);
    if (url.endsWith('/english/progress')) return json([]);
    if (url.endsWith('/english/lessons/hello')) return json({ id: 'hello', title: 'A morning conversation', summary: 'Một cuộc hội thoại ngắn', level: 'A1', kind: 'LISTENING', topic: { id: 'daily', title: 'Đời sống hằng ngày' }, body: null, audioUrl: null, transcript: [{ id: 's1', startMs: 0, endMs: 1000, textEn: 'Good morning.' }], exercises: [{ id: 'q1', kind: 'SINGLE_CHOICE', prompt: 'What do you hear?', options: ['Good morning.', 'Good night.'] }] });
    if (url.endsWith('/english/lessons/hello/submit')) return json({ correctCount: 1, totalCount: 1, results: [{ id: 'q1', correct: true, correctAnswer: 'Good morning.' }] });
    if (url.includes('/api/v1/')) return json({});
    return request.continue();
  });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.english-hero');
  await page.screenshot({ path: join(tmpdir(), 'english-hub-desktop.png'), fullPage: true });
  await page.setViewport({ width: 390, height: 844 });
  const hubOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.screenshot({ path: join(tmpdir(), 'english-hub-mobile.png'), fullPage: true });
  console.log({ label: 'hub-mobile', overflow: hubOverflow });
  if (hubOverflow > 0) throw new Error('English hub has horizontal overflow on mobile');
  await page.setViewport({ width: 1440, height: 900 });
  await page.click('.english-lesson-card');
  await page.waitForSelector('.english-lesson-head');
  await page.click('.english-options label');
  await page.click('.english-primary');
  await page.waitForSelector('.english-result');
  console.log({ label: 'lesson-flow', result: await page.$eval('.english-result', node => node.innerText) });
} finally {
  await browser.close();
}
