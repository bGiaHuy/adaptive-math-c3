// Read-only readiness check. Does not publish, correct, or reclassify source data.
require('dotenv').config({ quiet: true });
const { PrismaClient } = require('@prisma/client');
const { selectThptDiagnostic } = require('../dist/modules/question/diagnostic-blueprint');
const { sharedThptDraftWhere } = require('../dist/modules/curriculum/thpt-catalog');
const db = new PrismaClient();
(async () => {
  for (const grade of [10, 11, 12]) {
    const inventory = await db.question.findMany({ where: { skill: { grade } }, select: { status: true, source: true } });
    const reviewStates = {};
    inventory.forEach(q => { const key = `${q.status}/${q.source?.reviewStatus || 'UNSPECIFIED'}`; reviewStates[key] = (reviewStates[key] || 0) + 1; });
    console.log(JSON.stringify({ grade, inventory: reviewStates }));
    const pool = await db.question.findMany({ where: {
      skill: { grade }, OR: [{ status: 'PUBLISHED' }, { status: 'DRAFT', source: { path: ['reviewStatus'], equals: 'VERIFIED' } }, sharedThptDraftWhere()]
    }, include: { skill: true } });
    const counts = Object.fromEntries(['SINGLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'].map(type => [type, pool.filter(q => q.questionType === type).length]));
    const matrixInventory = {};
    pool.forEach(q => { const cell = `${q.questionType}/${q.cognitiveLevel}/${q.difficulty}`; matrixInventory[cell] = (matrixInventory[cell] || 0) + 1; });
    console.log(JSON.stringify({ grade, matrixInventory }));
    try { selectThptDiagnostic(pool, 'readiness-check', grade); console.log(JSON.stringify({ grade, ready: true, counts })); }
    catch (error) { console.log(JSON.stringify({ grade, ready: false, counts, reason: error.getResponse?.() || error.message })); }
  }
})().catch(() => { console.error('Không kết nối được kho câu hỏi để kiểm tra; không thay đổi dữ liệu.'); process.exitCode = 1; }).finally(() => db.$disconnect());
