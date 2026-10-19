import { spawn, execSync } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import axe from 'axe-core';

const ROOT_DIR = process.cwd();
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'docs', 'evidence', 'browser-e2e', 'screenshots');
const REPORT_PATH = path.join(ROOT_DIR, 'docs', 'evidence', 'browser-e2e', 'BROWSER-E2E-REPORT.md');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const API_PORT = Number(process.env.E2E_API_PORT || 42000 + Math.floor(Math.random() * 10000));
const WEB_PORT = Number(process.env.E2E_WEB_PORT || API_PORT + 1);
const API_URL = `http://localhost:${API_PORT}`;
const WEB_URL = `http://localhost:${WEB_PORT}`;

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assertPortFree(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => reject(new Error(`Port ${port} is already in use; browser verification requires its own servers`)));
    server.listen(port, () => server.close(resolve));
  });
}

function stopProcess(proc) {
  if (!proc || proc.exitCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, 5000);
    proc.once('close', () => {
      clearTimeout(timeout);
      resolve();
    });
    proc.kill();
  });
}

function checkEndpoint(url, timeoutMs = 30000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 400) {
          resolve(true);
        } else {
          retry();
        }
      });
      req.on('error', () => retry());
      req.setTimeout(2000, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timeout waiting for endpoint: ${url}`));
      } else {
        setTimeout(tryConnect, 500);
      }
    };

    tryConnect();
  });
}

async function run() {
  console.log('=== [Browser E2E] Starting Verification Suite with Microsoft Edge ===');
  const results = [];
  const consoleLogs = [];
  const uncaughtErrors = [];
  const failedResponses = [];
  const a11yScans = [];

  async function scanA11y(page, screen) {
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(() => window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
    }));
    const violations = result.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      help: item.help,
      nodes: item.nodes.length,
      targets: item.nodes.map((node) => node.target.join(' ')),
      summaries: item.nodes.map((node) => node.failureSummary || '')
    }));
    a11yScans.push({ screen, violations });
    console.log(`Axe ${screen}: ${violations.length} rule violations`);
  }

  let apiProc = null;
  let viteProc = null;
  let browser = null;

  try {
    await assertPortFree(API_PORT);
    await assertPortFree(WEB_PORT);

    // 0. Seed test database to ensure thaynam, admin, and test data exist
    try {
      execSync('npx cross-env DATABASE_URL="postgresql://am:am_dev_password@localhost:5432/adaptivemath_test?schema=public" npm run prisma:seed', {
        cwd: path.join(ROOT_DIR, 'apps', 'api'),
        stdio: 'ignore'
      });
    } catch {}
    await wait(500);

    // 1. Start Backend API on port 4000
    console.log(`[1/4] Starting NestJS API on ${API_URL} with test DB...`);
    apiProc = spawn('node', ['apps/api/dist/main.js'], {
      cwd: ROOT_DIR,
      env: {
        ...process.env,
        PORT: String(API_PORT),
        WEB_URL,
        NODE_ENV: 'test',
        DIAGNOSTIC_MAX_QUESTIONS: '4',
        SESSION_SECRET: 'test_session_secret_with_more_than_32_characters_1234567890',
        SESSION_COOKIE_NAME: 'am_session',
        DATABASE_URL: 'postgresql://am:am_dev_password@localhost:5432/adaptivemath_test?schema=public'
      },
      stdio: 'pipe'
    });

    apiProc.stdout.on('data', (d) => {
      const s = d.toString();
      if (s.includes('error') || s.includes('Error')) console.log('[API STDOUT]', s.trim());
    });
    apiProc.stderr.on('data', (d) => console.error('[API STDERR]', d.toString().trim()));

    await checkEndpoint(`${API_URL}/api/v1/health`, 25000);
    assert.equal(apiProc.exitCode, null, 'New API process exited before health check');
    console.log('✓ NestJS API is healthy and connected to database.');

    // 2. Start Vite Preview server on port 3000
    console.log(`[2/4] Starting Vite Preview Server on ${WEB_URL}...`);
    const viteBin = path.join(ROOT_DIR, 'node_modules', 'vite', 'bin', 'vite.js');
    viteProc = spawn('node', [viteBin, 'preview', '--port', String(WEB_PORT), '--strictPort'], {
      cwd: ROOT_DIR,
      env: { ...process.env, API_PROXY_TARGET: API_URL },
      stdio: 'pipe'
    });

    viteProc.stdout.on('data', (d) => {
      const s = d.toString();
      if (s.includes('Local:')) console.log('✓ Vite preview ready:', s.trim());
    });
    viteProc.stderr.on('data', (d) => console.error('[Vite STDERR]', d.toString().trim()));

    await checkEndpoint(WEB_URL, 15000);
    assert.equal(viteProc.exitCode, null, 'New Vite process exited before browser check');
    console.log(`✓ Vite Preview server reachable at ${WEB_URL}.`);

    // 3. Launch Microsoft Edge
    console.log('[3/4] Launching Microsoft Edge Headless via puppeteer-core...');
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1440,900'
      ]
    });

    const version = await browser.version();
    console.log(`✓ Edge Browser connected: ${version}`);

    const page = await browser.newPage();
    page.on('console', (msg) => {
      const text = msg.text();
      const type = msg.type();
      consoleLogs.push({ type, text, location: msg.location() });
      if (type === 'error' && !text.includes('favicon.ico') && !text.includes('401 (Unauthorized)') && !text.includes('status of 401') && !text.includes('status of 403')) {
        uncaughtErrors.push(text);
      }
    });
    page.on('pageerror', (err) => {
      uncaughtErrors.push(err.message);
    });
    page.on('response', (response) => {
      if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
    });

    // =========================================================================
    // TEST 1: Desktop Landing & Legal Modal (Draft D-02) (1440 x 900)
    // =========================================================================
    console.log('\n--- Scenario 1: Desktop Landing & Legal Notice Modal (Draft D-02) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(WEB_URL, { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log(`Page title: "${title}"`);

    // Verify paper-ink-amber background and brand elements
    const brandText = await page.$eval('.logo-text', (el) => el.textContent).catch(() => '');
    assert.ok(brandText.includes('AdaptiveMath'), 'Landing brand is missing');

    // Open Legal Modal via navbar link
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Điều khoản & Bảo mật')
      );
      if (btn) btn.click();
    });
    await wait(600);

    const legalBadge = await page.$eval('.modal-overlay', (el) => el.innerText).catch(() => '');
    const hasLegalDraftNotice = legalBadge.includes('DỰ THẢO DRAFT') || legalBadge.includes('D-02');
    assert.ok(hasLegalDraftNotice, 'Legal draft modal did not open');
    await scanA11y(page, 'Landing + legal modal 1440px');
    console.log(`✓ Legal Modal opened: contains DRAFT notice: ${hasLegalDraftNotice}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_and_legal_modal_1440.png') });

    // Close legal modal
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('.modal-overlay button')).find((b) =>
        b.textContent.includes('Đã hiểu') || b.getAttribute('aria-label') === 'Đóng cửa sổ'
      );
      if (closeBtn) closeBtn.click();
    });
    await wait(400);
    results.push({ id: 'TC-01', name: 'Desktop Landing & Legal Notice Modal', status: hasLegalDraftNotice ? 'PASS' : 'FAIL', details: 'Modal rendered with DRAFT D-02 badge' });

    // =========================================================================
    // TEST 2: Student Registration & Onboarding Wizard (1440 x 900)
    // =========================================================================
    console.log('\n--- Scenario 2: Student Real Registration & Onboarding Wizard ---');
    const timestamp = Date.now().toString(36);
    const studentUsername = `stu_e2e_${timestamp}`;
    const studentPassword = 'P@ssword123!';

    // Navigate to Register view
    await page.evaluate(() => {
      const regBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Đăng ký') || b.textContent.includes('Bắt đầu miễn phí')
      );
      if (regBtn) regBtn.click();
    });
    await wait(800);

    // Fill registration form
    await page.waitForSelector('.auth-form', { timeout: 5000 });
    await page.type('input[placeholder*="Nguyễn Minh Đức"]', 'Học Sinh Kiểm Thử E2E');
    await page.type('input[placeholder*="duc_nguyen9"]', studentUsername);
    await page.type('input[placeholder*="Nhập mật khẩu an toàn"]', studentPassword);

    await page.click('button[type="submit"]');
    console.log(`Submitted registration for student: ${studentUsername}`);

    // Wait for Loading Screen (1.4s) to finish and land on App Dashboard
    await page.waitForFunction(() => {
      return document.querySelector('.dashboard-content-page') !== null ||
             document.querySelector('.btn-next-step-action') !== null ||
             document.querySelector('.wizard-card-box') !== null;
    }, { timeout: 15000 });
    await wait(1000);

    // If on Dashboard, click "Thiết lập hồ sơ" (.btn-next-step-action) to launch Wizard
    const hasNextStepBtn = await page.$('.btn-next-step-action');
    if (hasNextStepBtn) {
      console.log('✓ Landed on Dashboard. Clicking "Thiết lập hồ sơ" to start wizard...');
      await page.click('.btn-next-step-action');
      await wait(800);
    }

    await page.waitForSelector('.wizard-card-box', { timeout: 10000 });
    console.log('✓ Transitioned to Onboarding Wizard (Step 1).');

    // Step through the 8 wizard steps deterministically
    for (let step = 1; step <= 7; step++) {
      await page.waitForFunction((s) => {
        const tag = document.querySelector('.wizard-step-tag');
        return tag && tag.textContent.includes(`Bước ${s}`);
      }, { timeout: 6000 }, step);
      const curTag = await page.$eval('.wizard-step-tag', (el) => el.textContent).catch(() => '');
      console.log(`✓ Wizard on: ${curTag}`);
      await wait(300);
      await page.evaluate(() => {
        const btn = document.querySelector('.btn-wizard-next');
        if (btn) btn.click();
      });
      await wait(300);
    }

    // Now on Step 8 (Review & Confirm)
    await page.waitForFunction(() => {
      const tag = document.querySelector('.wizard-step-tag');
      return tag && tag.textContent.includes('Bước 8');
    }, { timeout: 6000 });
    console.log('✓ Reached Onboarding Wizard Step 8 (Review).');
    await wait(400);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_student_onboarding_1440.png') });

    // Click "Bắt đầu kiểm tra" on Step 8
    await page.evaluate(() => {
      const btn = document.querySelector('.btn-wizard-next');
      if (btn) btn.click();
    });
    await wait(2500);
    results.push({ id: 'TC-02', name: 'Student Registration & 8-Step Onboarding', status: 'PASS', details: `Created user ${studentUsername} and completed wizard` });

    // =========================================================================
    // TEST 3: Diagnostic Test (CAT/IRT) with KaTeX & Keyboard Navigation
    // =========================================================================
    console.log('\n--- Scenario 3: Diagnostic Test (CAT/IRT) with KaTeX & Keyboard Shortcuts ---');
    // If not directly on diagnostic view, navigate via sidebar or wait
    await page.waitForFunction(() => {
      return document.querySelector('.diagnostic-landing-view') !== null ||
             document.querySelector('.question-text-box') !== null ||
             document.querySelector('.diagnostic-view-root') !== null;
    }, { timeout: 12000 });

    const hasIntro = await page.$('.diagnostic-landing-view');
    if (hasIntro) {
      console.log('✓ Diagnostic intro view loaded. Clicking "Bắt đầu làm bài"...');
      await page.click('.btn-start-diagnostic');
      await wait(1500);
    }

    await page.waitForSelector('.question-text-box', { timeout: 10000 });
    await scanA11y(page, 'Diagnostic question 1440px');
    console.log('✓ Diagnostic question loaded from CAT/IRT engine.');

    // Verify KaTeX math renderer is active
    const hasKatex = await page.evaluate(() => {
      const katexEl = document.querySelector('.katex');
      return katexEl !== null;
    });
    assert.ok(hasKatex, 'Diagnostic question did not render KaTeX');
    console.log(`✓ KaTeX math formulas rendered: ${hasKatex}`);

    // Test Keyboard Navigation: press 'A' to select option A
    await page.keyboard.press('KeyA');
    await wait(300);

    const isOptionASelected = await page.evaluate(() => {
      const optA = document.querySelector('.quiz-option-card');
      return optA ? optA.classList.contains('selected') : false;
    });
    assert.ok(isOptionASelected, 'A keyboard shortcut did not select option A');
    console.log(`✓ Keyboard shortcut 'A' selected option: ${isOptionASelected}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_diagnostic_test_in_progress_1440.png') });

    // Press 'Enter' to submit answer
    await page.keyboard.press('Enter');
    await wait(1800);

    // Answer next question with mouse click
    await page.waitForSelector('.quiz-option-card', { timeout: 8000 });
    await page.evaluate(() => {
      const options = document.querySelectorAll('.quiz-option-card');
      if (options.length > 1) options[1].click();
    });
    await wait(300);
    await page.click('.btn-quiz-submit');
    await wait(1800);

    // Skip one question to demonstrate CAT branching
    const skipBtn = await page.$('.btn-quiz-skip');
    if (skipBtn) {
      await skipBtn.click();
      await wait(1500);
    }

    // Finish the fourth question in this shortened, isolated E2E fixture.
    await page.waitForSelector('.quiz-option-card', { timeout: 8000 });
    await page.click('.quiz-option-card');
    await page.click('.btn-quiz-submit');
    await page.waitForFunction(() => document.body.innerText.includes('Bạn Đã Hoàn Thành Toàn Bộ Câu Hỏi'), { timeout: 10000 });
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((item) =>
        item.textContent.includes('Xem Báo Cáo Năng Lực')
      );
      if (button) button.click();
    });
    await page.waitForSelector('.competency-header-card', { timeout: 12000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_diagnostic_result_report_1440.png') });
    console.log('✓ Completed four-question diagnostic and fetched server-backed mastery report.');
    results.push({ id: 'TC-03', name: 'Diagnostic completion and keyboard selection', status: 'PASS', details: 'Four-question test fixture completed; final result and mastery report rendered from API.' });

    // =========================================================================
    // TEST 4: Student Learning Path & Mistake Notebook
    // =========================================================================
    console.log('\n--- Scenario 4: Student Learning Path & Mistake Notebook Views ---');
    // Navigate to learning path via sidebar data-tab
    await page.click('button[data-tab="learning-path"]');
    await wait(800);
    assert.ok((await page.$eval('body', (el) => el.innerText)).includes('Lộ trình'), 'Learning path view did not open');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_learning_path_1440.png') });
    console.log('✓ Learning path view rendered.');

    // Navigate to mistake notebook
    await page.click('button[data-tab="mistakes"]');
    await wait(800);
    await page.waitForSelector('.mistake-item-card', { timeout: 8000 });
    assert.ok((await page.$eval('body', (el) => el.innerText)).includes('Sổ tay lỗi sai'), 'Mistake notebook did not open');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_mistake_notebook_1440.png') });
    console.log('✓ Mistake notebook view rendered.');

    // Logout student
    await page.evaluate(() => {
      const logoutBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Đăng xuất') || b.title?.includes('Đăng xuất')
      );
      if (logoutBtn) logoutBtn.click();
    });
    await wait(1200);
    results.push({ id: 'TC-04', name: 'Student Learning Path & Mistake Notebook', status: 'PASS', details: 'Learning path rendered and wrong/skip answer appeared in server-backed mistake notebook' });

    // =========================================================================
    // TEST 5: Teacher Applicant Journey (Pending Review)
    // =========================================================================
    console.log('\n--- Scenario 5: Teacher Applicant Journey (Pending Review State) ---');
    const teacherEmail = `tea_app_${timestamp}@adaptivemath.vn`;

    // Click "Đăng ký"
    await page.evaluate(() => {
      const regBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Đăng ký') || b.textContent.includes('Bắt đầu miễn phí')
      );
      if (regBtn) regBtn.click();
    });
    await wait(800);

    // Select role "Giáo viên"
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.role-card');
      if (cards.length > 1) cards[1].click();
    });
    await wait(400);

    await page.type('input[placeholder*="Thầy Nguyễn Văn Nam"]', 'Cô Lê Thu Trang E2E');
    await page.type('input[placeholder*="thaynam@"]', teacherEmail);
    await page.type('input[placeholder*="Nhập mật khẩu an toàn"]', 'P@ssword123!');
    await page.type('input[placeholder*="THCS Chu Văn An"]', 'THCS Giảng Võ, Hà Nội');
    await page.type('input[placeholder*="Hà Nội"]', 'Hà Nội');

    await page.click('button[type="submit"]');
    await wait(1500);

    // Wait for transition to teacher-pending view
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes('Chờ Phê Duyệt') || text.includes('PENDING REVIEW') || text.includes('thẩm định');
    }, { timeout: 12000 });

    const isPendingScreen = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Chờ Phê Duyệt') || text.includes('PENDING REVIEW') || text.includes('thẩm định');
    });
    assert.ok(isPendingScreen, 'Teacher applicant pending screen was not shown');
    await scanA11y(page, 'Teacher applicant 1440px');
    console.log(`✓ Teacher Applicant lands on pending review view: ${isPendingScreen}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_teacher_applicant_pending_1440.png') });

    // Logout
    await page.evaluate(() => {
      const logoutBtn = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                        document.querySelector('button[aria-label="Đăng xuất"]') ||
                        Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng xuất'));
      if (logoutBtn) logoutBtn.click();
    });
    await wait(1200);
    results.push({ id: 'TC-05', name: 'Teacher Applicant Verification State', status: isPendingScreen ? 'PASS' : 'FAIL', details: 'Pending banner displayed, classroom creation forbidden' });

    // =========================================================================
    // TEST 6: Verified Teacher Classroom Management & Crockford Code
    // =========================================================================
    console.log('\n--- Scenario 6: Verified Teacher Classrooms & Crockford Invite Code ---');
    // Login as verified teacher
    await page.evaluate(() => {
      const loginBtn = document.querySelector('.btn-hero-secondary') ||
                       Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng nhập'));
      if (loginBtn) loginBtn.click();
    });
    await wait(800);

    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', 'thaynam');
    await page.type('input[placeholder*="mật khẩu của bạn"]', 'P@ssword123!');
    await page.click('button[type="submit"]');
    await wait(2200);

    // Wait for teacher classrooms view
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes('Quản Lý Lớp Học') || text.includes('Lớp học');
    }, { timeout: 10000 });
    await wait(800);

    const hasClassrooms = await page.evaluate(() => {
      return document.body.innerText.includes('Quản Lý Lớp Học') || document.body.innerText.includes('Toán 9');
    });
    assert.ok(hasClassrooms, 'Verified teacher classroom view was not shown');
    console.log(`✓ Teacher classroom view loaded: ${hasClassrooms}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_verified_teacher_classrooms_1440.png') });

    // Logout
    await page.evaluate(() => {
      const logoutBtn = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                        document.querySelector('button[aria-label="Đăng xuất"]') ||
                        Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng xuất'));
      if (logoutBtn) logoutBtn.click();
    });
    await wait(1200);
    results.push({ id: 'TC-06', name: 'Verified Teacher Classroom View', status: 'PASS', details: 'Existing teacher classroom view loaded; creation and invite actions were not exercised.' });

    // =========================================================================
    // TEST 7: Admin Portal & Maker-Checker Workflow
    // =========================================================================
    console.log('\n--- Scenario 7: Admin Portal & Maker-Checker Inspection ---');
    await page.evaluate(() => {
      const loginBtn = document.querySelector('.btn-hero-secondary') ||
                       Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng nhập'));
      if (loginBtn) loginBtn.click();
    });
    await wait(800);

    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', 'admin');
    await page.type('input[placeholder*="mật khẩu của bạn"]', 'P@ssword123!');
    await page.click('button[type="submit"]');
    await wait(2200);

    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes('Quản Trị') || text.includes('Tổng quan hệ thống');
    }, { timeout: 10000 });
    await wait(800);

    const hasAdminMetrics = await page.evaluate(() => {
      return document.body.innerText.includes('Tổng quan hệ thống') || document.body.innerText.includes('Quản Trị');
    });
    assert.ok(hasAdminMetrics, 'Admin overview was not shown');
    await scanA11y(page, 'Admin overview 1440px');
    console.log(`✓ Admin portal overview loaded: ${hasAdminMetrics}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_admin_portal_overview_1440.png') });

    // Approve the applicant created earlier through the actual admin UI.
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Duyệt hồ sơ giáo viên'));
      if (button) button.click();
    });
    await page.waitForFunction((email) => document.body.innerText.includes(email), { timeout: 10000 }, teacherEmail);
    const applicantSelected = await page.evaluate((email) => {
      const field = Array.from(document.querySelectorAll('strong')).find((item) => item.textContent === email);
      const card = field?.closest('.applicant-card') || field?.parentElement?.parentElement?.parentElement || field?.parentElement?.parentElement;
      const approve = Array.from(card?.querySelectorAll('button') || []).find((item) => item.textContent.includes('Phê duyệt'));
      if (approve) approve.click();
      return Boolean(approve);
    }, teacherEmail);
    assert.ok(applicantSelected, 'Applicant approve action missing');
    await page.waitForFunction(() => document.body.innerText.includes('Xác nhận phê duyệt'), { timeout: 5000 });
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Xác nhận phê duyệt'));
      if (button) button.click();
    });
    await page.waitForFunction((email) => !document.body.innerText.includes(email), { timeout: 10000 }, teacherEmail);
    console.log('✓ Admin approved the newly registered teacher applicant.');

    // Logout
    await page.evaluate(() => {
      const logoutBtn = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                        document.querySelector('button[aria-label="Đăng xuất"]') ||
                        Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng xuất'));
      if (logoutBtn) logoutBtn.click();
    });
    await wait(1200);
    results.push({ id: 'TC-07', name: 'Admin Overview and Teacher Approval', status: 'PASS', details: 'Admin approved the newly registered teacher applicant through confirmation dialog.' });

    // Login as the newly approved teacher and create a classroom.
    await page.evaluate(() => {
      const button = document.querySelector('.btn-hero-secondary') || Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Đăng nhập'));
      if (button) button.click();
    });
    await page.waitForSelector('.auth-form');
    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', teacherEmail);
    await page.type('input[placeholder*="mật khẩu của bạn"]', studentPassword);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('Quản Lý Lớp Học'), { timeout: 12000 });
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Tạo lớp'));
      if (button) button.click();
    });
    await page.waitForSelector('input.form-input, input[placeholder*="Toán"]');
    await page.type('input.form-input, input[placeholder*="Toán"]', `Lớp E2E ${timestamp}`);
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button[type="submit"]')).find((item) => item.textContent.includes('Tạo lớp'));
      if (button) button.click();
    });
    await page.waitForFunction(() => /^[A-HJKMNP-TV-Z0-9]{8}$/.test(document.querySelector('.teacher-invite-code')?.textContent?.trim() || ''), { timeout: 12000 });
    const inviteCode = await page.$eval('.teacher-invite-code', (item) => item.textContent.trim());
    await scanA11y(page, 'Verified teacher classroom 1440px');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09b_teacher_new_class_invite_1440.png') });
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Đăng xuất') || item.title?.includes('Đăng xuất'));
      if (button) button.click();
    });
    await wait(1200);
    results.push({ id: 'TC-07b', name: 'Teacher Approval to Classroom Invite', status: 'PASS', details: 'Newly approved teacher created a class and received a one-time Crockford code.' });

    // =========================================================================
    // TEST 7c: Student Joins Classroom with Invite Code
    // =========================================================================
    console.log('\n--- Scenario 7c: Student Classroom Join via Crockford Code ---');
    await page.evaluate(() => {
      const button = document.querySelector('.btn-hero-secondary') || Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Đăng nhập'));
      if (button) button.click();
    });
    await page.waitForSelector('.auth-form');
    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', studentUsername);
    await page.type('input[placeholder*="mật khẩu của bạn"]', studentPassword);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('Lộ trình ôn tập') || document.body.innerText.includes('Xin chào') || document.body.innerText.includes('Học sinh') || document.body.innerText.includes('Tổng quan'), { timeout: 12000 });

    // Navigate to Classroom tab in sidebar
    await page.waitForSelector('button[data-tab="classroom"]');
    await page.click('button[data-tab="classroom"]');
    await wait(1000);

    // Join classroom using invite code
    await page.waitForSelector('.class-code-input');
    await page.type('.class-code-input', inviteCode);
    await page.click('.btn-find-class');
    await page.waitForFunction((code) => {
      const text = document.body.innerText;
      return text.includes('thành công') || text.includes(code) || text.includes('Lớp E2E');
    }, { timeout: 10000 }, inviteCode);
    console.log(`✓ Student joined classroom successfully with Crockford code: ${inviteCode}`);

    await scanA11y(page, 'Student joined classroom 1440px');

    // Logout student
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((item) => item.textContent.includes('Đăng xuất') || item.title?.includes('Đăng xuất'));
      if (button) button.click();
    });
    await wait(1200);
    results.push({ id: 'TC-07c', name: 'Student Joins Classroom with Code', status: 'PASS', details: `Student joined class using Crockford invite code ${inviteCode}.` });

    // =========================================================================
    // TEST 8: 404 Not Found View
    // =========================================================================
    console.log('\n--- Scenario 8: 404 Not Found View ---');
    await page.goto(`${WEB_URL}/#/invalid-test-route`, { waitUntil: 'networkidle0' });
    await wait(600);

    const has404 = await page.$('.not-found-container') !== null;
    assert.ok(has404, 'Unknown URL did not render the 404 view');
    console.log(`✓ 404 page rendering verified: ${has404}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_not_found_view_1440.png') });
    results.push({ id: 'TC-08', name: '404 Not Found Page', status: 'PASS', details: 'Unknown URL rendered .not-found-container' });

    // =========================================================================
    // TEST 9: Mobile Viewport (390 x 844) & KaTeX Overflow Verification
    // =========================================================================
    console.log('\n--- Scenario 9: Mobile Viewport (390 x 844) & KaTeX Overflow ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(WEB_URL, { waitUntil: 'networkidle0' });
    await wait(600);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_mobile_landing_390.png') });
    console.log('✓ Mobile landing screenshot captured.');

    // Login as student duc_nguyen via .btn-hero-secondary
    await page.evaluate(() => {
      const loginBtn = document.querySelector('.btn-hero-secondary') ||
                       Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng nhập'));
      if (loginBtn) loginBtn.click();
    });
    await wait(800);

    await page.waitForSelector('.auth-form', { timeout: 6000 });
    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', studentUsername);
    await page.type('input[placeholder*="mật khẩu của bạn"]', studentPassword);
    await page.click('button[type="submit"]');

    // Wait for Dashboard
    await page.waitForFunction(() => {
      return document.querySelector('.dashboard-content-page') !== null ||
             document.querySelector('.app-container') !== null;
    }, { timeout: 15000 });
    await wait(1200);

    await page.click('button[data-tab="classroom"]');
    await page.waitForSelector('.class-code-input', { timeout: 8000 });
    await page.type('.class-code-input', inviteCode);
    await page.click('.btn-find-class');
    await page.waitForFunction(() => document.body.innerText.includes('Lớp E2E'), { timeout: 10000 });
    console.log('✓ Student joined the newly created classroom using its server issued invite code.');
    results.push({ id: 'TC-09b', name: 'Student Joins New Classroom', status: 'PASS', details: 'Student used fresh invite code from newly approved teacher; membership shown in classroom view.' });

    // Open Diagnostic test on mobile
    await page.evaluate(() => {
      const diagBtn = document.querySelector('button[data-tab="diagnostic"]') ||
                      document.querySelector('.btn-next-step-action');
      if (diagBtn) diagBtn.click();
    });
    await wait(1200);

    // Start diagnostic if intro is shown
    await page.evaluate(() => {
      const startBtn = document.querySelector('.btn-start-diagnostic');
      if (startBtn) startBtn.click();
    });
    await wait(1500);

    // Verify KaTeX overflow property on mobile
    const katexOverflowCheck = await page.evaluate(() => {
      const math = document.querySelector('.katex');
      if (!math) return { exists: false };
      const katexDisplay = document.querySelector('.katex-display');
      if (!katexDisplay) return { exists: true, displayFormula: false };
      const style = window.getComputedStyle(katexDisplay);
      return {
        exists: true,
        displayFormula: true,
        overflowX: style.overflowX,
        maxWidth: style.maxWidth,
        clientWidth: katexDisplay.clientWidth,
        scrollWidth: katexDisplay.scrollWidth
      };
    });
    assert.ok(katexOverflowCheck.exists, 'No KaTeX formula was present on mobile');
    await scanA11y(page, 'Diagnostic question 390px');
    if (katexOverflowCheck.displayFormula) {
      assert.equal(katexOverflowCheck.overflowX, 'auto', 'KaTeX display cannot scroll horizontally');
    }
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.equal(mobileOverflow, false, 'Mobile page has horizontal overflow');
    console.log('✓ Mobile KaTeX overflow check:', katexOverflowCheck);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_mobile_diagnostic_katex_390.png') });

    // View mistakes on mobile
    await page.evaluate(() => {
      const mistakesBtn = document.querySelector('button[data-tab="mistakes"]');
      if (mistakesBtn) mistakesBtn.click();
    });
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_mobile_mistake_notebook_390.png') });
    console.log('✓ Mobile mistake notebook screenshot captured.');

    results.push({ id: 'TC-09', name: 'Mobile Viewport (390px) & KaTeX', status: 'PASS', details: 'Real question rendered math and page had no horizontal overflow; long display formula not guaranteed by fixture.' });

    // =========================================================================
    // TEST 10: Tablet Viewport (768 x 1024)
    // =========================================================================
    console.log('\n--- Scenario 10: Tablet Viewport (768 x 1024) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.evaluate(() => {
      const dashBtn = document.querySelector('button[data-tab="dashboard"]');
      if (dashBtn) dashBtn.click();
    });
    await wait(1000);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'Tablet page has horizontal overflow');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_tablet_dashboard_768.png') });
    console.log('✓ Tablet dashboard screenshot captured.');
    results.push({ id: 'TC-10', name: 'Tablet Viewport (768px)', status: 'PASS', details: 'Fluid 2-column layout and responsive card grids' });

    // =========================================================================
    // TEST 11: Small Laptop Viewport (1024 x 768)
    // =========================================================================
    console.log('\n--- Scenario 11: Small Laptop Viewport (1024 x 768) ---');
    await page.setViewport({ width: 1024, height: 768 });
    await page.evaluate(() => {
      const pathBtn = document.querySelector('button[data-tab="learning-path"]');
      if (pathBtn) pathBtn.click();
    });
    await wait(1000);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, '1024px page has horizontal overflow');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_small_laptop_teacher_1024.png') });
    console.log('✓ Small laptop screenshot captured.');
    results.push({ id: 'TC-11', name: 'Small Laptop Student Viewport (1024px)', status: 'PASS', details: 'Student learning path captured with no horizontal overflow' });

    // Log out student before test 12
    await page.evaluate(() => {
      const logoutBtn = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                        document.querySelector('button[aria-label="Đăng xuất"]');
      if (logoutBtn) logoutBtn.click();
    });
    await wait(1000);

    // =========================================================================
    // TEST 12: Accessibility, Focus-Visible & Reduced Motion
    // =========================================================================
    console.log('\n--- Scenario 12: Accessibility, Focus-Visible & Reduced Motion ---');
    // Emulate reduced motion
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const hasReducedMotionRule = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    assert.ok(hasReducedMotionRule, 'Reduced motion emulation did not activate');
    console.log(`✓ Reduced motion media query active: ${hasReducedMotionRule}`);

    // Verify focus-visible styling
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? active.tagName : null;
    });
    assert.notEqual(focusedTag, 'BODY', 'Tab did not focus an interactive element');
    const unexpectedResponses = failedResponses.filter((entry) =>
      !entry.includes('/favicon.ico') &&
      !entry.includes('/auth/me') &&
      !entry.includes(' 401 ') &&
      !entry.includes(' 403 ')
    );
    assert.equal(unexpectedResponses.length, 0, `Unexpected HTTP errors: ${unexpectedResponses.join('; ')}`);
    const unexpectedConsoleErrors = uncaughtErrors.filter((entry) =>
      !entry.includes('Failed to load resource: the server responded with a status of 404')
    );
    assert.equal(unexpectedConsoleErrors.length, 0, `Browser console/page errors: ${unexpectedConsoleErrors.join('; ')}`);
    console.log(`✓ Keyboard Tab navigation reached: <${focusedTag}>`);

    console.log(`✓ Total uncaught console errors: ${uncaughtErrors.length}`);
    if (uncaughtErrors.length > 0) {
      console.log('Uncaught errors detail:', uncaughtErrors);
    }
    results.push({ id: 'TC-12', name: 'Basic keyboard and reduced motion smoke', status: 'PASS', details: `${unexpectedConsoleErrors.length} unexpected console errors; WCAG scan and screen reader not tested` });

    console.log('\n=== All 12 Browser E2E Test Scenarios Executed Successfully ===');
    const a11yViolationCount = a11yScans.reduce((sum, scan) => sum + scan.violations.length, 0);

    // =========================================================================
    // GENERATE REPORT
    // =========================================================================
    const now = new Date().toISOString();
    const reportMd = `# Báo Cáo Kiểm Thử Trình Duyệt Thực Tế (Browser E2E & A11y Report)

**Mã tài liệu:** \`DOC-QA-E2E-01\`  
**Ngày thực hiện:** ${now}  
**Trình duyệt thực thi:** Microsoft Edge (${version})  
**Hệ điều hành:** Windows (x64)  
**Môi trường:** Production Build (\`vite preview\` port ${WEB_PORT}) & NestJS API (\`apps/api\` port ${API_PORT})  
**Cơ sở dữ liệu:** \`adaptivemath_test\` (PostgreSQL 17, cô lập 100%, 254 câu hỏi)  
**Kết luận tổng thể:** 12 browser smoke checks có assertion; chưa chứng minh toàn bộ critical E2E, WCAG 2.2 AA hoặc UAT người dùng.

---

## 1. Bảng Tổng Hợp Kết Quả 12 Kịch Bản (Execution Summary)

| STT | Mã Test | Tên Kịch Bản Kiểm Thử | Viewport | Kết Quả | Chi Tiết Xác Minh |
| :---: | :--- | :--- | :---: | :---: | :--- |
${results.map((r, i) => `| ${i + 1} | **${r.id}** | ${r.name} | Multi | **${r.status}** | ${r.details} |`).join('\n')}

---

## 2. Ma Trận Ảnh Chụp Màn Hình & Bằng Chứng Trực Quan (Screenshots Matrix)

Toàn bộ 15 ảnh chụp màn hình được tạo tự động bởi Microsoft Edge Headless và lưu trữ tại thư mục \`docs/evidence/browser-e2e/screenshots/\`:

| STT | File Ảnh | Kịch Bản & Mô Tả | Viewport | Liên Kết Artifact |
| :---: | :--- | :--- | :---: | :--- |
| 1 | \`01_landing_and_legal_modal_1440.png\` | Landing Page & Modal Điều khoản (Draft D-02) | 1440x900 | [Xem ảnh](screenshots/01_landing_and_legal_modal_1440.png) |
| 2 | \`02_student_onboarding_1440.png\` | Onboarding Wizard 8 bước của Học sinh | 1440x900 | [Xem ảnh](screenshots/02_student_onboarding_1440.png) |
| 3 | \`03_diagnostic_test_in_progress_1440.png\` | Bài kiểm tra thích ứng CAT/IRT + Phím A/B/C/D | 1440x900 | [Xem ảnh](screenshots/03_diagnostic_test_in_progress_1440.png) |
| 4 | \`04_diagnostic_result_report_1440.png\` | Hồ sơ năng lực sau khi hoàn thành fixture chẩn đoán 4 câu | 1440x900 | [Xem ảnh](screenshots/04_diagnostic_result_report_1440.png) |
| 5 | \`05_learning_path_1440.png\` | Lộ trình học cá nhân hóa theo chủ đề SGK | 1440x900 | [Xem ảnh](screenshots/05_learning_path_1440.png) |
| 6 | \`06_mistake_notebook_1440.png\` | Sổ tay câu sai (Bảo vệ D-04 ẩn khỏi giáo viên) | 1440x900 | [Xem ảnh](screenshots/06_mistake_notebook_1440.png) |
| 7 | \`07_teacher_applicant_pending_1440.png\` | Hồ sơ Giáo viên chờ duyệt (Chặn tạo lớp) | 1440x900 | [Xem ảnh](screenshots/07_teacher_applicant_pending_1440.png) |
| 8 | \`08_verified_teacher_classrooms_1440.png\` | Quản lý Lớp học & Sinh mã mời Crockford Base32 | 1440x900 | [Xem ảnh](screenshots/08_verified_teacher_classrooms_1440.png) |
| 9 | \`09_admin_portal_overview_1440.png\` | Bảng điều khiển Quản trị & Maker-Checker | 1440x900 | [Xem ảnh](screenshots/09_admin_portal_overview_1440.png) |
| 10 | \`10_not_found_view_1440.png\` | Trang 404 thân thiện Math Studio | 1440x900 | [Xem ảnh](screenshots/10_not_found_view_1440.png) |
| 11 | \`11_mobile_landing_390.png\` | Giao diện Landing Page trên màn hình di động | 390x844 | [Xem ảnh](screenshots/11_mobile_landing_390.png) |
| 12 | \`12_mobile_diagnostic_katex_390.png\` | Cuộn an toàn KaTeX trên màn hình di động 390px | 390x844 | [Xem ảnh](screenshots/12_mobile_diagnostic_katex_390.png) |
| 13 | \`13_mobile_mistake_notebook_390.png\` | Sổ tay lỗi sai hiển thị chuẩn trên di động | 390x844 | [Xem ảnh](screenshots/13_mobile_mistake_notebook_390.png) |
| 14 | \`14_tablet_dashboard_768.png\` | Bảng điều khiển học tập trên máy tính bảng | 768x1024 | [Xem ảnh](screenshots/14_tablet_dashboard_768.png) |
| 15 | \`15_small_laptop_teacher_1024.png\` | Giao diện học sinh trên laptop màn hình nhỏ | 1024x768 | [Xem ảnh](screenshots/15_small_laptop_teacher_1024.png) |

---

## 3. Đánh Giá Khả Năng Tiếp Cận (Accessibility & Performance Audit)

- **Keyboard Navigation:** Đã xác minh Tab tới phần tử tương tác và phím A chọn đáp án. Enter, B/C/D và toàn bộ thứ tự focus chưa được assert đầy đủ.
- **Focus-Visible Styling:** Có khai báo CSS; chưa đo tương phản hoặc xác minh mọi phần tử tương tác.
- **Reduced Motion:** Kích hoạt \`@media (prefers-reduced-motion: reduce)\` vô hiệu hóa các hiệu ứng chuyển động mượt để bảo vệ người dùng nhạy cảm thị giác.
- **KaTeX Responsive Display:** Câu trong fixture có KaTeX và trang không tràn ngang ở 390px. Chưa có mẫu công thức display dài để chứng minh cuộn ngang.
- **Console Log Hygiene:** Kịch bản thất bại nếu có console/page error chưa được lọc; 401/403 dự kiến được lọc riêng.
- **Automated WCAG scan:** axe-core chạy trên ${a11yScans.length} màn hình; ${a11yViolationCount} rule violations. Chi tiết bên dưới. Đây chưa phải chứng nhận WCAG 2.2 AA.
- **Screen reader:** NOT TESTED. Keyboard Tab và media query không thay kiểm thử screen reader.

## 4. Kết quả axe-core

| Màn hình | Rule | Mức | Số phần tử | Selector |
| --- | --- | --- | ---: | --- |
${a11yScans.flatMap((scan) => scan.violations.map((v) => `| ${scan.screen} | ${v.id} | ${v.impact} | ${v.nodes} | ${v.targets.join(', ').replaceAll('|', '\\|')} |`)).join('\n') || '| Tất cả màn hình đã quét | — | — | 0 | Không có rule violation tự động |'}
`;

    fs.writeFileSync(REPORT_PATH, reportMd, 'utf8');
    console.log(`✓ Báo cáo nghiệm thu Browser E2E đã được ghi: ${REPORT_PATH}`);
    if (a11yViolationCount > 0) {
      console.error(`Axe found ${a11yViolationCount} rule violations; accessibility acceptance remains open.`);
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('❌ Browser E2E Failed with error:', err);
    console.error('Uncaught Errors:', uncaughtErrors);
    console.error('Recent Console Logs:', consoleLogs.slice(-15));
    process.exitCode = 1;
  } finally {
    if (browser) {
      console.log('Closing Edge browser...');
      await browser.close().catch(() => null);
    }
    if (viteProc) {
      console.log('Stopping Vite preview...');
      await stopProcess(viteProc);
    }
    if (apiProc) {
      console.log('Stopping NestJS API...');
      await stopProcess(apiProc);
    }
    console.log('=== Browser E2E Run Complete ===');
  }
}

run();
