import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const RELEASE_DIR = path.resolve(ROOT_DIR, 'release');
const RELEASE_ZIP_NAME = 'adaptivemath-release-1.0.0-rc1.zip';
const RELEASE_ZIP_PATH = path.resolve(RELEASE_DIR, RELEASE_ZIP_NAME);
const SHA256_FILE_PATH = `${RELEASE_ZIP_PATH}.sha256`;
const STAGING_DIR = path.resolve(ROOT_DIR, '.release_staging', 'adaptivemath');
const VERIFY_DIR = path.resolve(ROOT_DIR, '.temp_release_verify');

const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  'playwright-report',
  'test-results',
  '.ui-audit',
  '.release_staging',
  '.temp_release_verify',
  'release',
  'evidence',
  '.git'
]);

const EXCLUDED_FILE_NAMES = new Set([
  '.ds_store',
  'thumbs.db',
  'desktop.ini',
  'backup_rehearsal.sql',
  'adaptivemath_demo_official_fullhd.webm'
]);

const EXCLUDED_PATTERNS = [
  /\.tsbuildinfo$/i,
  /\.log$/i,
  /\.sql$/i,
  /\.webm$/i,
  /\.swp$/i,
  /\.zip$/i,
  /\.sha256$/i,
  /^\.env(\..+)?$/i // Match .env, .env.local, .env.production, etc. EXCEPT we will explicitly check for .env.example
];

function isExcludedFile(fileName, fullPath) {
  const lower = fileName.toLowerCase();
  if (EXCLUDED_FILE_NAMES.has(lower)) return true;
  if (lower === '.env.example') return false; // Allow .env.example
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(fileName)) return true;
  }
  return false;
}

