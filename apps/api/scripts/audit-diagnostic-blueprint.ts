import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { DIAGNOSTIC_BLUEPRINT_VERSION, DIAGNOSTIC_BLUEPRINT, selectBlueprintPaper } from '../src/modules/diagnostic/diagnostic-blueprint';

// Read-only: run with DATABASE_URL configured. No content or labels are changed.
const prisma = new PrismaClient();
async function main() {
  const pool = await prisma.question.findMany({ where: { skill: { grade: 9 }, OR: [
    { status: 'PUBLISHED' }, { status: 'DRAFT', source: { path: ['reviewStatus'], equals: 'VERIFIED' } }
  ] }, include: { skill: true } });
  let shortages: unknown[] = [];
  try { selectBlueprintPaper(pool, 'bank-audit'); }
  catch (e: any) { if (!e.getResponse) throw e; shortages = e.getResponse().shortages; }
  console.log(JSON.stringify({ blueprintVersion: DIAGNOSTIC_BLUEPRINT_VERSION, eligibleQuestions: pool.length,
    ready: shortages.length === 0, shortages, slots: DIAGNOSTIC_BLUEPRINT.map(slot => ({ ...slot,
      available: pool.filter(q => q.skill.code === slot.skillCode && q.questionType === slot.questionType &&
        q.cognitiveLevel === slot.cognitiveLevel && q.difficulty === slot.difficulty).length
    })) }, null, 2));
}
main().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
