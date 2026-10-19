import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out = 'docs/evidence/pastel-thpt';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
const report = { mode: 'UI contract fixtures; no live database or authentication verification', viewports: [], checks: [], errors: [] };
try {
  const page = await browser.newPage();
  let role = 'STUDENT';
  page.on('pageerror', error => { report.errors.push(error.stack); console.error(error.stack); });
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (!url.pathname.startsWith('/api/')) return request.continue();
    const endpoint = url.pathname.replace('/api/v1', '');
    let data = { messages: [] };
    if (endpoint === '/auth/me') data = { user: { id: 'qa-student', fullName: 'Học sinh kiểm thử', role } };
    if (endpoint === '/student/profile') data = { profile: { userId: 'qa-student', grade: 10, dailyMinutes: 45, targetGoal: 'Ôn thi cuối kỳ' }, stats: {} };
    if (endpoint === '/classrooms') data = { classrooms: [{ id: 'qa-class', name: 'Toán 10A1', grade: 10, academicYear: '2026-2027', studentCount: 0, isActive: true }] };
    if (endpoint === '/classrooms/qa-class/assignments') data = { assignments: [] };
    if (endpoint === '/admin/questions') data = [];
    if (endpoint === '/student/activity') data = { logs: {} };
    if (endpoint === '/curriculum/grades') data = [10, 11, 12].map(id => ({ id, label: `Lớp ${id}`, desc: 'Kết nối tri thức' }));
    request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
  await page.goto('http://127.0.0.1:3017/#/dashboard', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pastel-dashboard');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [1440, 1024, 768, 390, 375]) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    await page.screenshot({ path: `${out}/dashboard-${width}.png`, fullPage: true });
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, cards: document.querySelectorAll('.bento-chapter-grid .bento-card').length, font: getComputedStyle(document.querySelector('.bento-welcome h1')).fontFamily }));
    assert.ok(layout.scrollWidth <= width, `Horizontal overflow at ${width}: ${layout.scrollWidth}`);
    assert.equal(layout.cards, 9);
    report.viewports.push(layout);
  }
  await page.setViewport({ width: 1440, height: 1000 });
  await page.click('.bento-grade-tabs button:last-child');
  assert.equal(await page.$$eval('.bento-chapter-grid .bento-card', cards => cards.length), 6);
  await page.type('.bento-search input', 'xac suat');
  assert.equal(await page.$$eval('.bento-chapter-grid .bento-card', cards => cards.length), 1);
  await page.click('.bento-book-tabs button:last-child');
  await page.$eval('.bento-search input', input => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, ''); input.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForFunction(() => document.querySelectorAll('.bento-chapter-grid .bento-card').length === 3);
  report.checks.push('Grade 12: six chapters; accent-insensitive search; electives: three separate cards');
  await page.click('[data-tab="diagnostic"]');
  await page.waitForSelector('.bento-curriculum');
  assert.equal(await page.$('.diagnostic-container'), null);
  assert.match(await page.$eval('#main-content', node => node.innerText), /Kho câu hỏi THPT đang được chuẩn bị/);
  report.checks.push('Diagnostic route shows curriculum and explicit pause notice');
  await page.click('[data-tab="dashboard"]');
  await page.waitForSelector('.pastel-dashboard');
  const before = await page.$eval('.calendar-title', node => node.textContent);
  await page.click('[aria-label="Tháng sau"]');
  assert.notEqual(await page.$eval('.calendar-title', node => node.textContent), before);
  await page.click('[title="Quay lại tháng hiện tại"]');
  assert.equal(await page.$eval('.calendar-title', node => node.textContent), before);
  report.checks.push('Calendar month navigation and return to current month');
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
  report.accessibility = await page.evaluate(async () => {
    const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
    return result.violations.map(item => ({ id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
  });
  await page.keyboard.press('Tab');
  report.focus = await page.evaluate(() => ({ tag: document.activeElement.tagName, outline: getComputedStyle(document.activeElement).outlineStyle }));
  assert.equal(report.focus.outline, 'solid');
  await page.goto('http://127.0.0.1:3017/#/onboarding', { waitUntil: 'networkidle0' });
  assert.match(await page.$eval('#main-content', node => node.innerText), /Thiết lập|hồ sơ|Hồ sơ/);
  await page.click('.btn-wizard-next');
  assert.equal(await page.$$eval('button.selection-card', nodes => nodes.length), 3);
  assert.match(await page.$eval('#main-content', node => node.innerText), /Lớp 10/);
  assert.doesNotMatch(await page.$eval('#main-content', node => node.innerText), /Lớp 9/);
  await page.screenshot({ path: `${out}/onboarding.png`, fullPage: true });
  report.checks.push('Onboarding route renders with THPT configuration');
  role = 'TEACHER';
  await page.goto('http://127.0.0.1:3017/#/teacher-overview', { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.to-overview');
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
  report.teacherAccessibility = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
  for (const width of [1440, 768, 390]) {
    await page.setViewport({ width, height: 1000 });
    await page.screenshot({ path: `${out}/teacher-${width}.png`, fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Teacher overflow at ${width}`);
  }
  await page.click('[data-tab="teacher-bank"]');
  await page.waitForSelector('.bento-curriculum');
  assert.match(await page.$eval('#main-content', node => node.innerText), /Câu hỏi THCS đã tạm ẩn/);
  for (const width of [1074, 390]) {
    await page.setViewport({ width, height: 884 });
    await page.screenshot({ path: `${out}/teacher-bank-filters-${width}.png`, fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const searchLayout = await page.$eval('.bento-search', node => getComputedStyle(node).flexDirection);
    assert.equal(searchLayout, 'row');
  }
  await page.click('.bento-book-tabs button:last-child');
  await page.waitForFunction(() => document.querySelectorAll('.bento-chapter-grid .bento-card').length === 3);
  await page.click('.bento-book-tabs button:first-child');
  await page.waitForFunction(() => document.querySelectorAll('.bento-chapter-grid .bento-card').length === 9);
  const motifs = [];
  await page.setViewport({ width: 1074, height: 884 });
  for (const [index, grade, count] of [[0, 10, 9], [1, 11, 9], [2, 12, 6]]) {
    await page.click(`.bento-grade-tabs button:nth-child(${index + 1})`);
    await page.waitForFunction(expected => document.querySelectorAll('.math-topic-backdrop').length === expected, {}, count);
    motifs.push(...await page.$$eval('.math-topic-backdrop', nodes => nodes.map(n => n.dataset.motif)));
    await page.screenshot({ path: `${out}/topic-art-grade-${grade}.png`, fullPage: true });
    await page.click('.bento-book-tabs button:last-child');
    await page.waitForFunction(() => document.querySelectorAll('.math-topic-backdrop').length === 3);
    motifs.push(...await page.$$eval('.math-topic-backdrop', nodes => nodes.map(n => n.dataset.motif)));
    await page.click('.bento-book-tabs button:first-child');
    await page.waitForFunction(expected => document.querySelectorAll('.math-topic-backdrop').length === expected, {}, count);
  }
  assert.equal(new Set(motifs).size, 33);
  report.topicArt = { count: motifs.length, unique: new Set(motifs).size, decorative: await page.$$eval('.math-topic-backdrop', nodes => nodes.every(n => n.getAttribute('aria-hidden') === 'true')) };
  await page.setViewport({ width: 390, height: 884 });
  await page.screenshot({ path: `${out}/topic-art-mobile.png`, fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  report.bankAccessibility = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
  report.checks.push('Teacher overview and bank responsive; grade/search/book filters grouped; both book choices work');
  assert.equal(report.errors.length, 0);
} finally {
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