function copyDirectoryClean(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(entry.name.toLowerCase())) {
        continue;
      }
      copyDirectoryClean(srcPath, destPath);
    } else if (entry.isFile()) {
      if (isExcludedFile(entry.name, srcPath)) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function scanStagedFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanStagedFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function runCommand(cmd, cwd, stepName) {
  console.log(`\n[STEP: ${stepName}] Executing: ${cmd} (in ${cwd})`);
  const startTime = Date.now();
  try {
    execSync(cmd, {
      cwd,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        DATABASE_URL: 'postgresql://am:am_dev_password@localhost:5432/adaptivemath_test?schema=public',
        SESSION_SECRET: 'adaptivemath_test_session_secret_at_least_32_chars_long',
        REDIS_URL: 'redis://localhost:6379',
        INVITE_CODE_HMAC_SECRET: 'adaptivemath_test_invite_code_hmac_secret_key_32_chars'
      }
    });
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[PASS] ${stepName} completed in ${elapsed}s`);
    return { success: true, elapsed };
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[FAIL] ${stepName} failed after ${elapsed}s: ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log(' ADAPTIVEMATH RELEASE PACKAGING & CLEAN-MACHINE VERIFICATION');
  console.log(' Target Archive: ' + RELEASE_ZIP_NAME);
  console.log('='.repeat(80));

  // 1. Clean staging & verify directories
  console.log('\n[1/7] Cleaning staging and previous verification artifacts...');
  if (fs.existsSync(path.resolve(ROOT_DIR, '.release_staging'))) {
    fs.rmSync(path.resolve(ROOT_DIR, '.release_staging'), { recursive: true, force: true });
  }
  if (fs.existsSync(VERIFY_DIR)) {
    fs.rmSync(VERIFY_DIR, { recursive: true, force: true });
  }
  if (!fs.existsSync(RELEASE_DIR)) {
    fs.mkdirSync(RELEASE_DIR, { recursive: true });
  }
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  // 2. Stage Allowlisted Files
  console.log('\n[2/7] Staging clean source files into .release_staging/adaptivemath...');
  const rootFilesToCopy = [
    'package.json',
    'package-lock.json',
    'vite.config.js',
    'index.html',
    'README.md',
    'docker-compose.yml',
    '.env.example',
    '.gitignore'
  ];

  for (const file of rootFilesToCopy) {
    const srcFile = path.resolve(ROOT_DIR, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(STAGING_DIR, file));
    } else {
      console.warn(`[WARN] Root file not found: ${file}`);
    }
  }

  const directoriesToCopy = [
    'src',
    'packages',
    'apps',
    'docs',
    'scripts'
  ];

  for (const dir of directoriesToCopy) {
    const srcDir = path.resolve(ROOT_DIR, dir);
    const destDir = path.join(STAGING_DIR, dir);
    if (fs.existsSync(srcDir)) {
      copyDirectoryClean(srcDir, destDir);
    }
  }

  // 3. Security, Secret & Denylist Audit
  console.log('\n[3/7] Performing Secret, Credential & Hygiene Audit on staged files...');
  const stagedFiles = scanStagedFiles(STAGING_DIR);
  console.log(`Auditing ${stagedFiles.length} staged files...`);

  const securityViolations = [];
  const privateKeyPattern = /-----BEGIN (?:RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY-----/;
  const credentialPatterns = [
    /AKIA[0-9A-Z]{16}/,
    /gh[pousr]_[A-Za-z0-9_]{20,}/,
    /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/,
    /xox[baprs]-[A-Za-z0-9-]{20,}/
  ];

  for (const file of stagedFiles) {
    const rel = path.relative(STAGING_DIR, file).replace(/\\/g, '/');
    const lowerRel = rel.toLowerCase();

    // Check forbidden paths
    if (lowerRel.includes('node_modules')) {
      securityViolations.push(`Contains node_modules: ${rel}`);
    }
    if (lowerRel.includes('dist/') || lowerRel.endsWith('/dist')) {
      securityViolations.push(`Contains build output dist: ${rel}`);
    }
    if (lowerRel.endsWith('.tsbuildinfo')) {
      securityViolations.push(`Contains build cache .tsbuildinfo: ${rel}`);
    }
    if (lowerRel.endsWith('.sql')) {
      securityViolations.push(`Contains SQL dump: ${rel}`);
    }
    if (lowerRel.endsWith('.webm')) {
      securityViolations.push(`Contains large media webm: ${rel}`);
    }
    if (lowerRel.split('/').pop().startsWith('.env') && !lowerRel.endsWith('.env.example')) {
      securityViolations.push(`Contains live env file: ${rel}`);
    }
    if (/\.(pem|key|pfx|p12)$/i.test(lowerRel)) {
      securityViolations.push(`Contains certificate/private key file: ${rel}`);
    }

    // Check content of text files (skip png, jpg, webp, etc.)
    if (!/\.(png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(lowerRel)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (privateKeyPattern.test(content)) {
          securityViolations.push(`Contains private key content: ${rel}`);
        }
        if (credentialPatterns.some((pattern) => pattern.test(content))) {
          securityViolations.push(`Contains recognized credential pattern: ${rel}`);
        }
      } catch (err) {
        // Binary or unreadable text
      }
    }
  }

  if (securityViolations.length > 0) {
    console.error('\n❌ SECURITY / PACKAGING VIOLATIONS FOUND:');
    for (const v of securityViolations) {
      console.error(` - ${v}`);
    }
    throw new Error('Packaging aborted due to security / hygiene policy violations.');
  }
  console.log('✅ Denylist and known credential-pattern scan passed; this is not a comprehensive secret audit.');

  // 4. Create ZIP Archive
  console.log(`\n[4/7] Compressing into ${RELEASE_ZIP_NAME} using native bsdtar...`);
  if (fs.existsSync(RELEASE_ZIP_PATH)) {
    fs.unlinkSync(RELEASE_ZIP_PATH);
  }
  execSync(`tar -a -cf "${RELEASE_ZIP_PATH}" -C "${STAGING_DIR}" .`, { stdio: 'inherit' });

  const zipStats = fs.statSync(RELEASE_ZIP_PATH);
  const zipSizeMb = (zipStats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Release archive generated: ${RELEASE_ZIP_PATH} (${zipSizeMb} MB, ${zipStats.size} bytes)`);

  // 5. Compute SHA-256 Checksum
  console.log('\n[5/7] Computing SHA-256 Checksum...');
  const zipBuffer = fs.readFileSync(RELEASE_ZIP_PATH);
  const sha256 = crypto.createHash('sha256').update(zipBuffer).digest('hex');
  const checksumContent = `${sha256}  ${RELEASE_ZIP_NAME}\n`;
  fs.writeFileSync(SHA256_FILE_PATH, checksumContent, 'utf8');
  console.log(`✅ SHA-256: ${sha256}`);
  console.log(`✅ Checksum saved to: ${SHA256_FILE_PATH}`);

  // 6. Clean-Machine Extraction and Verification Pipeline
  console.log('\n[6/7] Extracting archive into clean temporary verification environment (.temp_release_verify)...');
  fs.mkdirSync(VERIFY_DIR, { recursive: true });
  execSync(`tar -xf "${RELEASE_ZIP_PATH}" -C "${VERIFY_DIR}"`, { stdio: 'inherit' });

  // Sanity check extracted files
  const verifyPackageJson = path.join(VERIFY_DIR, 'package.json');
  if (!fs.existsSync(verifyPackageJson)) {
    throw new Error('Extracted release package is missing root package.json');
  }

  console.log('\n[6/7 - Pipeline] Executing deterministic build, typecheck, and test suite on extracted package...');
  const pipelineResults = [];

  // Step 1: npm ci
  pipelineResults.push({
    name: 'Clean Dependency Installation (npm ci)',
    ...runCommand('npm ci', VERIFY_DIR, 'npm ci')
  });

  // Step 2: prisma generate
  pipelineResults.push({
    name: 'Prisma Client Generation (npm run prisma:generate)',
    ...runCommand('npm run prisma:generate', VERIFY_DIR, 'prisma:generate')
  });

  // Step 3: build prototype
  pipelineResults.push({
    name: 'Frontend Production Build (npm run build:prototype)',
    ...runCommand('npm run build:prototype', VERIFY_DIR, 'build:prototype')
  });

  // Step 4: typecheck
  pipelineResults.push({
    name: 'Full Monorepo Typecheck (npm run typecheck)',
    ...runCommand('npm run typecheck', VERIFY_DIR, 'typecheck')
  });

  // Step 5: build api
  pipelineResults.push({
    name: 'Backend NestJS Build (npm run build:api)',
    ...runCommand('npm run build:api', VERIFY_DIR, 'build:api')
  });

  // Step 6: test suite (Vitest against adaptivemath_test)
  pipelineResults.push({
    name: 'Automated Test Suites (npm run test -> adaptivemath_test)',
    ...runCommand('npm run test', VERIFY_DIR, 'test')
  });

  // 7. Cleanup & Generate Evidence Report
  console.log('\n[7/7] Cleaning up temporary verification directories & writing verification evidence...');
  fs.rmSync(VERIFY_DIR, { recursive: true, force: true });
  fs.rmSync(path.resolve(ROOT_DIR, '.release_staging'), { recursive: true, force: true });

  const reportContent = `# AdaptiveMath — Clean Release Package Verification Report

- **Package File:** \`${RELEASE_ZIP_NAME}\`
- **File Size:** ${zipStats.size} bytes (${zipSizeMb} MB)
- **SHA-256 Checksum:** \`${sha256}\`
- **Verification Timestamp:** ${new Date().toISOString()}
- **Environment:** Node.js ${process.version}, npm v10.x, Windows Server 2025 / 11, bsdtar 3.8.4
- **Isolated Test Database:** \`postgresql://am:***@localhost:5432/adaptivemath_test\`

---

## 1. Kết Quả Kiểm Toán Bảo Mật & Danh Mục Loại Trừ (Denylist & Security Scan)
- **Số tệp mã nguồn đóng gói:** ${stagedFiles.length} tệp
- **Kiểm tra .env, private key và mẫu credential thông dụng:** ✅ PASSED trên các mẫu đã cấu hình; chưa phải secret scan toàn diện.
- **Kiểm tra SQL dumps & binary videos:** ✅ PASSED (Loại trừ toàn bộ \`*.sql\` và \`*.webm\`)
- **Kiểm tra Cache & Build artifacts:** ✅ PASSED (Loại trừ \`node_modules\`, \`dist\`, \`*.tsbuildinfo\`)

---

## 2. Kết Quả Kiểm Chứng Clean-Machine Pipeline (Extracted Archive Verification)

| STT | Bước kiểm chứng | Lệnh thực thi | Thời gian | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
${pipelineResults.map((r, i) => `| ${i + 1} | ${r.name} | \`${r.cmd || 'ok'}\` | ${r.elapsed}s | ✅ PASS |`).join('\n')}

---

## 3. Kết Luận
Bản đóng gói mã nguồn \`${RELEASE_ZIP_NAME}\` đã được giải nén và xác minh trên cùng máy với PostgreSQL test DB có sẵn. Đây chưa phải kiểm chứng trên máy trắng độc lập, chưa gồm browser E2E hay Docker boot từ đầu. Không tự mở gate bàn giao kỹ thuật từ kết quả này.
`;

  const reportPath = path.resolve(ROOT_DIR, 'docs', 'evidence', 'RELEASE-VERIFICATION-REPORT.md');
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log(`✅ Verification report written to: ${reportPath}`);

  console.log('\n' + '='.repeat(80));
  console.log(' 🎉 RELEASE PACKAGING & VERIFICATION SUCCESSFUL!');
  console.log(` Archive:  ${RELEASE_ZIP_PATH}`);
  console.log(` SHA-256:  ${sha256}`);
  console.log('='.repeat(80) + '\n');
}

main().catch((err) => {
  console.error('\n💥 FATAL PACKAGING ERROR:', err);
  process.exit(1);
});
