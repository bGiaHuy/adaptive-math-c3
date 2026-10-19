import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { createMathQaDatabase } from './math-qa-database.mjs';

// This runner never uses an existing database URL or loads an environment file.
// The database is a fresh in-memory WASM instance listening only on loopback.
const root = process.cwd();
const evidenceDir = path.join(root, 'docs/evidence/full-api-audit-2026-10-18/isolated');
fs.mkdirSync(evidenceDir, { recursive: true });
// Use an explicit random loopback port and fail closed if another process owns it.
const port = 46000 + Math.floor(Math.random() * 12000);
const isolated = await createMathQaDatabase(port);
const env = { ...process.env, NODE_ENV: 'test',
  DATABASE_URL: `postgresql://ux_test:ux_test@127.0.0.1:${port}/ux_test?schema=public&connection_limit=1`,
  ADAPTIVE_MATH_TEST_DATABASE_URL: `postgresql://ux_test:ux_test@127.0.0.1:${port}/ux_test?schema=public&connection_limit=1`,
};
function run(args, cwd, capture = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, env, stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit' });
    let output = '', errors = '';
    if (capture) { child.stdout.on('data', bytes => output += bytes); child.stderr.on('data', bytes => errors += bytes); }
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve(output) : reject(new Error(`Child exited ${code}${capture ? `: ${errors.replaceAll(env.DATABASE_URL, '[isolated database]')}` : ''}`)));
  });
}
try {
  const sql = await run([path.join(root, 'node_modules/prisma/build/index.js'), 'migrate', 'diff', '--from-empty', '--to-schema-datamodel', path.join(root, 'apps/api/prisma/schema.prisma'), '--script'], root, true);
  await isolated.db.exec(sql);
  await run(['-r', path.join(root, 'node_modules/ts-node/register'), path.join(root, 'apps/api/scripts/seed-audit-fixture.ts')], path.join(root, 'apps/api'));
  // Integration setup requires one reference skill; no accounts or questions
  // are seeded here. The suite creates its own users and assignments.
  await isolated.db.exec(`INSERT INTO "SkillNode" ("id", "code", "title", "chapter") VALUES ('ux-isolated-skill', 'UX_ISOLATED', 'Isolated test skill', 'Isolated test chapter')`);
  console.log('Fresh in-memory database initialized; no existing database selected.');
  await run([path.join(root, 'apps/api/node_modules/vitest/vitest.mjs'), 'run', '--reporter=default', '--reporter=json', `--outputFile=${path.join(evidenceDir, 'vitest-results.json')}`,
], path.join(root, 'apps/api'));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await isolated.close();
}
