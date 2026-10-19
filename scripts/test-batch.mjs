import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

async function testFetch() {
  const articles = JSON.parse(fs.readFileSync('outputs/thpt-300-papers/discovered-articles.json', 'utf8'));
  console.log('Total articles:', articles.length);

  const sample = articles.slice(0, 3);
  for (const art of sample) {
    console.log(`\nProcessing article: ${art.title}`);
    console.log(`URL: ${art.url}`);

    const res = await fetch(art.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      console.log('Failed to fetch article:', res.status);
      continue;
    }
    const html = await res.text();
    const pdfMatch = html.match(/href=["'](https:\/\/toanmath\.com\/toanmath-pdf\/[^"']+\.pdf)["']/i);
    if (!pdfMatch) {
      console.log('No direct PDF found in HTML');
      continue;
    }
    const pdfUrl = pdfMatch[1];
    console.log('PDF URL:', pdfUrl);

    // Download PDF
    const pdfRes = await fetch(pdfUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!pdfRes.ok) {
      console.log('Failed to download PDF:', pdfRes.status);
      continue;
    }
    const buf = Buffer.from(await pdfRes.arrayBuffer());
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    console.log(`Downloaded ${buf.length} bytes, SHA-256: ${hash}, IsPDF: ${buf.subarray(0, 5).toString() === '%PDF-'}`);
  }
}

testFetch().catch(console.error);
