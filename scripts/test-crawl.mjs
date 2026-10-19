import fs from 'node:fs';

async function checkArticle() {
  const url = 'https://toanmath.com/2026/01/de-cuoi-ky-1-toan-10-nam-2025-2026-truong-thpt-phu-loc-hue.html';
  console.log('Fetching:', url);
  const res = await fetch(url);
  const html = await res.text();
  console.log('Article length:', html.length);

  // Check pdf links
  const pdfLinks = [...html.matchAll(/href=["']([^"']+\.pdf)["']/gi)].map(m => m[1]);
  console.log('Direct PDF links:', pdfLinks);

  // Check iframes
  const iframes = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Iframes:', iframes);

  // Check download buttons or links
  const downloadLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .filter(m => /tải|download|pdf/i.test(m[2]) || /toanmath-pdf/i.test(m[1]))
    .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }));
  console.log('Download links:', downloadLinks);
}

checkArticle().catch(console.error);
