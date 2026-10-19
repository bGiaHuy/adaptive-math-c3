/**
 * One-off cleanup script: remove English language questions that leaked
 * into the Math question bank (due to shared test-DB from integration tests).
 * Run: node scripts/clean-english-questions.cjs
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Keywords that are definitely English-language questions, not Math
const ENGLISH_PATTERNS = [
  'Choose the word',
  'She has been living',
  'If it _______ sunny',
  'since 2015',
  'underlined part',
  'pronounced differently',
  'going to',
  'present perfect',
  'passive voice',
  'conditional',
];

async function main() {
  console.log('🔍 Scanning for English questions in Math question bank...\n');

  const allQuestions = await prisma.question.findMany({
    select: { id: true, content: true, skillId: true, skill: { select: { code: true, title: true } } }
  });

  const toDelete = allQuestions.filter(q => {
    const lower = q.content.toLowerCase();
    return ENGLISH_PATTERNS.some(p => lower.includes(p.toLowerCase()));
  });

  if (toDelete.length === 0) {
    console.log('✅ No English questions found in Math question bank. Nothing to clean.');
    return;
  }

  console.log(`⚠️  Found ${toDelete.length} English question(s) misrouted to Math:\n`);
  toDelete.forEach(q => {
    console.log(`  [${q.skill?.code}] ${q.content.substring(0, 80)}...`);
  });

  console.log('\n🧹 Deleting...');
  for (const q of toDelete) {
    // Delete dependents first
    await prisma.attemptAnswer.deleteMany({ where: { questionId: q.id } });
    await prisma.mistakeRecord.deleteMany({ where: { questionId: q.id } });
    await prisma.assignmentQuestion.deleteMany({ where: { questionId: q.id } });
    await prisma.questionOption.deleteMany({ where: { questionId: q.id } });
    await prisma.question.delete({ where: { id: q.id } });
    console.log(`  ✓ Deleted: ${q.id} — "${q.content.substring(0, 60)}"`);
  }

  console.log(`\n✅ Cleanup complete. Removed ${toDelete.length} English question(s) from Math DB.`);
}

main().catch(err => {
  console.error('❌ Cleanup failed:', err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
