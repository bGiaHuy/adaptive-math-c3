/**
 * Fix LaTeX formatting in existing DB questions.
 * Wraps bare LaTeX expressions in $...$ delimiters for proper rendering.
 * Run: node scripts/fix-latex-format.cjs
 */
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// --- Question content fixes ---
const QUESTION_FIXES = [
  // SKILL-06: Viète
  {
    match: 'Cho phương trình x^2 - 7x + 10 = 0. Tổng và tích hai nghiệm S = x_1 + x_2 và P = x_1 x_2 là:',
    content: 'Cho phương trình $x^2 - 7x + 10 = 0$. Tổng và tích hai nghiệm $S = x_1 + x_2$ và $P = x_1 \\cdot x_2$ là:',
  },
  // SKILL-07: sinB
  {
    match: 'Cho tam giác ABC vuông tại A có AB = 6\\text{ cm}, AC = 8\\text{ cm}. Giá trị \\sin B bằng:',
    content: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 6$ cm, $AC = 8$ cm. Giá trị $\\sin B$ bằng:',
  },
  // SKILL-07: 30 degrees
  {
    match: 'Trong tam giác ABC vuông tại A có \\widehat{C} = 30^\\circ và cạnh huyền BC = 12\\text{ cm}. Độ dài cạnh AB là:',
    content: 'Trong tam giác $ABC$ vuông tại $A$ có $\\widehat{C} = 30^\\circ$ và cạnh huyền $BC = 12$ cm. Độ dài cạnh $AB$ là:',
  },
  // System of equations
  {
    match: 'Hệ phương trình \\begin{cases} x + 2y = 4 \\\\ 2x + 4y = 8 \\end{cases} có bao nhiêu nghiệm?',
    content: 'Hệ phương trình $\\begin{cases} x + 2y = 4 \\\\ 2x + 4y = 8 \\end{cases}$ có bao nhiêu nghiệm?',
  },
  {
    match: 'Nghiệm của hệ phương trình \\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases} là cặp số (x; y):',
    content: 'Nghiệm của hệ phương trình $\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}$ là cặp số $(x; y)$:',
  },
  // Bậc hai 1 ẩn
  {
    match: 'Tập nghiệm của phương trình bậc hai x^2 - 5x + 6 = 0 là:',
    content: 'Tập nghiệm của phương trình bậc hai $x^2 - 5x + 6 = 0$ là:',
  },
];

// --- Option content fixes (match by partial content) ---
const OPTION_FIXES = [
  // Viète options
  { match: 'S = 7;\\, P = 10',   content: '$S = 7;\\; P = 10$' },
  { match: 'S = -7;\\, P = 10',  content: '$S = -7;\\; P = 10$' },
  { match: 'S = 7;\\, P = -10',  content: '$S = 7;\\; P = -10$' },
  { match: 'S = -7;\\, P = -10', content: '$S = -7;\\; P = -10$' },
  // Set notation
  { match: 'S = \\{2;\\, 3\\}',   content: '$S = \\{2;\\; 3\\}$' },
  { match: 'S = \\{-2;\\, -3\\}', content: '$S = \\{-2;\\; -3\\}$' },
  { match: 'S = \\{1;\\, 6\\}',   content: '$S = \\{1;\\; 6\\}$' },
  { match: 'S = \\{-1;\\, -6\\}', content: '$S = \\{-1;\\; -6\\}$' },
  // System solution options
  { match: '(2;\\, 1)', content: '$(2;\\; 1)$' },
  { match: '(1;\\, 2)', content: '$(1;\\; 2)$' },
  { match: '(3;\\, -1)', content: '$(3;\\; -1)$' },
  { match: '(2;\\, 3)', content: '$(2;\\; 3)$' },
  // sin options
  { match: '\\frac{3}{5}', content: '$\\frac{3}{5}$' },
  { match: '\\frac{4}{5}', content: '$\\frac{4}{5}$' },
  { match: '\\frac{3}{4}', content: '$\\frac{3}{4}$' },
  { match: '\\frac{4}{3}', content: '$\\frac{4}{3}$' },
  // Length options
  { match: '6\\text{ cm}',       content: '$6$ cm' },
  { match: '6\\sqrt{3}\\text{ cm}', content: '$6\\sqrt{3}$ cm' },
  { match: '8\\text{ cm}',       content: '$8$ cm' },
  { match: '4\\text{ cm}',       content: '$4$ cm' },
  // Degrees
  { match: '90^\\circ',  content: '$90^\\circ$' },
  { match: '180^\\circ', content: '$180^\\circ$' },
  { match: '60^\\circ',  content: '$60^\\circ$' },
  { match: '45^\\circ',  content: '$45^\\circ$' },
];

async function main() {
  let questionFixed = 0;
  let optionFixed = 0;

  // Fix question contents
  for (const fix of QUESTION_FIXES) {
    const q = await p.question.findFirst({ where: { content: fix.match } });
    if (q) {
      await p.question.update({ where: { id: q.id }, data: { content: fix.content } });
      console.log(`✓ Question fixed: "${fix.content.substring(0, 60)}..."`);
      questionFixed++;
    } else {
      console.log(`⚠ Question not found: "${fix.match.substring(0, 60)}..."`);
    }
  }

  // Fix option contents  
  for (const fix of OPTION_FIXES) {
    const opts = await p.questionOption.findMany({ where: { content: fix.match } });
    for (const opt of opts) {
      await p.questionOption.update({ where: { id: opt.id }, data: { content: fix.content } });
      optionFixed++;
    }
    if (opts.length > 0) {
      console.log(`✓ Options fixed (${opts.length}x): "${fix.match}" → "${fix.content}"`);
    }
  }

  console.log(`\n✅ Done: ${questionFixed} questions, ${optionFixed} options updated.`);
}

main().catch(e => { console.error('❌', e); }).finally(() => p.$disconnect());
