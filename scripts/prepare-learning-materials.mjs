import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PDFParse } from 'pdf-parse';

// Publish only real local documents. OCR/extracted text is never an answer key.
const root = path.resolve('outputs/thpt-300-papers');
const dest = path.resolve('content/thpt-materials');
fs.mkdirSync(path.join(dest, 'text'), { recursive: true });
const papers = JSON.parse(fs.readFileSync(path.join(root, 'papers.json'), 'utf8'));
const items = [], failures = [];
for (const paper of papers) {
  let parser;
  try {
    if (!/^THPT-(10|11|12)-[A-Z0-9_-]+$/.test(paper.paperId)) throw new Error('Invalid paper ID');
    const file = path.join(root, 'sources', `${paper.paperId}.pdf`);
    const data = fs.readFileSync(file);
    const sha256 = crypto.createHash('sha256').update(data).digest('hex');
    if (data.subarray(0, 5).toString() !== '%PDF-' || sha256 !== paper.fileSha256) throw new Error('PDF checksum mismatch');
    const textFile = path.join(dest, 'text', `${paper.paperId}.json`);
    let extracted;
    if (fs.existsSync(textFile)) {
      extracted = JSON.parse(fs.readFileSync(textFile, 'utf8'));
      if (extracted.sha256 !== sha256) extracted = null;
    }
    if (!extracted) {
      parser = new PDFParse({ data, verbosity: 0 });
      const text = await parser.getText();
      extracted = { sha256, pages: text.pages.map(p => ({ number: p.num, text: p.text })) };
      fs.writeFileSync(textFile, JSON.stringify(extracted));
    }
    const answerPages = extracted.pages.filter(p => /ĐÁP\s*ÁN|HƯỚNG\s*DẪN\s*CHẤM|HƯỚNG\s*DẪN\s*GIẢI/i.test(p.text)).map(p => p.number);
    const sourcePageUrl = new URL(paper.sourcePageUrl);
    if (sourcePageUrl.protocol !== 'https:') throw new Error('Invalid source URL');
    items.push({ id: paper.paperId, grade: paper.grade, title: paper.examTitle,
      school: /\(công lập\)/i.test(paper.schoolOrOrg) ? 'Xem đơn vị biên soạn trong tài liệu' : paper.schoolOrOrg,
      documentKind: /bộ đề|tuyển tập|đề cương|tổng hợp/i.test(paper.examTitle) ? 'COLLECTION' : 'EXAM',
      academicYear: paper.academicYear, examType: paper.examType, pageCount: extracted.pages.length,
      sizeBytes: data.length, sha256, sourcePageUrl: sourcePageUrl.href,
      answerPages, answerStatus: answerPages.length ? 'DETECTED' : 'NOT_DETECTED',
      reviewStatus: 'SOURCE_DOCUMENT', automaticGrading: false,
      reuseStatus: 'NOT_ESTABLISHED',
    });
    if (items.length % 10 === 0) console.log(`Prepared ${items.length}/${papers.length} documents`);
  } catch (error) { failures.push({ id: paper.paperId, error: error.message }); }
  finally { await parser?.destroy(); }
}
const unique = new Set(items.map(p => p.sha256));
if (unique.size !== items.length) throw new Error('Duplicate file content in published materials');
const catalog = { version: 1, preparedAt: new Date().toISOString(), items, failures };
fs.writeFileSync(path.join(dest, 'catalog.json'), JSON.stringify(catalog, null, 2));
console.log(JSON.stringify({ published: items.length, byGrade: [10,11,12].map(grade => ({grade, count: items.filter(p => p.grade === grade).length})), failures }, null, 2));
if (failures.length) process.exitCode = 1;
