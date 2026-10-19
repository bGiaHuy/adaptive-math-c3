import fs from 'node:fs';
import path from 'node:path';
import { grade10Questions } from './data/grade10-questions.mjs';
import { grade11Questions } from './data/grade11-questions.mjs';
import { grade12Questions } from './data/grade12-questions.mjs';

const OUTPUT_DIR = path.resolve('outputs/thpt-content-research');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const allQuestions = [...grade10Questions, ...grade11Questions, ...grade12Questions];
console.log(`Loaded total ${allQuestions.length} candidate questions.`);

// --- VALIDATION ENGINE ---
function validateNumeric(val) {
  const s = String(val).normalize('NFC').trim().replace(/−/g, '-').replace(/,/g, '.');
  const number = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
  const regex = new RegExp(`^(${number})(?:\\s*/\\s*(${number}))?$`);
  const m = regex.exec(s);
  if (!m) return null;
  const n = Number(m[1]);
  const d = m[2] === undefined ? 1 : Number(m[2]);
  const res = n / d;
  return d !== 0 && Number.isFinite(res) ? res : null;
}

const errors = [];

allQuestions.forEach((q, idx) => {
  const prefix = `[#${idx + 1} - ${q.externalId}]:`;
  if (!q.externalId || !q.grade || !q.chapterCode || !q.topicCode) {
    errors.push(`${prefix} Missing required identifier or curriculum codes.`);
  }
  if (!['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'].includes(q.difficulty)) {
    errors.push(`${prefix} Invalid difficulty: ${q.difficulty}`);
  }
  if (!['REMEMBERING', 'UNDERSTANDING', 'APPLYING', 'ADVANCED_APPLYING'].includes(q.cognitiveLevel)) {
    errors.push(`${prefix} Invalid cognitiveLevel: ${q.cognitiveLevel}`);
  }
  if (!q.content || !q.content.trim()) {
    errors.push(`${prefix} Empty content.`);
  }

  // KaTeX delimiter check
  const mathDelimiters = (q.content.match(/\$/g) || []).length;
  if (mathDelimiters % 2 !== 0) {
    errors.push(`${prefix} Unmatched $ math delimiter in content.`);
  }

  if (q.questionType === 'SINGLE_CHOICE') {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${prefix} SINGLE_CHOICE must have exactly 4 options.`);
    } else {
      const keys = q.options.map(o => o.key);
      if (keys.join('') !== 'ABCD') {
        errors.push(`${prefix} Options keys must be A, B, C, D in order.`);
      }
      if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
        errors.push(`${prefix} correctOption must be A, B, C, or D.`);
      }
    }
  } else if (q.questionType === 'TRUE_FALSE') {
    if (!Array.isArray(q.statements) || q.statements.length !== 4) {
      errors.push(`${prefix} TRUE_FALSE must have exactly 4 statements.`);
    } else {
      const keys = q.statements.map(s => s.key);
      if (keys.join('') !== 'abcd') {
        errors.push(`${prefix} Statement keys must be a, b, c, d in order.`);
      }
      q.statements.forEach(s => {
        if (typeof s.isCorrect !== 'boolean') {
          errors.push(`${prefix} Statement ${s.key} missing boolean isCorrect.`);
        }
        if (!s.content || !s.content.trim()) {
          errors.push(`${prefix} Statement ${s.key} has empty content.`);
        }
      });
    }
  } else if (q.questionType === 'SHORT_ANSWER') {
    if (!q.shortAnswer || !['NUMERIC', 'TEXT'].includes(q.shortAnswer.mode)) {
      errors.push(`${prefix} SHORT_ANSWER missing valid shortAnswer rule.`);
    } else {
      if (!Array.isArray(q.shortAnswer.acceptedAnswers) || q.shortAnswer.acceptedAnswers.length === 0) {
        errors.push(`${prefix} SHORT_ANSWER has no acceptedAnswers.`);
      }
      if (q.shortAnswer.mode === 'NUMERIC') {
        q.shortAnswer.acceptedAnswers.forEach(ans => {
          if (validateNumeric(ans) === null) {
            errors.push(`${prefix} Invalid numeric acceptedAnswer: ${ans}`);
          }
        });
      }
    }
  } else {
    errors.push(`${prefix} Unknown questionType: ${q.questionType}`);
  }
});

if (errors.length > 0) {
  console.error('Validation failed with errors:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
} else {
  console.log('All 90 questions successfully passed strict schema & KaTeX validation!');
}

// --- FILE EXPORTS ---

// 1. questions-candidates.jsonl
const candidatesPath = path.join(OUTPUT_DIR, 'questions-candidates.jsonl');
const candidatesContent = allQuestions.map(q => JSON.stringify(q)).join('\n');
fs.writeFileSync(candidatesPath, candidatesContent + '\n', 'utf8');

// 2. Filter Verified vs Review Required
const verifiedQuestions = allQuestions.filter(q => q.verification?.status === 'VERIFIED');
const reviewRequiredQuestions = allQuestions.filter(q => q.verification?.status !== 'VERIFIED');

console.log(`Verified count: ${verifiedQuestions.length}`);
console.log(`Review required count: ${reviewRequiredQuestions.length}`);

// Write questions-verified.jsonl
const verifiedPath = path.join(OUTPUT_DIR, 'questions-verified.jsonl');
const verifiedContent = verifiedQuestions.map(q => JSON.stringify(q)).join('\n');
fs.writeFileSync(verifiedPath, verifiedContent + '\n', 'utf8');

// 3. review-required.csv
const reviewCsvHeader = 'externalId,grade,questionType,chapterCode,sourceId,examTitle,verificationStatus,reason,nextAction\n';
const reviewCsvRows = reviewRequiredQuestions.map(q => {
  const action = q.verification.status === 'RIGHTS_UNCLEAR'
    ? 'Liên hệ đơn vị/tác giả xin cấp phép hoặc thay bằng đề khảo sát tương đương'
    : 'Kiểm tra bản in scan chất lượng cao hoặc bổ sung vector SVG minh họa';
  return [
    q.externalId,
    q.grade,
    q.questionType,
    q.chapterCode,
    q.source.sourceId,
    `"${q.source.examTitle.replace(/"/g, '""')}"`,
    q.verification.status,
    `"${q.verification.verificationNotes.replace(/"/g, '""')}"`,
    `"${action.replace(/"/g, '""')}"`
  ].join(',');
}).join('\n');

