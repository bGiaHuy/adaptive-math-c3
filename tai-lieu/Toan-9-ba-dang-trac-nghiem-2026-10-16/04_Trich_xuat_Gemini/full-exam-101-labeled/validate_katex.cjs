const fs = require('fs');
const path = require('path');
const katex = require('katex');

const questionsPath = process.argv[2] || path.join(__dirname, 'questions.jsonl');

if (!fs.existsSync(questionsPath)) {
  console.error(`ERROR: File not found: ${questionsPath}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(questionsPath, 'utf8');
const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);

let totalFormulas = 0;
let errors = [];

lines.forEach((line, lineIndex) => {
  let q;
  try {
    q = JSON.parse(line);
  } catch (err) {
    errors.push(`Line ${lineIndex + 1}: JSON parse error: ${err.message}`);
    return;
  }

  const qid = q.id || `Line_${lineIndex + 1}`;

  // Collect text fields
  const texts = [{ field: 'stem', text: q.stem || '' }];

  if (Array.isArray(q.options)) {
    q.options.forEach((opt, idx) => {
      texts.push({ field: `options[${idx}].text (${opt.key})`, text: opt.text || '' });
    });
  }

  if (Array.isArray(q.statements)) {
    q.statements.forEach((stmt, idx) => {
      texts.push({ field: `statements[${idx}].text (${stmt.key})`, text: stmt.text || '' });
    });
  }

  if (q.explanation) {
    texts.push({ field: 'explanation', text: q.explanation });
  }

  // Regex to extract $$...$$ and $...$
  const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g;

  texts.forEach(({ field, text }) => {
    let match;
    while ((match = mathRegex.exec(text)) !== null) {
      totalFormulas++;
      const isDisplay = Boolean(match[1]);
      const formula = match[1] || match[2];

      try {
        katex.renderToString(formula, {
          throwOnError: true,
          displayMode: isDisplay
        });
      } catch (katexErr) {
        errors.push(`[${qid}] Lỗi KaTeX ở trường '${field}': "${formula}" -> ${katexErr.message}`);
      }
    }
  });
});

console.log(`=== KẾT QUẢ KIỂM TRA KATEX (throwOnError: true) ===`);
console.log(`- Đã kiểm tra: ${lines.length} câu hỏi`);
console.log(`- Tổng số công thức toán học được phân tích và render: ${totalFormulas}`);

if (errors.length > 0) {
  console.error(`❌ Phát hiện ${errors.length} lỗi cú pháp KaTeX:`);
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log(`✅ 100% công thức (${totalFormulas} công thức) render thành công bằng KaTeX!`);
  process.exit(0);
}
