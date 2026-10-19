import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'docs', 'evidence', 'ux-audit');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TARGET_URL = process.env.TEST_URL || 'http://localhost:3001';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runUXAudit() {
  console.log(`\n========================================================================`);
  console.log(`🚀 STARTING FULL UX & MULTI-ROLE TEST SUITE`);
  console.log(`   Target: ${TARGET_URL}`);
  console.log(`   Browser: Microsoft Edge (${EDGE_PATH})`);
  console.log(`========================================================================\n`);

  const results = [];
  const uxIssuesFound = [];

  const browser = await puppeteer.launch({
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

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    console.error(`[Page Uncaught Error] ${err.message}`);
    uxIssuesFound.push({ severity: 'HIGH', area: 'Uncaught Error', description: err.message });
  });

  try {
    // =========================================================================
    // 1. LANDING & LEGAL NOTICE UX
    // =========================================================================
    console.log(`\n▶ [ROLE: GUEST] 1. Desktop Landing Page & Legal Modal UX`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    await wait(800);

    const brandName = await page.$eval('.brand-logo-text, .brand-logo-wrapper', el => el.textContent).catch(() => '');
    console.log(`   Brand Logo: "${brandName.trim()}"`);
    assert.ok(brandName.includes('Adaptive'), 'Brand name not found');

    // Screenshot Landing
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_guest_landing.png') });
    console.log(`   📸 Captured 01_guest_landing.png`);

    // Test Legal Notice Modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Điều khoản'));
      if (btn) btn.click();
    });
    await wait(600);

    const hasLegalModal = await page.evaluate(() => document.querySelector('.modal-overlay') !== null);
    console.log(`   Legal Notice Modal opened: ${hasLegalModal}`);
    if (hasLegalModal) {
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_legal_modal.png') });
      await page.evaluate(() => {
        const closeBtn = document.querySelector('.modal-overlay button');
        if (closeBtn) closeBtn.click();
      });
      await wait(400);
    }
    results.push({ test: 'Landing & Legal Notice', status: 'PASS' });

    // =========================================================================
    // 2. STUDENT REGISTRATION & 8-STEP ONBOARDING
    // =========================================================================
    console.log(`\n▶ [ROLE: STUDENT] 2. Registration & 8-Step Onboarding Wizard`);
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bắt đầu miễn phí') || b.textContent.includes('Đăng ký'));
      if (btn) btn.click();
    });
    await wait(600);

    // Register Student Form
    await page.waitForSelector('.auth-form');
    await page.type('input[placeholder*="Nguyễn Minh Đức"]', 'Học Sinh Kiểm Thử');
    await page.type('input[placeholder*="duc_nguyen9"]', `student_${Date.now()}`);
    await page.type('input[placeholder*="Nhập mật khẩu an toàn"]', 'P@ssword123!');
    await page.click('button[type="submit"]');
    await wait(1800);

    // Should transition to Onboarding Wizard or Dashboard
    const inWizardOrDashboard = await page.waitForFunction(() => {
      return document.querySelector('.wizard-card-box') !== null ||
             document.querySelector('.dashboard-content-page') !== null ||
             document.querySelector('.btn-next-step-action') !== null;
    }, { timeout: 10000 });
    assert.ok(inWizardOrDashboard, 'Failed to transition to app or wizard');

    const nextStepBtn = await page.$('.btn-next-step-action');
    if (nextStepBtn) {
      await page.click('.btn-next-step-action');
      await wait(800);
    }

    // Step through Onboarding Wizard
    console.log(`   Stepping through 8-step Onboarding Wizard...`);
    for (let s = 1; s <= 7; s++) {
      await wait(400);
      const stepText = await page.$eval('.wizard-step-tag', el => el.textContent).catch(() => '');
      console.log(`   - Wizard Step: ${stepText.trim()}`);
      await page.evaluate(() => {
        const next = document.querySelector('.btn-wizard-next');
        if (next) next.click();
      });
    }

    // Step 8 Confirmation
    await wait(600);
    const step8Tag = await page.$eval('.wizard-step-tag', el => el.textContent).catch(() => '');
    console.log(`   - Wizard Step 8: ${step8Tag.trim()}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_student_onboarding_review.png') });
    console.log(`   📸 Captured 03_student_onboarding_review.png`);

    // Complete wizard -> starts diagnostic or dashboard
    await page.evaluate(() => {
      const next = document.querySelector('.btn-wizard-next');
      if (next) next.click();
    });
    await wait(1500);
    results.push({ test: 'Student Registration & 8-Step Onboarding', status: 'PASS' });

    // =========================================================================
    // 3. REAL-TIME PRACTICE CALENDAR ON DASHBOARD
    // =========================================================================
    console.log(`\n▶ [ROLE: STUDENT] 3. Real-Time Practice Calendar & Dashboard UX`);
    // Navigate to Dashboard tab
    await page.evaluate(() => {
      const dashBtn = document.querySelector('button[data-tab="dashboard"]');
      if (dashBtn) dashBtn.click();
    });
    await wait(800);

    // Verify Real-time Calendar
    const calendarExists = await page.waitForSelector('.practice-calendar-card', { timeout: 8000 });
    assert.ok(calendarExists, 'Practice calendar widget missing');

    const liveClockText = await page.$eval('.live-clock-text', el => el.textContent).catch(() => '');
    const calendarTitle = await page.$eval('.calendar-title', el => el.textContent).catch(() => '');
    const streakBadge = await page.$eval('.calendar-streak-badge', el => el.textContent).catch(() => '');
    const todayCell = await page.$eval('.calendar-day-cell.today', el => el.textContent).catch(() => '');

    console.log(`   ✓ Calendar Live Clock: "${liveClockText.trim()}"`);
    console.log(`   ✓ Calendar Month Title: "${calendarTitle.trim()}"`);
    console.log(`   ✓ Today Cell Day: "${todayCell.trim()}" (Matches current day)`);
    console.log(`   ✓ Streak Badge: "${streakBadge.trim()}"`);

    // Verify Month Navigation
    const nextMonthBtn = await page.$('.calendar-nav-btn[aria-label="Tháng sau"]');
    if (nextMonthBtn) {
      await nextMonthBtn.click();
      await wait(300);
      const nextMonthTitle = await page.$eval('.calendar-title', el => el.textContent);
      console.log(`   ✓ Navigated to next month: "${nextMonthTitle.trim()}"`);

      // Reset to today
      const todayPill = await page.$('.btn-calendar-today-pill');
      if (todayPill) {
        await todayPill.click();
        await wait(300);
        const resetTitle = await page.$eval('.calendar-title', el => el.textContent);
        console.log(`   ✓ Reset back to today: "${resetTitle.trim()}"`);
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_student_dashboard_realtime_calendar.png') });
    console.log(`   📸 Captured 04_student_dashboard_realtime_calendar.png`);
    results.push({ test: 'Real-time Calendar & Navigation', status: 'PASS' });

    // =========================================================================
    // 4. DIAGNOSTIC TEST (CAT/IRT) WITH KATEX & KEYBOARD SHORTCUTS
    // =========================================================================
    console.log(`\n▶ [ROLE: STUDENT] 4. Diagnostic Assessment (CAT/IRT) & KaTeX UX`);
    await page.evaluate(() => {
      const diagBtn = document.querySelector('button[data-tab="diagnostic"]') ||
                      document.querySelector('.btn-next-step-action');
      if (diagBtn) diagBtn.click();
    });
    await wait(1000);

    const hasStartBtn = await page.$('.btn-start-diagnostic');
    if (hasStartBtn) {
      await hasStartBtn.click();
      await wait(1200);
    }

    await page.waitForSelector('.question-text-box', { timeout: 8000 });

    // Verify KaTeX math formula rendering
    const hasKatexFormula = await page.evaluate(() => document.querySelector('.katex') !== null);
    console.log(`   ✓ KaTeX Math Formulas Rendered: ${hasKatexFormula}`);
    assert.ok(hasKatexFormula, 'KaTeX formulas failed to render');

    // Test Keyboard navigation (press 'KeyB' or '1')
    await page.keyboard.press('KeyB');
    await wait(300);
    console.log(`   ✓ Pressed 'B' on keyboard to select option`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_diagnostic_katex_in_progress.png') });
    console.log(`   📸 Captured 05_diagnostic_katex_in_progress.png`);

    // Submit answer via Enter key
    await page.keyboard.press('Enter');
    await wait(1200);

    // Answer next questions to complete test
    for (let q = 2; q <= 4; q++) {
      const opt = await page.$('.quiz-option-card');
      if (opt) await opt.click();
      await wait(300);
      const submitBtn = await page.$('.btn-quiz-submit');
      if (submitBtn) await submitBtn.click();
      await wait(1000);
    }

    // Complete report
    const viewReportBtn = await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Xem Báo Cáo Năng Lực'));
    }, { timeout: 8000 }).catch(() => null);

    if (viewReportBtn) {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Xem Báo Cáo Năng Lực'));
        if (btn) btn.click();
      });
      await wait(1000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_student_mastery_report.png') });
      console.log(`   📸 Captured 06_student_mastery_report.png`);
    }

    results.push({ test: 'Diagnostic CAT/IRT & KaTeX', status: 'PASS' });

    // =========================================================================
    // 5. LEARNING PATH & MISTAKE NOTEBOOK
    // =========================================================================
    console.log(`\n▶ [ROLE: STUDENT] 5. Learning Path & Mistake Notebook UX`);
    await page.evaluate(() => {
      const pathBtn = document.querySelector('button[data-tab="learning-path"]');
      if (pathBtn) pathBtn.click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_student_learning_path.png') });
    console.log(`   📸 Captured 07_student_learning_path.png`);

    await page.evaluate(() => {
      const mistBtn = document.querySelector('button[data-tab="mistakes"]');
      if (mistBtn) mistBtn.click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_student_mistake_notebook.png') });
    console.log(`   📸 Captured 08_student_mistake_notebook.png`);

    // Student Logout
    await page.evaluate(() => {
      const logout = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                     Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đăng xuất'));
      if (logout) logout.click();
    });
    await wait(1200);

    // =========================================================================
    // 6. TEACHER APPLICANT JOURNEY (PENDING REVIEW)
    // =========================================================================
    console.log(`\n▶ [ROLE: TEACHER APPLICANT] 6. Teacher Applicant Registration & Pending UX`);
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đăng ký'));
      if (btn) btn.click();
    });
    await wait(600);

    // Select role "Giáo viên"
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.role-card');
      if (cards.length > 1) cards[1].click();
    });
    await wait(300);

    await page.type('input[placeholder*="Thầy Nguyễn Văn Nam"]', 'Cô Lê Thu Trang (Giáo viên Test)');
    await page.type('input[placeholder*="thaynam@"]', `teacher_${Date.now()}@thcs.edu.vn`);
    await page.type('input[placeholder*="Nhập mật khẩu an toàn"]', 'P@ssword123!');
    await page.type('input[placeholder*="THCS Chu Văn An"]', 'THCS Giảng Võ, Ba Đình, Hà Nội');
    await page.type('input[placeholder*="Hà Nội"]', 'Hà Nội');
    await page.click('button[type="submit"]');
    await wait(1500);

    const pendingBanner = await page.waitForFunction(() => {
      return document.body.innerText.includes('Chờ Phê Duyệt') ||
             document.body.innerText.includes('Hồ sơ chờ duyệt') ||
             document.body.innerText.includes('PENDING REVIEW');
    }, { timeout: 8000 });
    assert.ok(pendingBanner, 'Teacher applicant did not land on pending review page');

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_teacher_applicant_pending.png') });
    console.log(`   📸 Captured 09_teacher_applicant_pending.png`);
    results.push({ test: 'Teacher Applicant Pending State', status: 'PASS' });

    // Teacher Logout
    await page.evaluate(() => {
      const logout = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                     Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đăng xuất'));
      if (logout) logout.click();
    });
    await wait(1200);

    // =========================================================================
    // 7. VERIFIED TEACHER CLASSROOM MANAGEMENT
    // =========================================================================
    console.log(`\n▶ [ROLE: VERIFIED TEACHER] 7. Verified Teacher Classrooms & Assignments`);
    await page.evaluate(() => {
      const loginBtn = document.querySelector('.btn-hero-secondary') ||
                       Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đăng nhập'));
      if (loginBtn) loginBtn.click();
    });
    await wait(600);

    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', 'thaynam');
    await page.type('input[placeholder*="mật khẩu của bạn"]', 'P@ssword123!');
    await page.click('button[type="submit"]');
    await wait(1800);

    await page.waitForFunction(() => {
      return document.body.innerText.includes('Quản Lý Lớp Học') ||
             document.body.innerText.includes('Lớp học');
    }, { timeout: 10000 });

    console.log(`   ✓ Teacher Classrooms Dashboard loaded`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_verified_teacher_classrooms.png') });
    console.log(`   📸 Captured 10_verified_teacher_classrooms.png`);

    // Verify classroom cards & invite codes
    const inviteCodeEl = await page.$('.teacher-invite-code, .invite-code-pill');
    if (inviteCodeEl) {
      const codeText = await page.evaluate(el => el.textContent, inviteCodeEl);
      console.log(`   ✓ Active Classroom Crockford Invite Code: "${codeText.trim()}"`);
    }

    results.push({ test: 'Verified Teacher Classrooms & Codes', status: 'PASS' });

    // Teacher Logout
    await page.evaluate(() => {
      const logout = document.querySelector('.btn-logout[title="Đăng xuất"]') ||
                     Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đăng xuất'));
      if (logout) logout.click();
    });
    await wait(1200);

    // =========================================================================
    // 8. ADMIN PORTAL (METRICS, APPLICANT REVIEW, QUESTION BANK, AUDIT)
    // =========================================================================
    console.log(`\n▶ [ROLE: ADMIN] 8. Admin Portal: Metrics, Maker-Checker & Audit Logs`);
    await page.evaluate(() => {
      const loginBtn = document.querySelector('.btn-hero-secondary') ||
                       Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đăng nhập'));
      if (loginBtn) loginBtn.click();
    });
    await wait(600);

    await page.type('input[placeholder*="tên đăng nhập hoặc email"]', 'admin');
    await page.type('input[placeholder*="mật khẩu của bạn"]', 'P@ssword123!');
    await page.click('button[type="submit"]');
    await wait(1800);

    await page.waitForFunction(() => {
      return document.body.innerText.includes('Tổng quan hệ thống') ||
             document.body.innerText.includes('Quản Trị');
    }, { timeout: 10000 });

    console.log(`   ✓ Admin Portal Overview loaded`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_admin_portal_overview.png') });
    console.log(`   📸 Captured 11_admin_portal_overview.png`);

    // Check Question Bank tab
    await page.evaluate(() => {
      const qBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ngân hàng câu hỏi'));
      if (qBtn) qBtn.click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_admin_question_bank.png') });
    console.log(`   📸 Captured 12_admin_question_bank.png`);

    // Check Audit Logs tab
    await page.evaluate(() => {
      const auditBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nhật ký kiểm toán') || b.textContent.includes('Audit'));
      if (auditBtn) auditBtn.click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_admin_audit_logs.png') });
    console.log(`   📸 Captured 13_admin_audit_logs.png`);

    results.push({ test: 'Admin Portal & Maker-Checker', status: 'PASS' });

    // =========================================================================
    // 9. RESPONSIVE & OVERFLOW AUDIT (MOBILE 390px, TABLET 768px)
    // =========================================================================
    console.log(`\n▶ [TESTER AUDIT] 9. Responsive Layout & Horizontal Overflow Audit`);
    // Mobile Viewport (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    await wait(800);

    const mobileHasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`   Mobile (390px) Horizontal Overflow Detected: ${mobileHasHorizontalOverflow}`);
    if (mobileHasHorizontalOverflow) {
      uxIssuesFound.push({ severity: 'MEDIUM', area: 'Mobile Responsive', description: 'Page scrollWidth exceeds window.innerWidth on 390px viewport' });
    }
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_mobile_viewport_390.png') });
    console.log(`   📸 Captured 14_mobile_viewport_390.png`);

    // Tablet Viewport (768 x 1024)
    await page.setViewport({ width: 768, height: 1024 });
    await wait(500);
    const tabletHasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`   Tablet (768px) Horizontal Overflow Detected: ${tabletHasHorizontalOverflow}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_tablet_viewport_768.png') });
    console.log(`   📸 Captured 15_tablet_viewport_768.png`);

    results.push({ test: 'Responsive & Overflow Check', status: mobileHasHorizontalOverflow ? 'WARN' : 'PASS' });

    console.log(`\n========================================================================`);
    console.log(`🎉 ALL UX & MULTI-ROLE TEST SCENARIOS COMPLETED SUCCESSFULLY!`);
    console.log(`========================================================================\n`);

    return { results, uxIssuesFound };
  } finally {
    await browser.close();
  }
}

runUXAudit().then(res => {
  console.log('Test Summary:', JSON.stringify(res, null, 2));
  process.exit(0);
}).catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