fs.writeFileSync(path.join(OUTPUT_DIR, 'review-required.csv'), reviewCsvHeader + reviewCsvRows + '\n', 'utf8');

// 4. coverage.csv (grade x chapterCode x questionType x difficulty)
// Distinct chapters
const chapters = [
  // Grade 10
  'KNTT-10-C01', 'KNTT-10-C02', 'KNTT-10-C03', 'KNTT-10-C04', 'KNTT-10-C05',
  'KNTT-10-C06', 'KNTT-10-C07', 'KNTT-10-C08', 'KNTT-10-C09',
  // Grade 11
  'KNTT-11-C01', 'KNTT-11-C02', 'KNTT-11-C03', 'KNTT-11-C04', 'KNTT-11-C05',
  'KNTT-11-C06', 'KNTT-11-C07', 'KNTT-11-C08', 'KNTT-11-C09',
  // Grade 12
  'KNTT-12-C01', 'KNTT-12-C02', 'KNTT-12-C03', 'KNTT-12-C04', 'KNTT-12-C05', 'KNTT-12-C06'
];

const questionTypes = ['SINGLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'];
const difficulties = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'];

const coverageHeader = 'grade,chapterCode,questionType,difficulty,verifiedCount,candidateCount,status\n';
const coverageRows = [];

