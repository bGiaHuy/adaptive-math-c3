const fs = require('fs');
const readline = require('readline');
const katex = require('katex');

const jsonlPath = process.argv[2];
if (!jsonlPath) {
  console.error("Usage: node validate_katex.cjs <path-to-questions.jsonl>");
  process.exit(1);
}

const fileStream = fs.createReadStream(jsonlPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let totalFormulas = 0;
let failedFormulas = 0;
let questionCount = 0;
const errors = [];

function extractFormulas(text) {
  if (!text) return [];
  const formulas = [];
  // Match display math $$...$$
  let remaining = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    formulas.push({ latex: formula, display: true });
    return "";
  });
  // Match inline math $...$
  remaining.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    formulas.push({ latex: formula, display: false });
    return "";
  });
  return formulas;
}

rl.on('line', (line) => {
  if (!line.trim()) return;
  questionCount++;
  const q = JSON.parse(line);
  const qId = q.id;

  const textSnippets = [];
  if (q.stem) textSnippets.push({ field: 'stem', text: q.stem });
  if (q.explanation) textSnippets.push({ field: 'explanation', text: q.explanation });
  
  if (q.options) {
    q.options.forEach((opt, idx) => {
      textSnippets.push({ field: `options[${idx}].text`, text: opt.text });
    });
  }

  if (q.statements) {
    q.statements.forEach((stmt, idx) => {
      textSnippets.push({ field: `statements[${idx}].text`, text: stmt.text });
    });
  }

  textSnippets.forEach(item => {
    const formulas = extractFormulas(item.text);
    formulas.forEach(f => {
      totalFormulas++;
      try {
        katex.renderToString(f.latex, {
          throwOnError: true,
          displayMode: f.display
        });
      } catch (err) {
        failedFormulas++;
        errors.push({
          questionId: qId,
          field: item.field,
          formula: f.latex,
          error: err.message
        });
      }
    });
  });
});

rl.on('close', () => {
  console.log(`=== KẾT QUẢ KIỂM TRA KATEX (throwOnError: true) ===`);
  console.log(`- Đã kiểm tra: ${questionCount} câu hỏi`);
  console.log(`- Tổng số công thức toán học được phân tích và render: ${totalFormulas}`);
  console.log(`- Số công thức lỗi: ${failedFormulas}`);

  if (failedFormulas > 0) {
    console.error(`❌ CÓ ${failedFormulas} CÔNG THỨC BỊ LỖI CÚ PHÁP KATEX:`);
    errors.forEach((e, idx) => {
      console.error(`  [${idx + 1}] Câu ${e.questionId} (${e.field}): $${e.formula}$ -> Lỗi: ${e.error}`);
    });
    process.exit(1);
  } else {
    console.log(`✅ 100% công thức (${totalFormulas} công thức) render thành công bằng KaTeX!`);
    process.exit(0);
  }
});
