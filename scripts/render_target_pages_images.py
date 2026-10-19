import fitz
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

IMG_DIR = 'outputs/thpt-300-papers/page-images'
os.makedirs(IMG_DIR, exist_ok=True)

targets = [
    ('G10', 'THPT-10-CUOI_HK1-026.pdf', [1, 2, 3, 7, 8]),
    ('G11', 'THPT-11-CUOI_HK1-126.pdf', [1, 2, 3, 7, 8]),
    ('G12', 'THPT-12-CUOI_HK1-227.pdf', [1, 2, 3, 4, 9, 10])
]

rendered = []
for label, f, pages in targets:
    doc = fitz.open(f"outputs/thpt-300-papers/sources/{f}")
    prefix = f.replace('.pdf', '')
    for p in pages:
        page = doc[p - 1]
        pix = page.get_pixmap(dpi=150)
        out_name = f"{prefix}_page_{p:02d}.png"
        out_path = os.path.join(IMG_DIR, out_name)
        pix.save(out_path)
        rendered.append(out_path)
        print(f"Rendered [{label}] {out_name} ({pix.width}x{pix.height})")

print(f"\nSuccessfully rendered {len(rendered)} page images to {IMG_DIR}.")