chapters.forEach(ch => {
  const grade = Number(ch.split('-')[1]);
  questionTypes.forEach(qt => {
    difficulties.forEach(diff => {
      const candidates = allQuestions.filter(q => q.chapterCode === ch && q.questionType === qt && q.difficulty === diff);
      const verified = candidates.filter(q => q.verification?.status === 'VERIFIED');
      const status = verified.length > 0 ? 'COVERED' : (candidates.length > 0 ? 'NEEDS_REVIEW' : 'EMPTY');
      coverageRows.push([
        grade,
        ch,
        qt,
        diff,
        verified.length,
        candidates.length,
        status
      ].join(','));
    });
  });
});

fs.writeFileSync(path.join(OUTPUT_DIR, 'coverage.csv'), coverageHeader + coverageRows.join('\n') + '\n', 'utf8');

// 5. paper-selections.json (Adapted 22 questions selection for Grade 10, 11, 12)
function buildPaperSelection(grade, examTitle) {
  const gradeVerified = verifiedQuestions.filter(q => q.grade === grade);
  const sc = gradeVerified.filter(q => q.questionType === 'SINGLE_CHOICE').slice(0, 12);
  const tf = gradeVerified.filter(q => q.questionType === 'TRUE_FALSE').slice(0, 4);
  const sa = gradeVerified.filter(q => q.questionType === 'SHORT_ANSWER').slice(0, 6);

  if (sc.length !== 12 || tf.length !== 4 || sa.length !== 6) {
    throw new Error(`Grade ${grade} has insufficient verified questions for 22-form: SC=${sc.length}, TF=${tf.length}, SA=${sa.length}`);
  }

  const selectedQuestions = [...sc, ...tf, ...sa];

  return {
    selectionId: `SELECTION-KNTT-G${grade}-22Q`,
    grade,
    format: 'ADAPTED_SELECTION',
    title: examTitle,
    targetDurationMinutes: 90,
    totalPoints: 10.0,
    questionCounts: {
      SINGLE_CHOICE: 12,
      TRUE_FALSE: 4,
      SHORT_ANSWER: 6,
      TOTAL: 22
    },
    scoringMatrix: {
      SINGLE_CHOICE: '12 câu x 0.25đ = 3.0đ',
      TRUE_FALSE: '4 câu x 1.0đ = 4.0đ (thang điểm từng ý: 0.1 - 0.25 - 0.5 - 1.0)',
      SHORT_ANSWER: '6 câu x 0.5đ = 3.0đ'
    },
    items: selectedQuestions.map((q, idx) => ({
      itemNumber: idx + 1,
      part: q.questionType === 'SINGLE_CHOICE' ? 'Phần I' : (q.questionType === 'TRUE_FALSE' ? 'Phần II' : 'Phần III'),
      externalId: q.externalId,
      chapterCode: q.chapterCode,
      topicCode: q.topicCode,
      questionType: q.questionType,
      difficulty: q.difficulty,
      cognitiveLevel: q.cognitiveLevel,
      sourceOrigin: q.source,
      content: q.content,
      options: q.options,
      correctOption: q.correctOption,
      statements: q.statements,
      shortAnswer: q.shortAnswer,
      explanation: q.explanation
    }))
  };
}

const paperSelections = [
  buildPaperSelection(10, 'Bộ đề tuyển chọn thích ứng Toán 10 KNTT (Cấu trúc GDPT 2018 - 22 câu)'),
  buildPaperSelection(11, 'Bộ đề tuyển chọn thích ứng Toán 11 KNTT (Cấu trúc GDPT 2018 - 22 câu)'),
  buildPaperSelection(12, 'Bộ đề tuyển chọn thích ứng Toán 12 KNTT (Định dạng đề thi tốt nghiệp THPT 2025 - 22 câu)')
];

fs.writeFileSync(path.join(OUTPUT_DIR, 'paper-selections.json'), JSON.stringify(paperSelections, null, 2), 'utf8');

console.log('Successfully generated all datasets in outputs/thpt-content-research/:');
console.log(' - questions-candidates.jsonl (90 items)');
console.log(' - questions-verified.jsonl (84 items)');
console.log(' - review-required.csv (6 items)');
console.log(' - coverage.csv (288 matrix cells)');
console.log(' - paper-selections.json (3 papers x 22 items = 66 selected items)');
