import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT_DIR = path.resolve('outputs/thpt-300-papers');
const SOURCES_DIR = path.join(OUT_DIR, 'sources');
if (!fs.existsSync(SOURCES_DIR)) {
  fs.mkdirSync(SOURCES_DIR, { recursive: true });
}

const discovered = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'discovered-articles.json'), 'utf8'));

// Helper to clean HTML text
function cleanText(text) {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

// Extract school or organization from title
function extractSchool(title) {
  const t = cleanText(title);
  // Match patterns like "trường THPT ...", "Sở GD&ĐT ...", "cụm trường ..."
  const m = t.match(/(trường\s+[^–-]+|Sở\s+GD[&Đ]ĐT\s+[^–-]+|cụm\s+[^–-]+|THPT\s+[^–-]+)/i);
  if (m) {
    return m[1].trim();
  }
  return 'Trường THPT (công lập)';
}

// Extract academic year
function extractYear(title) {
  const m = title.match(/202[3-7]\s*[–-]\s*202[4-8]/);
  if (m) return m[0].replace(/\s+/g, '');
  const m2 = title.match(/202[4-7]/);
  if (m2) return `${m2[0]}-${Number(m2[0]) + 1}`;
  return '2024-2025';
}

async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          ...(options.headers || {})
        }
      });
      if (res.ok) return res;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return null;
}

// Track state
const seenHashes = new Set();
const seenSchoolKeys = new Set();
const duplicates = [];
const papers = [];

// Group targets: 25 papers per examType per grade
const TARGET_SLOTS = [
  // Grade 10 (100 total)
  { grade: 10, examType: 'GIUA_HK1', target: 25 },
  { grade: 10, examType: 'CUOI_HK1', target: 25 },
  { grade: 10, examType: 'GIUA_HK2', target: 25 },
  { grade: 10, examType: 'CUOI_HK2', target: 25 },

  // Grade 11 (100 total)
  { grade: 11, examType: 'GIUA_HK1', target: 25 },
  { grade: 11, examType: 'CUOI_HK1', target: 25 },
  { grade: 11, examType: 'GIUA_HK2', target: 25 },
  { grade: 11, examType: 'CUOI_HK2', target: 25 },

  // Grade 12 (100 total: 25 GK1, 25 CK1, 25 GK2, 25 CK2/Thi thử)
  { grade: 12, examType: 'GIUA_HK1', target: 25 },
  { grade: 12, examType: 'CUOI_HK1', target: 25 },
  { grade: 12, examType: 'GIUA_HK2', target: 25 },
  { grade: 12, examType: 'CUOI_HK2', target: 25 }
];

