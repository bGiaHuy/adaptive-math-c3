import fs from 'node:fs';
import path from 'node:path';

const CATEGORIES = [
  // Grade 10
  { grade: 10, examType: 'GIUA_HK1', slug: 'de-thi-giua-hk1-toan-10', target: 25 },
  { grade: 10, examType: 'CUOI_HK1', slug: 'de-thi-hk1-toan-10', target: 25 },
  { grade: 10, examType: 'GIUA_HK2', slug: 'de-thi-giua-hk2-toan-10', target: 25 },
  { grade: 10, examType: 'CUOI_HK2', slug: 'de-thi-hk2-toan-10', target: 25 },

  // Grade 11
  { grade: 11, examType: 'GIUA_HK1', slug: 'de-thi-giua-hk1-toan-11', target: 25 },
  { grade: 11, examType: 'CUOI_HK1', slug: 'de-thi-hk1-toan-11', target: 25 },
  { grade: 11, examType: 'GIUA_HK2', slug: 'de-thi-giua-hk2-toan-11', target: 25 },
  { grade: 11, examType: 'CUOI_HK2', slug: 'de-thi-hk2-toan-11', target: 25 },

  // Grade 12
  { grade: 12, examType: 'GIUA_HK1', slug: 'de-thi-giua-hk1-toan-12', target: 25 },
  { grade: 12, examType: 'CUOI_HK1', slug: 'de-thi-hk1-toan-12', target: 25 },
  { grade: 12, examType: 'GIUA_HK2', slug: 'de-thi-giua-hk2-toan-12', target: 25 },
  { grade: 12, examType: 'CUOI_HK2', slug: 'de-thi-hk2-toan-12', target: 25 },
  { grade: 12, examType: 'KHAO_SAT_THI_THU', slug: 'de-thi-thu-tot-nghiep-thpt-mon-toan', target: 50 }
];

async function fetchPage(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  }
}

async function discover() {
  const discovered = [];
  console.log('Starting paper discovery across all categories...\n');

  for (const cat of CATEGORIES) {
    console.log(`Checking Grade ${cat.grade} - ${cat.examType} (${cat.slug})...`);
    let catArticles = [];
    let page = 1;

    while (catArticles.length < cat.target + 10 && page <= 5) {
      const pageUrl = page === 1 ? `https://toanmath.com/${cat.slug}` : `https://toanmath.com/${cat.slug}/page/${page}`;
      const html = await fetchPage(pageUrl);
      if (!html) break;

      const regex = /<h3[^>]*class=["'][^"']*entry-title[^"']*["'][^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let countOnPage = 0;
      let m;
      while ((m = regex.exec(html)) !== null) {
        const url = m[1];
        const title = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
        if (!catArticles.some(a => a.url === url)) {
          catArticles.push({
            grade: cat.grade,
            examType: cat.examType,
            categorySlug: cat.slug,
            page,
            url,
            title
          });
          countOnPage++;
        }
      }
      if (countOnPage === 0) break;
      page++;
    }

    console.log(`  -> Found ${catArticles.length} candidates for Grade ${cat.grade} - ${cat.examType}`);
    discovered.push(...catArticles);
  }

  console.log(`\nTotal discovered candidate articles across all grades: ${discovered.length}`);
  fs.writeFileSync('outputs/thpt-300-papers/discovered-articles.json', JSON.stringify(discovered, null, 2), 'utf8');
}

discover().catch(console.error);
