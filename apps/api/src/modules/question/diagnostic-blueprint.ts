import { BadRequestException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { QUESTION_LABEL_RUBRIC } from './question-label-rubric';

export const DIAGNOSTIC_BLUEPRINT_VERSION = 'math9-comprehensive-v1';
// Project assessment blueprint, informed by reference matrices; not an official national exam.
// Each slot fixes content, cognitive demand AND editorial difficulty independently of the account.
const definitions = [
  ['SINGLE_CHOICE', 'SKILL-03', 'REMEMBERING', 'EASY', 'Hệ phương trình bậc nhất hai ẩn'],
  ['SINGLE_CHOICE', 'MATH9-LINEAR-EQUATIONS', 'REMEMBERING', 'EASY', 'Phương trình quy về bậc nhất'],
  ['SINGLE_CHOICE', 'MATH9-LINEAR-INEQUALITY', 'REMEMBERING', 'EASY', 'Bất đẳng thức và bất phương trình'],
  ['SINGLE_CHOICE', 'SKILL-01', 'REMEMBERING', 'EASY', 'Căn bậc hai'],
  ['SINGLE_CHOICE', 'MATH9-CUBE-ROOTS', 'REMEMBERING', 'EASY', 'Căn bậc ba'],
  ['SINGLE_CHOICE', 'MATH9-QUADRATIC-FUNCTIONS', 'REMEMBERING', 'EASY', 'Hàm số y = ax² và đồ thị'],
  ['SINGLE_CHOICE', 'SKILL-05', 'UNDERSTANDING', 'MEDIUM', 'Phương trình bậc hai'],
  ['SINGLE_CHOICE', 'SKILL-07', 'REMEMBERING', 'EASY', 'Tỉ số lượng giác và tam giác vuông'],
  ['SINGLE_CHOICE', 'SKILL-08', 'REMEMBERING', 'EASY', 'Đường tròn, góc, cung, tiếp tuyến'],
  ['SINGLE_CHOICE', 'MATH9-CYCLIC-POLYGONS', 'UNDERSTANDING', 'MEDIUM', 'Tứ giác nội tiếp, đa giác đều'],
  ['SINGLE_CHOICE', 'MATH9-STATISTICS', 'REMEMBERING', 'EASY', 'Thống kê, tần số và tần số tương đối'],
  ['SINGLE_CHOICE', 'MATH9-SOLIDS', 'UNDERSTANDING', 'MEDIUM', 'Hình trụ, hình nón, hình cầu'],
  ['TRUE_FALSE', 'SKILL-04', 'UNDERSTANDING', 'MEDIUM', 'Mô hình hóa bằng phương trình và hệ phương trình'],
  ['TRUE_FALSE', 'SKILL-02', 'UNDERSTANDING', 'MEDIUM', 'Biến đổi căn thức'],
  ['TRUE_FALSE', 'SKILL-08', 'UNDERSTANDING', 'MEDIUM', 'Quan hệ hình học đường tròn'],
  ['TRUE_FALSE', 'MATH9-STATISTICS', 'UNDERSTANDING', 'MEDIUM', 'Đọc và phân tích dữ liệu'],
  ['SHORT_ANSWER', 'SKILL-06', 'APPLYING', 'HARD', 'Định lí Viète và ứng dụng'],
  ['SHORT_ANSWER', 'MATH9-LINEAR-INEQUALITY', 'APPLYING', 'HARD', 'Vận dụng bất phương trình'],
  ['SHORT_ANSWER', 'MATH9-PROBABILITY', 'APPLYING', 'HARD', 'Xác suất của biến cố'],
  ['SHORT_ANSWER', 'MATH9-SOLIDS', 'APPLYING', 'HARD', 'Diện tích, thể tích trong thực tiễn'],
  ['SHORT_ANSWER', 'SKILL-02', 'ADVANCED_APPLYING', 'VERY_HARD', 'Căn thức tổng hợp và cực trị'],
  ['SHORT_ANSWER', 'MATH9-CYCLIC-POLYGONS', 'ADVANCED_APPLYING', 'VERY_HARD', 'Hình học nội tiếp tổng hợp']
] as const;
export const DIAGNOSTIC_BLUEPRINT = definitions.map(([questionType, skillCode, cognitiveLevel, difficulty, topic], index) => ({
  slot: index + 1, questionType, skillCode, cognitiveLevel, difficulty, topic
}));

const contentKey = (q: any) => String(q.content).normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
const matches = (q: any, slot: typeof DIAGNOSTIC_BLUEPRINT[number], requireTopics = true) =>
  (!requireTopics || q.skill?.code === slot.skillCode) && q.questionType === slot.questionType &&
  q.cognitiveLevel === slot.cognitiveLevel && q.difficulty === slot.difficulty;
const rank = (seed: string, slot: number, id: string) => createHash('sha256').update(JSON.stringify([seed, slot, id])).digest('hex');

export const THPT_DIAGNOSTIC_BLUEPRINT_VERSION = 'thpt-entry-matrix-v1';
type ThptCell = { questionType: string; cognitiveLevel: string; difficulty: string; count: number };
const cell = (questionType: string, cognitiveLevel: string, difficulty: string, count: number): ThptCell => ({ questionType, cognitiveLevel, difficulty, count });
// Fixed project matrices based on the independently reviewed bank. They are not
// national exam matrices and must never be recalculated from the candidate pool.
export const THPT_DIAGNOSTIC_MATRICES: Readonly<Record<number, readonly ThptCell[]>> = {
  10: [cell('SINGLE_CHOICE', 'UNDERSTANDING', 'EASY', 4), cell('SINGLE_CHOICE', 'UNDERSTANDING', 'MEDIUM', 8),
    cell('TRUE_FALSE', 'UNDERSTANDING', 'MEDIUM', 2), cell('SHORT_ANSWER', 'UNDERSTANDING', 'MEDIUM', 1), cell('SHORT_ANSWER', 'APPLYING', 'MEDIUM', 2), cell('SHORT_ANSWER', 'APPLYING', 'HARD', 1)],
  11: [cell('SINGLE_CHOICE', 'UNDERSTANDING', 'EASY', 4), cell('SINGLE_CHOICE', 'UNDERSTANDING', 'MEDIUM', 8),
    cell('TRUE_FALSE', 'UNDERSTANDING', 'MEDIUM', 2), cell('SHORT_ANSWER', 'APPLYING', 'MEDIUM', 4)],
  12: [cell('SINGLE_CHOICE', 'UNDERSTANDING', 'MEDIUM', 12), cell('TRUE_FALSE', 'UNDERSTANDING', 'MEDIUM', 2),
    cell('SHORT_ANSWER', 'APPLYING', 'MEDIUM', 3), cell('SHORT_ANSWER', 'APPLYING', 'HARD', 1)]
};

// The seed is the newly created attempt UUID: different attempts draw randomly,
// while persisted questionIds keep reload/resume independent of bank changes.
export function selectThptDiagnostic(pool: any[], seed: string, grade: number): string[] {
  const plan = planThptDiagnostic(pool, seed, grade);
  if (plan.shortages.length) {
    const slot = plan.shortages[0];
    throw new BadRequestException({ code: 'DIAGNOSTIC_BANK_INSUFFICIENT', blueprintVersion: THPT_DIAGNOSTIC_BLUEPRINT_VERSION,
      grade, ...slot, required: slot.count, available: slot.available,
      message: `Kho lớp ${grade} chưa đủ câu không trùng nội dung cho ô ma trận ${slot.questionType} / ${slot.cognitiveLevel} / ${slot.difficulty}. Không thay thế bằng mức khác.` });
  }
  return plan.questionIds;
}

export function planThptDiagnostic(pool: any[], seed: string, grade: number) {
  if (![10, 11, 12].includes(grade)) throw new BadRequestException('Hãy chọn lớp 10, 11 hoặc 12 trong hồ sơ.');
  const slots = THPT_DIAGNOSTIC_MATRICES[grade].flatMap(c => Array.from({ length: c.count }, () => c));
  const candidates = slots.map((slot, index) => pool.filter(q => q.skill?.grade === grade && q.questionType === slot.questionType
    && q.cognitiveLevel === slot.cognitiveLevel && q.difficulty === slot.difficulty && q.source?.classification?.status !== 'NEEDS_REVIEW')
    .sort((a, b) => rank(seed, index, a.id).localeCompare(rank(seed, index, b.id)) || a.id.localeCompare(b.id)));
  const owner = new Map<string, number>(), selected = new Map<number, any>();
  // Match slots to distinct content, allowing reassignment when duplicate source
  // content spans several cells. A greedy draw can falsely report a shortage.
  const assign = (index: number, visited: Set<string>): boolean => {
    for (const q of candidates[index]) {
      const key = contentKey(q);
      if (visited.has(key)) continue;
      visited.add(key);
      const previous = owner.get(key);
      if (previous === undefined || assign(previous, visited)) {
        owner.set(key, index); selected.set(index, q); return true;
      }
    }
    return false;
  };
  for (const index of slots.map((_, index) => index).sort((a, b) => candidates[a].length - candidates[b].length || a - b)) {
    assign(index, new Set());
  }
  const shortages = THPT_DIAGNOSTIC_MATRICES[grade].flatMap(cell => {
    const indices = slots.flatMap((slot, index) => slot === cell ? [index] : []);
    const missing = indices.filter(index => !selected.has(index)).length;
    return missing ? [{ ...cell, missing, available: new Set(candidates[indices[0]].map(contentKey)).size }] : [];
  });
  return { questionIds: slots.flatMap((_, index) => selected.has(index) ? [selected.get(index).id] : []), shortages };
}

export function selectBlueprintPaper(pool: any[], seed: string, requireTopics = true) {
  const usedIds = new Set<string>(), usedContents = new Set<string>();
  const ids: string[] = [], shortages: any[] = [];
  for (const slot of DIAGNOSTIC_BLUEPRINT) {
    const candidates = pool.filter(q => matches(q, slot, requireTopics) && q.source?.classification?.status !== 'NEEDS_REVIEW' && !usedIds.has(q.id) && !usedContents.has(contentKey(q)))
      .sort((a, b) => rank(seed, slot.slot, a.id).localeCompare(rank(seed, slot.slot, b.id)) || a.id.localeCompare(b.id));
    const q = candidates[0];
    if (!q) { shortages.push({ ...slot, required: 1, available: 0 }); continue; }
    ids.push(q.id); usedIds.add(q.id); usedContents.add(contentKey(q));
  }
  if (shortages.length) throw new BadRequestException({
    code: 'DIAGNOSTIC_BLUEPRINT_INSUFFICIENT', blueprintVersion: DIAGNOSTIC_BLUEPRINT_VERSION,
    message: requireTopics ? 'Ngân hàng chưa đủ câu hỏi đúng chuyên đề, mức nhận thức và độ khó của ma trận Toán 9. Cần bổ sung hoặc rà soát nhãn câu hỏi trước khi mở bài kiểm tra.' : 'Các chuyên đề đã chọn chưa đủ câu theo loại, mức nhận thức và độ khó. Hãy chọn thêm chuyên đề hoặc bổ sung câu hỏi.',
    shortages: requireTopics ? shortages : shortages.map(({ skillCode, topic, ...slot }) => slot)
  });
  return ids;
}


export const EXAM_QUESTION_COUNTS = { SINGLE_CHOICE: 12, TRUE_FALSE: 4, SHORT_ANSWER: 6 } as const;
export function requireBlueprintCounts(counts: unknown) {
  if (!counts || typeof counts !== 'object' || Object.keys(counts).length !== 3 || Object.entries(EXAM_QUESTION_COUNTS).some(([type, count]) => (counts as any)[type] !== count)) {
    throw new BadRequestException({ code: 'EXAM_BLUEPRINT_COUNTS', blueprintVersion: DIAGNOSTIC_BLUEPRINT_VERSION,
      message: 'Ma trận Toán 9 bắt buộc 12 câu trắc nghiệm, 4 câu đúng/sai và 6 câu trả lời ngắn.', expected: EXAM_QUESTION_COUNTS });
  }
}

// The caller must resolve skills from storage; client-provided topic strings are not trusted.
export function validateBlueprintPaper<T extends { content?: string; id?: string }>(questions: T[], requireTopics = true): T[] {
  const used = new Set<T>(), ordered: T[] = [], missing: typeof DIAGNOSTIC_BLUEPRINT = [];
  if (questions.some(q => !q.content?.trim() || /^(?:câu\s+\d+\s+trong đề gốc[.]?|mixed (?:sc|tf|sa))$/i.test(q.content.trim()))) {
    throw new BadRequestException({ code: 'EXAM_BLUEPRINT_CONTENT_REQUIRED', message: 'Cần nội dung thật của từng câu để kiểm tra ma trận; không nhận câu mẫu hoặc chỉ số câu trong đề gốc.' });
  }
  const identities = questions.map(q => contentKey(q));
  const ids = questions.map(q => q.id).filter(Boolean);
  if (new Set(identities).size !== identities.length || new Set(ids).size !== ids.length) {
    throw new BadRequestException({ code: 'EXAM_BLUEPRINT_DUPLICATE', message: 'Đề không được trùng câu hỏi hoặc nội dung.' });
  }
  for (const slot of DIAGNOSTIC_BLUEPRINT) {
    const q = questions.find(q => !used.has(q) && matches(q, slot, requireTopics) && (q as any).skill?.grade === 9 && (q as any).source?.classification?.status !== 'NEEDS_REVIEW');
    if (q) { ordered.push(q); used.add(q); } else missing.push(slot);
  }
  const unexpected = questions.filter(q => !used.has(q)).map((q: any) => ({ id: q.id, skillCode: q.skill?.code, questionType: q.questionType, cognitiveLevel: q.cognitiveLevel, difficulty: q.difficulty }));
  if (questions.length !== 22 || missing.length || unexpected.length) throw new BadRequestException({
    code: 'EXAM_BLUEPRINT_MISMATCH', blueprintVersion: DIAGNOSTIC_BLUEPRINT_VERSION,
    message: `Đề phải đủ 22 câu, đúng loại, mức nhận thức và độ khó.${missing.length ? ' Thiếu/sai: ' + missing.map(s => `vị trí ${s.slot}: ${requireTopics ? s.topic : s.questionType} (${QUESTION_LABEL_RUBRIC.cognitiveLevels.find(l => l.code === s.cognitiveLevel)?.label}, ${QUESTION_LABEL_RUBRIC.difficulties.find(l => l.code === s.difficulty)?.label})`).join('; ') : ''}`,
    expectedCount: 22, actualCount: questions.length, missing: requireTopics ? missing : missing.map(({ skillCode, topic, ...slot }) => slot), unexpected
  });
  return ordered;
}
