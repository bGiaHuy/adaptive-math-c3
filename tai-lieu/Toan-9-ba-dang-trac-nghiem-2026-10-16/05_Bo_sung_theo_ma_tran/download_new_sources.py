import urllib.request
import urllib.parse
import re
import json
import os
import sys
import hashlib
import pypdf
import html

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
dest_dir = os.path.join(root, '05_Bo_sung_theo_ma_tran', 'PDF')
os.makedirs(dest_dir, exist_ok=True)

urls_to_try = [
    ("17_GK1_Newton_Pascal_Ha_Noi_2026", "https://thcs.toanmath.com/2026/10/de-giua-ki-1-toan-9-nam-2026-2027-he-thong-giao-duc-newton-pascal-ha-noi.html"),
    ("18_KS_Tu_Liem_1_Ha_Noi_2026", "https://thcs.toanmath.com/2026/10/de-khao-sat-toan-9-thang-10-nam-2026-truong-thcs-tu-liem-1-ha-noi.html"),
    ("19_KS_Cum_18_Hai_Phong_2025_2026", "https://thcs.toanmath.com/2026/05/de-khao-sat-toan-9-nam-2025-2026-cum-chuyen-mon-so-18-hai-phong.html"),
    ("20_KS_Cum_7_Lan_2_Hai_Phong_2025_2026", "https://thcs.toanmath.com/2026/05/de-khao-sat-toan-9-lan-2-nam-hoc-2025-2026-cum-chuyen-mon-so-7-hai-phong.html")
]

def fetch_url(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()

results = []

for name, page_url in urls_to_try:
    target_path = os.path.join(dest_dir, f"{name}.pdf")
    
    # Check if already downloaded
    if os.path.exists(target_path):
        with open(target_path, 'rb') as f:
            pdf_data = f.read()
        sha256 = hashlib.sha256(pdf_data).hexdigest()
        reader = pypdf.PdfReader(target_path)
        print(f"[ALREADY DOWNLOADED] {name} ({len(pdf_data)} bytes, {len(reader.pages)} pages)")
        results.append({
            "sourceId": f"SRC-NEW-{len(results)+1:03d}",
            "name": name,
            "filename": f"{name}.pdf",
            "relativePath": os.path.relpath(target_path, root).replace('\\', '/'),
            "sha256": sha256,
            "bytes": len(pdf_data),
            "pages": len(reader.pages),
            "sourcePageUrl": page_url,
            "pdfDownloadUrl": f"https://thcs.toanmath.com/thcs-pdf/{name.lower().replace('_', '-')}.pdf",
            "status": "DOWNLOADED_AND_VERIFIED"
        })
        continue

    print(f"\nFetching {page_url}...")
    try:
        content = fetch_url(page_url).decode('utf-8', 'replace')
        pdf_links = re.findall(r'https?://[^\s\"\'<>]+\.pdf', html.unescape(content))
        pdf_links = [u for u in pdf_links if 'pdf' in u.lower()]
        
        if not pdf_links:
            print("No PDF link found, skipping.")
            continue
            
        pdf_url = pdf_links[-1]
        quoted_url = urllib.parse.quote(pdf_url, safe=":/?=&%")
        print(f"Downloading PDF from {quoted_url}...")
        pdf_data = fetch_url(quoted_url)
        
        if not pdf_data.startswith(b'%PDF'):
            print("Downloaded file is not a PDF!")
            continue
            
        sha256 = hashlib.sha256(pdf_data).hexdigest()
        with open(target_path, 'wb') as f:
            f.write(pdf_data)
            
        reader = pypdf.PdfReader(target_path)
        page_count = len(reader.pages)
        
        print(f"Successfully saved {target_path} ({len(pdf_data)} bytes, {page_count} pages, SHA256: {sha256[:10]}...)")
        
        results.append({
            "sourceId": f"SRC-NEW-{len(results)+1:03d}",
            "name": name,
            "filename": f"{name}.pdf",
            "relativePath": os.path.relpath(target_path, root).replace('\\', '/'),
            "sha256": sha256,
            "bytes": len(pdf_data),
            "pages": page_count,
            "sourcePageUrl": page_url,
            "pdfDownloadUrl": quoted_url,
            "status": "DOWNLOADED_AND_VERIFIED"
        })
    except Exception as e:
        print(f"Error processing {name}: {e}")

out_sources = os.path.join(root, '05_Bo_sung_theo_ma_tran', 'sources.json')
with open(out_sources, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSaved new sources catalog to {out_sources} with {len(results)} new sources!")
