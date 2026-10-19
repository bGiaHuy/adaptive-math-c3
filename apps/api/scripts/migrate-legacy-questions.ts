/**
 * Legacy Question Bank Migration Script
 * AdaptiveMath — GDPT 2018 / KNTT
 * 
 * Usage:
 *   npx ts-node scripts/migrate-legacy-questions.ts --dry-run
 *   npx ts-node scripts/migrate-legacy-questions.ts --apply
 *   npx ts-node scripts/migrate-legacy-questions.ts --apply --grade=9
 *   npx ts-node scripts/migrate-legacy-questions.ts --apply --grade=all
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, CognitiveLevel, QuestionStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Default legacy path
const DEFAULT_LEGACY_DIR = 'C:\\Users\\Administrator\\Downloads\\KHKT_hòa bình\\AdaptiveMath_THCS_KNTT_2026\\adaptivemath-main';

interface LegacyOption {
  label?: string;
  optionKey?: string;
  content: string;
  isCorrect: boolean;
}

interface LegacyIRT {
  a?: number;
  b?: number;
  c?: number;
}

interface LegacyQuestion {
  id: string;
  topicId: string;
  grade: number;
  level: 'N' | 'H' | 'V' | 'T';
  status: string;
  prompt: string;
  source: string;
  irt?: LegacyIRT;
  solution?: string;
  type: string;
  options: LegacyOption[];
}

interface LegacyTopicRaw {
  id: string;
  grade: number;
  chapter: number;
  lesson: number;
  title: string;
  chapterTitle: string;
}

// Cognitive Level mapping according to GDPT 2018 specification:
// N (Nhận biết) -> REMEMBERING
// H (Thông hiểu) -> UNDERSTANDING
// V (Vận dụng) -> APPLYING
// T (Vận dụng cao) -> ADVANCED_APPLYING
export function mapCognitiveLevel(level: string): CognitiveLevel {
  switch (level) {
    case 'N':
      return CognitiveLevel.REMEMBERING;
    case 'H':
      return CognitiveLevel.UNDERSTANDING;
    case 'V':
      return CognitiveLevel.APPLYING;
    case 'T':
      return CognitiveLevel.ADVANCED_APPLYING;
    default:
      return CognitiveLevel.REMEMBERING;
  }
}

// Parse args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || (!args.includes('--apply'));
const isApply = args.includes('--apply');
const gradeArg = args.find(a => a.startsWith('--grade='));
const targetGrade = gradeArg ? gradeArg.split('=')[1] : '9'; // Default to grade 9
const sourceDirArg = args.find(a => a.startsWith('--source-dir='));
const legacyDir = sourceDirArg ? sourceDirArg.split('=')[1] : DEFAULT_LEGACY_DIR;

async function loadLegacyData() {
  const questionsPath = path.join(legacyDir, 'data', 'questions.js');
  const topicsPath = path.join(legacyDir, 'js', 'core', 'topics.js');

  if (!fs.existsSync(questionsPath)) {
    throw new Error(`questions.js not found at: ${questionsPath}`);
  }
  if (!fs.existsSync(topicsPath)) {
    throw new Error(`topics.js not found at: ${topicsPath}`);
  }

  // Read questions.js
  const rawQ = fs.readFileSync(questionsPath, 'utf-8');
  const jsonQStr = rawQ.replace(/^window\.AM_QUESTION_BANK\s*=\s*/, '').replace(/;\s*$/, '');
  const parsedQData = JSON.parse(jsonQStr);
  const questions: LegacyQuestion[] = parsedQData.questions || [];

  // Read topics.js
  const rawT = fs.readFileSync(topicsPath, 'utf-8');
  const rawMatch = rawT.match(/const RAW = (\[[\s\S]*?\]);\s*const TOPICS/);
  let rawTopics: any[] = [];
  if (rawMatch && rawMatch[1]) {
    // Parse using Function constructor safely in node
    const fn = new Function(`return ${rawMatch[1]};`);
    rawTopics = fn();
  }

  const topics: LegacyTopicRaw[] = rawTopics.map((r: any[]) => ({
    id: r[0],
    grade: r[1],
    chapter: r[2],
    lesson: r[3],
    title: r[4],
    chapterTitle: r[5]
  }));

  return { questions, topics };
}