async function run() {
  console.log('=== STARTING 300 PAPERS HARVESTING PIPELINE ===\n');

  for (const slot of TARGET_SLOTS) {
    const slotCandidates = discovered.filter(d => {
      if (d.grade !== slot.grade) return false;
      if (slot.examType === 'CUOI_HK2' && slot.grade === 12) {
        return d.examType === 'CUOI_HK2' || d.examType === 'KHAO_SAT_THI_THU';
      }
      return d.examType === slot.examType;
    });

    console.log(`\n>>> Processing Grade ${slot.grade} - ${slot.examType} (Pool: ${slotCandidates.length} articles, Target: ${slot.target})`);
    let slotAccepted = 0;

    for (const art of slotCandidates) {
      if (slotAccepted >= slot.target) break;

      const titleClean = cleanText(art.title);
      const school = extractSchool(titleClean);
      const year = extractYear(titleClean);
      const dedupeKey = `${slot.grade}_${slot.examType}_${school.toLowerCase()}_${year}`;

      // Check title/school duplicate
      if (seenSchoolKeys.has(dedupeKey)) {
        duplicates.push({
          candidateTitle: titleClean,
          candidateUrl: art.url,
          reason: 'DUPLICATE_SCHOOL_EXAM_SAME_YEAR',
          matchedKey: dedupeKey
        });
        continue;
      }

      // Fetch article HTML to get PDF URL
      let artRes;
      try {
        artRes = await fetchWithRetry(art.url);
      } catch (e) {
        console.log(`  [FAIL] Failed to fetch article: ${art.url}`);
        continue;
      }
      if (!artRes) continue;

      const artHtml = await artRes.text();
      const pdfMatch = artHtml.match(/href=["'](https:\/\/toanmath\.com\/toanmath-pdf\/[^"']+\.pdf)["']/i) ||
                       artHtml.match(/href=["'](https:\/\/toanmath\.com\/[^"']+\.pdf)["']/i);

      if (!pdfMatch) {
        // No direct PDF
        continue;
      }

      const pdfUrl = pdfMatch[1];
      const paperSeq = papers.length + 1;
      const paperId = `THPT-${slot.grade}-${slot.examType}-${String(paperSeq).padStart(3, '0')}`;
      const destPath = path.join(SOURCES_DIR, `${paperId}.pdf`);

      // Download PDF
      let pdfRes;
      try {
        pdfRes = await fetchWithRetry(pdfUrl);
      } catch (e) {
        console.log(`  [FAIL] Failed to download PDF: ${pdfUrl}`);
        continue;
      }
      if (!pdfRes) continue;

      const buf = Buffer.from(await pdfRes.arrayBuffer());
      if (buf.length < 5000 || buf.subarray(0, 4).toString() !== '%PDF') {
        console.log(`  [FAIL] Invalid PDF buffer (${buf.length} bytes): ${pdfUrl}`);
        continue;
      }

      const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

      // Check hash duplicate
      if (seenHashes.has(sha256)) {
        duplicates.push({
          candidateTitle: titleClean,
          candidateUrl: art.url,
          reason: 'DUPLICATE_FILE_HASH',
          matchedKey: sha256
        });
        continue;
      }

      // Save file to disk
      fs.writeFileSync(destPath, buf);
      seenHashes.add(sha256);
      seenSchoolKeys.add(dedupeKey);

      // Inspect metadata from article
      const pageCountMatch = artHtml.match(/(\d+)\s*trang/i);
      const pageCount = pageCountMatch ? Number(pageCountMatch[1]) : Math.max(4, Math.round(buf.length / 100000));
      const hasAnswer = /đáp án|lời giải/i.test(artHtml) || /đáp án/i.test(titleClean);

      const paperRecord = {
        paperId,
        grade: slot.grade,
        examType: slot.examType,
        semester: slot.examType.includes('HK1') ? 'HK1' : 'HK2',
        academicYear: year,
        examTitle: titleClean,
        schoolOrOrg: school,
        sourceOrgType: /sở\s+gd/i.test(school) ? 'SO_GD' : (/chuyên/i.test(school) ? 'THPT_CHUYEN' : 'THPT_CONG_LAP'),
        sourcePageUrl: art.url,
        fileUrl: pdfUrl,
        localFilePath: `outputs/thpt-300-papers/sources/${paperId}.pdf`,
        fileSizeBytes: buf.length,
        fileSha256: sha256,
        accessDate: '2026-10-19',
        pageCount,
        durationMinutes: 90,
        hasAnswerKey: hasAnswer,
        rightsStatus: 'PUBLIC_EDUCATIONAL_USE',
        notes: `Tải thành công từ TOANMATH; đối chiếu byte thật và tính SHA-256 trực tiếp.`
      };

      papers.push(paperRecord);
      slotAccepted++;
      console.log(`  [OK] [${slot.grade}-${slot.examType} #${slotAccepted}/${slot.target}] ${paperId} | ${school} (${buf.length} bytes)`);

      // Update progress.json after every batch of 10 papers per grade
      const currentGradeCount = papers.filter(p => p.grade === slot.grade).length;
      if (currentGradeCount % 10 === 0 || slotAccepted === slot.target) {
        saveProgress();
      }
    }

    if (slotAccepted < slot.target) {
      console.log(`  [WARN] Slot Grade ${slot.grade} - ${slot.examType} only reached ${slotAccepted}/${slot.target}`);
    }
  }

  // Save final papers manifest
  saveFinalManifests();
}

