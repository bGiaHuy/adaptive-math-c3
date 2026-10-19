# Batch 51 — Restore the broad audit interaction gate

The broad audit's `after` interaction branch still searched for removed library row classes and an old status select. Dedicated library tests were current, but this named audit command could not finish. Updated only the verifier to current library records, search input and status buttons; added `accessibility-final` to execute both scans and list interactions. Product behavior unchanged.

`node scripts/audit-teacher-portal-product.mjs accessibility-final` completed against rendered React with intercepted APIs. It captured69 states at1440×900,820×1000,390×844, and completed library paging/search/status combination, students search/paging, gradebook paging and bank paging. The phase JSON and list-interactions.json are authoritative evidence. No server writes.

Visually inspected mobile class directory, students and bank screenshots. Class/student identity and navigation are clear. Bank filters still take substantial vertical room on small screens; this is a concrete remaining density item, not resolved by a clean axe report. Final requirement coverage and historical before-image gaps remain open.

Next: reduce mobile bank filter height without hiding common controls; capture matching before/after and verify combined filtering. No completion claim.
