import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createMathQaDatabase } from './math-qa-database.mjs';

// Dedicated cluster, never use or reset the development/production database.
const root = process.cwd(), folder = path.join(root, '.math-adaptive-qa', String(Date.now()));
fs.mkdirSync(folder, { recursive: true });
const port = Number(process.env.MATH_QA_DB_PORT || 55439);
const database = 'math_adaptive_qa';
const url = `postgresql://am:math_qa_local_password@127.0.0.1:${port}/${database}?schema=public&connection_limit=1&pool_timeout=30`;
const env = { ...process.env, DATABASE_URL: url, ADAPTIVE_MATH_TEST_DATABASE_URL: url };
let qa;
const prismaCli = path.join(root, 'node_modules/prisma/build/index.js');
const vitestCli = path.join(root, 'apps/api/node_modules/vitest/vitest.mjs');
const run = (args, cwd = root, capture = false) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { cwd, env, windowsHide: true, stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' });
  let output = ''; if (capture) child.stdout.on('data', chunk => { output += chunk; });
  child.once('error', reject); child.once('exit', code => code === 0 ? resolve(output) : reject(new Error(`QA command failed (${code}): ${args[0]}`)));
});
try {
  qa = await createMathQaDatabase(port);
  const current = fs.readFileSync('apps/api/prisma/schema.prisma', 'utf8');
  const baseline = current.replace(/^.*ADVANCED_APPLYING.*\r?\n/gm, '')
    .replace(/^.*mathPracticeSessions.*\r?\n/gm, '')
    .replace(/^.*(?:irtA|irtB|irtC|evidenceCount|skillIds)\s+.*\r?\n/gm, '')
    .replace(/model MathPracticeSession \{[\s\S]*?\n\}/, '')
    .replace('currentTheta   Float           @default(0)', 'currentTheta   Float           @default(0.50)');
  const baselinePath = path.join(folder, 'baseline.prisma'); fs.writeFileSync(baselinePath, baseline);
  const sql = await run([prismaCli, 'migrate', 'diff', '--from-empty', '--to-schema-datamodel', baselinePath, '--script'], root, true);
  await qa.db.exec(sql);
  // Verify additive migration preserves an existing English record and old Math parameters.
  await qa.db.exec(`INSERT INTO "EnglishTopic" ("id","title","description") VALUES ('qa-preserved-english','Unchanged','QA sentinel')`);
  await qa.db.exec(fs.readFileSync('apps/api/prisma/migrations/20261009100000_math_adaptive_loop/migration.sql', 'utf8'));
  const sentinel = await qa.db.query(`SELECT "title" FROM "EnglishTopic" WHERE "id"='qa-preserved-english'`);
  if (sentinel.rows[0]?.title !== 'Unchanged') throw new Error('English sentinel changed');
  const drift = await run([prismaCli, 'migrate', 'diff', '--from-url', url, '--to-schema-datamodel', 'apps/api/prisma/schema.prisma', '--script'], root, true);
  if (!drift.includes('This is an empty migration')) throw new Error(`Migration/schema drift: ${drift}`);
  await run([path.join(root, 'node_modules/ts-node/dist/bin.js'), 'prisma/seed.ts'], path.join(root, 'apps/api'));
  if (!process.argv.includes('--browser-only')) {
    await run([vitestCli, 'run', '--exclude', 'test/english.service.spec.ts', '--testNamePattern', '^(?!.*English)'], path.join(root, 'apps/api'));
    console.log('Math adaptive verification passed: additive migration, English record preservation, schema parity and Math tests.');
  }
  // Optional browser QA runs against this same isolated database, after API tests finish.
  if (process.argv.includes('--browser') || process.argv.includes('--browser-only')) await run([path.join(root, 'scripts/verify-math-browser.mjs')]);
} finally {
  await qa?.close().catch(() => undefined);
}
