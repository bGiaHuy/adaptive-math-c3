import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { THPT_DIAGNOSTIC_MATRICES } from '../src/modules/question/diagnostic-blueprint';

// Every run owns a fresh schema. No test depends on a developer's bank or admin.
export default async function setup(project: any) {
  const base = new URL(project.config.env.DATABASE_URL);
  if (!base.pathname.endsWith('_test') && !process.env.ADAPTIVE_MATH_TEST_DATABASE_URL) {
    throw new Error('Integration tests require an explicitly configured test database.');
  }
  const schema = `c3_test_${randomUUID().replace(/-/g, '')}`;
  if (!/^c3_test_[a-f0-9]{32}$/.test(schema)) throw new Error('Invalid test schema.');
  const admin = new PrismaClient({ datasources: { db: { url: base.toString() } } });
  const cleanup = async () => {
    await admin.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await admin.$disconnect();
  };
  await admin.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
  base.searchParams.set('schema', schema);
  const url = base.toString();
  project.config.env.DATABASE_URL = url;
  const require = createRequire(import.meta.url);
  const result = spawnSync(process.execPath, [require.resolve('prisma/build/index.js'), 'db', 'push', '--skip-generate'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)), env: { ...process.env, DATABASE_URL: url }, encoding: 'utf8', timeout: 60000
  });
  if (result.status !== 0) { await cleanup(); throw new Error(`Isolated test database setup failed (exit ${result.status}).`); }
  const db = new PrismaClient({ datasources: { db: { url } } });
  try {
    const author = await db.user.create({ data: { username: 'admin', email: 'admin@isolated.test', fullName: 'Isolated test administrator',
      role: 'ADMIN', status: 'ACTIVE', passwordHash: await hash('P@ssword123!') } });
    for (const grade of [10, 11, 12]) {
      const skill = await db.skillNode.create({ data: { code: `THPT-TEST-${grade}`, title: `Chuyên đề kiểm thử lớp ${grade}`, chapter: `Chương kiểm thử ${grade}`, grade, orderIndex: 1 } });
      for (const [cellIndex, cell] of THPT_DIAGNOSTIC_MATRICES[grade].entries()) {
        for (let variant = 0; variant < cell.count + 3; variant++) await db.question.create({ data: {
          skillId: skill.id, authorId: author.id, status: 'PUBLISHED', questionType: cell.questionType as any,
          cognitiveLevel: cell.cognitiveLevel as any, difficulty: cell.difficulty as any,
          content: `Kiểm thử THPT lớp ${grade}, ô ${cellIndex}, biến thể ${variant}: tính 1 + 2.`, explanation: '1 + 2 = 3.',
          ...(cell.questionType === 'SINGLE_CHOICE' ? { options: { create: ['A','B','C','D'].map((optionKey, index) => ({ optionKey, content: String(index + 3), isCorrect: index === 0 })) } }
            : cell.questionType === 'TRUE_FALSE' ? { statements: ['a','b','c','d'].map((key, index) => ({ key, content: `1 + 2 = ${index + 3}`, isCorrect: index === 0 })) }
            : { shortAnswer: { mode: 'NUMERIC', instructions: 'Nhập số.', acceptedAnswers: ['3'], tolerance: 0 } })
        } });
      }
    }
  } catch (error) { await db.$disconnect(); await cleanup(); throw error; }
  await db.$disconnect();
  return cleanup;
}
