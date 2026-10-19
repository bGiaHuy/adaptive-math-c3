# Batch 52 — Mobile bank filter density

P1: four vertically stacked bank filters consumed390px before question results at390px/360px widths. Kept search and topic full width; placed question type and difficulty side by side, with min-width safeguards. No filters hidden, and no data/filter logic changed. CSS change scoped to mobile bank filters in question-bank.css; classification editors retain their existing layout.

Matching before/after screenshots and geometry: docs/evidence/teacher-bank-filter-density/. At390×844 and360×640, filter height389.56→296.17px; first question starts953.63→860.23px, saving93.39px of scrolling. Desktop1440×900 and tablet820×1000 geometry unchanged. Inspected mobile screenshot; labels and native selects remain readable. First question is still below the initial viewport; do not claim otherwise.

verify-teacher-bank-filter-density passed all four sizes: combined type/difficulty filtering, search-empty state, reset all filters, default responsive page size and no document overflow. Fixture API only; no server writes/page errors. Added verifier to shared command (34 configured suites; last full completed run32/32).

Remaining: final requirement-level audit and historical baseline gaps; this change improves density but does not establish complete mobile-first-result visibility. Next: assess introductory content hierarchy without hiding frequently used controls.
