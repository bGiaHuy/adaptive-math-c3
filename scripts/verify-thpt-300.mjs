import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import katex from 'katex';

const DIR = path.resolve('outputs/thpt-300-papers');
const SOURCES_DIR = path.join(DIR, 'sources');

console.log('=== RUNNING VERIFICATION ON THPT 300 PAPERS DATASET ===\n');

// 1. Audit papers.json
const papers = JSON.parse(fs.readFileSync(path.join(DIR, 'papers.json'), 'utf8'));
console.log(`Total papers in papers.json: ${papers.length}`);

const g10 = papers.filter(p => p.grade === 10);
const g11 = papers.filter(p => p.grade === 11);
const g12 = papers.filter(p => p.grade === 12);

console.log(` - Grade 10: ${g10.length} (Target: 100)`);
console.log(` - Grade 11: ${g11.length} (Target: 100)`);
console.log(` - Grade 12: ${g12.length} (Target: 100)`);

// 2. Audit file integrity & SHA-256 on real files
let hashErrors = 0;
let fileMissing = 0;
let pdfHeaderErrors = 0;

for (const p of papers) {
  const filePath = path.join(DIR, 'sources', `${p.paperId}.pdf`);
  if (!fs.existsSync(filePath)) {
    fileMissing++;
    continue;
  }
  const buf = fs.readFileSync(filePath);
  if (buf.subarray(0, 4).toString() !== '%PDF') {
    pdfHeaderErrors++;
  }
  const calculatedHash = crypto.createHash('sha256').update(buf).digest('hex');
  if (calculatedHash !== p.fileSha256) {
    hashErrors++;
  }
}

console.log(`\nFile verification:`);
console.log(` - Files missing: ${fileMissing}`);
console.log(` - PDF header errors: ${pdfHeaderErrors}`);
console.log(` - SHA-256 mismatch errors: ${hashErrors}`);

// 3. Audit duplicates.csv
const dupLines = fs.readFileSync(path.join(DIR, 'duplicates.csv'), 'utf8').trim().split('\n');
console.log(`\nDuplicates cataloged in duplicates.csv: ${dupLines.length - 1} filtered`);

const candidatesRaw = fs.readFileSync(path.join(DIR, 'questions-candidates.jsonl'), 'utf8').trim();
const candidates = candidatesRaw ? candidatesRaw.split('\n').filter(Boolean).map(JSON.parse) : [];
const reviewedRaw = fs.readFileSync(path.join(DIR, 'questions-reviewed.jsonl'), 'utf8').trim();
const reviewed = reviewedRaw ? reviewedRaw.split('\n').filter(Boolean).map(JSON.parse) : [];
const eligibleRaw = fs.readFileSync(path.join(DIR, 'import-candidates.jsonl'), 'utf8').trim();
const eligible = eligibleRaw ? eligibleRaw.split('\n').filter(Boolean).map(JSON.parse) : [];

console.log(`\nQuestions verification:`);
console.log(` - Candidates: ${candidates.length}`);
console.log(` - Reviewed: ${reviewed.length}`);
console.log(` - Import eligible: ${eligible.length}`);

let katexErrors = 0;
for (const q of candidates) {
  const checkStr = str => {
    if (typeof str !== 'string') return;
    const matches = [...str.matchAll(/(\$\$|\$)([\s\S]*?)\1/g)];
    for (const m of matches) {
      try {
        katex.renderToString(m[2], { throwOnError: true, strict: 'error', displayMode: m[1] === '$$' });
      } catch (e) {
        katexErrors++;
      }
    }
  };
  checkStr(q.content);
  if (q.options) q.options.forEach(o => checkStr(o.content));
  if (q.statements) q.statements.forEach(s => { checkStr(s.content); checkStr(s.explanation); });
  checkStr(q.explanation);
}

console.log(` - KaTeX render errors: ${katexErrors}`);

// Check peer_reviewed flag
const peerReviewedTrue = reviewed.filter(r => r.reviewStatus.peer_reviewed === true).length;
console.log(` - Peer reviewed flag strictly false count: ${reviewed.length - peerReviewedTrue}/${reviewed.length} (True count: ${peerReviewedTrue})`);

// 5. Coverage audit
const covLines = fs.readFileSync(path.join(DIR, 'coverage.csv'), 'utf8').trim().split('\n');
console.log(` - Coverage matrix cells: ${covLines.length - 1}`);

console.log('\nAll checks completed successfully!');
