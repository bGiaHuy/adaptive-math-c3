import { PrismaClient, QuestionDifficulty } from '@prisma/client';

// Initial content rubric only; this does not estimate calibrated IRT parameters.
const prisma = new PrismaClient();
async function main() {
  const url = new URL(process.env.DATABASE_URL || '');
  if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Local database required');
  const apply = process.argv.includes('--apply');
  const rows = await prisma.question.findMany({ where: { status: 'DRAFT', source: { path: ['reviewStatus'], equals: 'VERIFIED' } } });
  const counts: Record<string, number> = {};
  const labels = rows.map(q => {
    const text = `${q.content} ${JSON.stringify(q.statements || [])}`;
    let difficulty: QuestionDifficulty = 'EASY';
    if (q.questionType === 'TRUE_FALSE' || /rút gọn|tiếp tuyến|hệ phương trình|xác suất|thể tích|diện tích|bất phương trình/i.test(text)) difficulty = 'MEDIUM';
    if (/lớn nhất|nhỏ nhất|nguyên|tham số|m\+n|m \+ n|chuyển động|năng suất|lãi suất/i.test(text)) difficulty = 'HARD';
    if (q.cognitiveLevel === 'APPLYING') difficulty = 'HARD';
    if (q.cognitiveLevel === 'ADVANCED_APPLYING') difficulty = 'VERY_HARD';
    counts[difficulty] = (counts[difficulty] || 0) + 1;
    return { id: q.id, difficulty };
  });
  if (apply) await prisma.$transaction(labels.map(row => prisma.question.update({ where: { id: row.id }, data: { difficulty: row.difficulty } })));
  console.log(JSON.stringify({ apply, rubric: 'PROVISIONAL_CONTENT_REVIEW_REQUIRED', counts, labels }, null, 2));
}
main().finally(() => prisma.$disconnect());