// Validate basic KaTeX delimiters & balance
export function validateKatexSyntax(text: string): { valid: boolean; errors: string[] } {
  if (!text) return { valid: true, errors: [] };
  const errors: string[] = [];
  
  // Check matching $ delimiters
  const singleDollarCount = (text.match(/(?<!\\)\$/g) || []).length;
  if (singleDollarCount % 2 !== 0) {
    errors.push(`Unmatched single '$' delimiter in: "${text.slice(0, 40)}..."`);
  }

  // Check matching braces within math expressions
  const mathRegex = /\$([^$]+)\$/g;
  let match;
  while ((match = mathRegex.exec(text)) !== null) {
    const expr = match[1];
    let openCount = 0;
    for (const char of expr) {
      if (char === '{') openCount++;
      if (char === '}') openCount--;
      if (openCount < 0) {
        errors.push(`Mismatched closing brace '}' in formula: "${expr}"`);
        break;
      }
    }
    if (openCount > 0) {
      errors.push(`Unclosed brace '{' in formula: "${expr}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

async function run() {
  console.log('================================================================');
  console.log('  AdaptiveMath — Legacy Question Bank Migration Tool');
  console.log('================================================================');
  console.log(`Source directory: ${legacyDir}`);
  console.log(`Execution Mode:   ${isApply ? 'APPLY (Writing to DB)' : 'DRY RUN (Validation only)'}`);
  console.log(`Target Grade:     ${targetGrade.toUpperCase()}`);
  console.log('----------------------------------------------------------------\n');

  const { questions: allQuestions, topics: allTopics } = await loadLegacyData();
  console.log(`Total legacy questions loaded: ${allQuestions.length}`);
  console.log(`Total legacy topics loaded:    ${allTopics.length}\n`);

  // Filter questions by grade
  const questions = targetGrade.toLowerCase() === 'all'
    ? allQuestions
    : allQuestions.filter(q => q.grade.toString() === targetGrade);

  const topics = targetGrade.toLowerCase() === 'all'
    ? allTopics
    : allTopics.filter(t => t.grade.toString() === targetGrade);

  console.log(`Filtering for Grade ${targetGrade}:`);
  console.log(`- Questions to process: ${questions.length}`);
  console.log(`- Topics to process:    ${topics.length}\n`);

  // Validation Phase
  console.log('Running Data Integrity & LaTeX Syntax Validation...');
  let invalidOptionCount = 0;
  let invalidCorrectCount = 0;
  let invalidKeyCount = 0;
  let katexErrorCount = 0;
  const duplicateMap = new Map<string, string[]>();

  questions.forEach(q => {
    // 1. Option count
    if (!q.options || q.options.length !== 4) {
      invalidOptionCount++;
    }

    // 2. Correct option count
    const correctOpts = (q.options || []).filter(o => o.isCorrect);
    if (correctOpts.length !== 1) {
      invalidCorrectCount++;
    }

    // 3. Option keys
    const keys = (q.options || []).map(o => o.label || o.optionKey).sort().join('');
    if (keys !== 'ABCD') {
      invalidKeyCount++;
    }

    // 4. Duplicate prompt check
    const normPrompt = q.prompt.trim();
    if (!duplicateMap.has(normPrompt)) {
      duplicateMap.set(normPrompt, []);
    }
    duplicateMap.get(normPrompt)!.push(q.id);

    // 5. KaTeX syntax
    const pCheck = validateKatexSyntax(q.prompt);
    const sCheck = validateKatexSyntax(q.solution || '');
    let optCheckValid = true;
    (q.options || []).forEach(o => {
      const oc = validateKatexSyntax(o.content);
      if (!oc.valid) optCheckValid = false;
    });

    if (!pCheck.valid || !sCheck.valid || !optCheckValid) {
      katexErrorCount++;
    }
  });

  const duplicatePromptGroups = Array.from(duplicateMap.entries()).filter(([_, ids]) => ids.length > 1);
  const totalDuplicateInstances = duplicatePromptGroups.reduce((acc, [_, ids]) => acc + ids.length - 1, 0);

  console.log('Validation Results:');
  console.log(`- Invalid option count (!= 4):      ${invalidOptionCount}`);
  console.log(`- Invalid correct count (!= 1):     ${invalidCorrectCount}`);
  console.log(`- Invalid option keys (!= A,B,C,D): ${invalidKeyCount}`);
  console.log(`- KaTeX syntax anomalies:           ${katexErrorCount}`);
  console.log(`- Duplicate prompt groups:          ${duplicatePromptGroups.length} (affecting ${totalDuplicateInstances} questions)`);
  console.log(`- Unique question prompts:          ${duplicateMap.size}`);

  // Cognitive Level Breakdown
  const levelCounts: Record<string, number> = { N: 0, H: 0, V: 0, T: 0 };
  questions.forEach(q => {
    levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
  });
  console.log('\nCognitive Level Distribution:');
  console.log(`- N (Nhận biết / REMEMBERING):   ${levelCounts.N}`);
  console.log(`- H (Thông hiểu / UNDERSTANDING): ${levelCounts.H}`);
  console.log(`- V (Vận dụng / APPLYING):       ${levelCounts.V}`);
  console.log(`- T (Vận dụng cao / APPLYING):   ${levelCounts.T}`);

  if (isDryRun && !isApply) {
    console.log('\n[DRY RUN COMPLETE] No records were written to the database.');
    console.log('To execute the actual database migration, run:');
    console.log(`  npx ts-node scripts/migrate-legacy-questions.ts --apply --grade=${targetGrade}`);
    return;
  }

  // APPLY PHASE
  console.log('\n----------------------------------------------------------------');
  console.log('APPLYING MIGRATION TO DATABASE VIA PRISMA...');
  console.log('----------------------------------------------------------------');

  // 1. Identify Author User
  let authorUser = await prisma.user.findFirst({
    where: { role: { in: [UserRole.TEACHER, UserRole.ADMIN] } }
  });

  if (!authorUser) {
    throw new Error('No verified TEACHER or ADMIN found in DB to associate as author. Run seed first.');
  }
  console.log(`Using Author: ${authorUser.fullName} (${authorUser.username}, role: ${authorUser.role})`);

  // 2. Ensure SkillNodes exist for topics
  console.log('\nSyncing SkillNodes in database...');
  const topicToSkillMap = new Map<string, string>(); // topicId -> skillNode.id

  let skillCreated = 0;
  let skillExisting = 0;

  for (const t of topics) {
    let skill = await prisma.skillNode.findUnique({
      where: { code: t.id }
    });

    if (!skill) {
      skill = await prisma.skillNode.create({
        data: {
          code: t.id,
          title: t.title,
          grade: t.grade,
          chapter: t.chapterTitle,
          orderIndex: t.chapter * 10 + t.lesson
        }
      });
      skillCreated++;
    } else {
      skillExisting++;
    }

    topicToSkillMap.set(t.id, skill.id);
  }

  console.log(`SkillNodes: ${skillCreated} created, ${skillExisting} already existed.`);

  // 3. Migrate Questions with deduplication and IN_REVIEW status
  console.log('\nMigrating questions to PostgreSQL...');
  let questionsCreated = 0;
  let questionsSkipped = 0;
  let optionsCreated = 0;

  for (const q of questions) {
    const skillId = topicToSkillMap.get(q.topicId);
    if (!skillId) {
      console.warn(`Warning: SkillNode not found for topic ${q.topicId}, skipping question ${q.id}`);
      questionsSkipped++;
      continue;
    }

    // Check if duplicate prompt already exists in this skill
    const existingQ = await prisma.question.findFirst({
      where: {
        skillId,
        content: q.prompt
      }
    });

    if (existingQ) {
      questionsSkipped++;
      continue;
    }

    const cognitiveLevel = mapCognitiveLevel(q.level);
    
    // Format explanation with legacy IRT and source metadata for traceability
    const irtMeta = q.irt 
      ? `\n\n[Tham số IRT ban đầu: a=${q.irt.a ?? 1.0}, b=${q.irt.b ?? 0.0}, c=${q.irt.c ?? 0.25}; Mức gốc: ${q.level}; Nguồn: ${q.source || 'GDPT 2018'}]`
      : `\n\n[Mức gốc: ${q.level}; Nguồn: ${q.source || 'GDPT 2018'}]`;
    const fullExplanation = (q.solution || 'Chưa có lời giải chi tiết.') + irtMeta;

    // Build options
    const optionsData = q.options.map(opt => ({
      optionKey: (opt.label || opt.optionKey || 'A').toUpperCase(),
      content: opt.content,
      isCorrect: !!opt.isCorrect
    }));

    // Create question with IN_REVIEW status (Blocked from diagnostic CAT until approved)
    await prisma.question.create({
      data: {
        skillId,
        versionNumber: 1,
        cognitiveLevel,
        irtA: q.irt?.a ?? null,
        irtB: q.irt?.b ?? null,
        irtC: q.irt?.c ?? null,
        content: q.prompt,
        explanation: fullExplanation,
        status: QuestionStatus.IN_REVIEW, // Required by Maker-Checker: NOT PUBLISHED
        authorId: authorUser.id,
        reviewerId: null, // PENDING review by Academic Lead / Admin
        options: {
          create: optionsData
        }
      }
    });

    questionsCreated++;
    optionsCreated += optionsData.length;

    if (questionsCreated % 50 === 0) {
      console.log(`  -> Migrated ${questionsCreated} questions...`);
    }
  }

  console.log('\n================================================================');
  console.log('MIGRATION SUMMARY (DATABASE WRITE COMPLETE)');
  console.log('================================================================');
  console.log(`- Questions created (Status: IN_REVIEW): ${questionsCreated}`);
  console.log(`- Questions skipped (Duplicates/Missing): ${questionsSkipped}`);
  console.log(`- Options created:                        ${optionsCreated}`);
  console.log(`- SkillNodes mapped:                      ${topicToSkillMap.size}`);
  console.log('All newly imported questions are safely set to status `IN_REVIEW`.');
  console.log('================================================================\n');
}

if (require.main === module) {
  run()
    .catch((err) => {
      console.error('Migration failed with error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