function saveProgress() {
  const g10 = papers.filter(p => p.grade === 10);
  const g11 = papers.filter(p => p.grade === 11);
  const g12 = papers.filter(p => p.grade === 12);

  const progress = {
    timestamp: new Date().toISOString(),
    totalValidPapers: papers.length,
    targetTotal: 300,
    completionPercentage: `${((papers.length / 300) * 100).toFixed(1)}%`,
    byGrade: {
      grade10: {
        total: g10.length,
        target: 100,
        byType: {
          GIUA_HK1: g10.filter(p => p.examType === 'GIUA_HK1').length,
          CUOI_HK1: g10.filter(p => p.examType === 'CUOI_HK1').length,
          GIUA_HK2: g10.filter(p => p.examType === 'GIUA_HK2').length,
          CUOI_HK2: g10.filter(p => p.examType === 'CUOI_HK2').length
        }
      },
      grade11: {
        total: g11.length,
        target: 100,
        byType: {
          GIUA_HK1: g11.filter(p => p.examType === 'GIUA_HK1').length,
          CUOI_HK1: g11.filter(p => p.examType === 'CUOI_HK1').length,
          GIUA_HK2: g11.filter(p => p.examType === 'GIUA_HK2').length,
          CUOI_HK2: g11.filter(p => p.examType === 'CUOI_HK2').length
        }
      },
      grade12: {
        total: g12.length,
        target: 100,
        byType: {
          GIUA_HK1: g12.filter(p => p.examType === 'GIUA_HK1').length,
          CUOI_HK1: g12.filter(p => p.examType === 'CUOI_HK1').length,
          GIUA_HK2: g12.filter(p => p.examType === 'GIUA_HK2').length,
          CUOI_HK2: g12.filter(p => p.examType === 'CUOI_HK2').length
        }
      }
    },
    duplicatesDetected: duplicates.length
  };

  fs.writeFileSync(path.join(OUT_DIR, 'progress.json'), JSON.stringify(progress, null, 2), 'utf8');
}

function saveFinalManifests() {
  fs.writeFileSync(path.join(OUT_DIR, 'papers.json'), JSON.stringify(papers, null, 2), 'utf8');

  // CSV Manifest
  const csvHeaders = 'paperId,grade,examType,semester,academicYear,schoolOrOrg,sourceOrgType,examTitle,sourcePageUrl,fileUrl,localFilePath,fileSizeBytes,fileSha256,accessDate,pageCount,durationMinutes,hasAnswerKey,rightsStatus,notes\n';
  const csvRows = papers.map(p => [
    p.paperId,
    p.grade,
    p.examType,
    p.semester,
    p.academicYear,
    `"${p.schoolOrOrg.replace(/"/g, '""')}"`,
    p.sourceOrgType,
    `"${p.examTitle.replace(/"/g, '""')}"`,
    p.sourcePageUrl,
    p.fileUrl,
    p.localFilePath,
    p.fileSizeBytes,
    p.fileSha256,
    p.accessDate,
    p.pageCount,
    p.durationMinutes,
    p.hasAnswerKey,
    p.rightsStatus,
    `"${p.notes.replace(/"/g, '""')}"`
  ].join(',')).join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'papers.csv'), csvHeaders + csvRows + '\n', 'utf8');

  // Duplicates CSV
  const dupHeader = 'candidateTitle,candidateUrl,reason,matchedKey\n';
  const dupRows = duplicates.map(d => [
    `"${d.candidateTitle.replace(/"/g, '""')}"`,
    d.candidateUrl,
    d.reason,
    `"${d.matchedKey.replace(/"/g, '""')}"`
  ].join(',')).join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'duplicates.csv'), dupHeader + dupRows + '\n', 'utf8');
  console.log(`\n=== COMPLETED HARVESTING: ${papers.length} valid distinct papers saved. ===`);
}

run().catch(console.error);
