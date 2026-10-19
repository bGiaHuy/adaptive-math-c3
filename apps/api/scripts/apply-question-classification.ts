import { PrismaClient } from '@prisma/client';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();
async function main() {
  const plan = JSON.parse(readFileSync(resolve('../../docs/math-import/bank-classification-plan.json'), 'utf8'));
  const apply = process.argv.includes('--apply');
  const url = new URL(process.env.DATABASE_URL || '');
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('Local database required');
  const rows = await prisma.question.findMany({ include: { skill: true } });
  if (rows.length !== plan.expectedCount || new Set(plan.items.map((i: any) => i.id)).size !== rows.length) throw new Error('Bank changed: rebuild classification plan');
  for (const item of plan.items) {
    const q = rows.find(q => q.id === item.id);
    if (!q || createHash('sha256').update(q.content).digest('hex') !== item.contentHash) throw new Error(`Content changed: ${item.id}`);
    if (!['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'].includes(item.difficulty)) throw new Error('Invalid difficulty');
  }
  if (apply) {
    try { writeFileSync(resolve('../../docs/evidence/math-question-types/bank-labels-before.json'), JSON.stringify(rows.map(q => ({ id: q.id, skillId: q.skillId, difficulty: q.difficulty, cognitiveLevel: q.cognitiveLevel, source: q.source })), null, 2), { flag: 'wx' }); }
    catch (e: any) { if (e.code !== 'EEXIST') throw e; }
    await prisma.$transaction(async tx => {
      for (const skill of plan.newSkills) await tx.skillNode.upsert({ where: { code: skill.code }, create: skill, update: {} });
      const skills = await tx.skillNode.findMany();
      for (const item of plan.items) {
        const q = rows.find(q => q.id === item.id)!;
        const skill = skills.find(s => s.code === item.skillCode);
        if (!skill || skill.grade !== q.skill.grade) throw new Error('Invalid skill/grade');
        const current = await tx.question.findUniqueOrThrow({ where: { id: q.id } });
        if (current.updatedAt.getTime() !== q.updatedAt.getTime()) throw new Error('Concurrent edit: rerun review');
        const source: any = q.source && typeof q.source === 'object' && !Array.isArray(q.source) ? q.source : {};
        const classification = { version: plan.version, status: item.classificationStatus, method: 'CONTENT_RUBRIC', knowledgeArea: skill.chapter, topic: skill.title, skillCode: skill.code, difficulty: item.difficulty, cognitiveLevel: item.cognitiveLevel, reason: item.reason };
        if (q.skillId === skill.id && q.difficulty === item.difficulty && q.cognitiveLevel === item.cognitiveLevel && JSON.stringify(source.classification) === JSON.stringify(classification)) continue;
        await tx.question.update({ where: { id: q.id }, data: { skillId: skill.id, difficulty: item.difficulty, cognitiveLevel: item.cognitiveLevel, source: { ...source, classification } } });
      }
    }, { timeout: 30000 });
  }
  console.log(JSON.stringify({ apply, total: rows.length, classified: plan.items.filter((i: any) => i.classificationStatus === 'PROVISIONAL').length, needsContentReview: plan.items.filter((i: any) => i.classificationStatus === 'NEEDS_REVIEW').length }, null, 2));
}
main().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
