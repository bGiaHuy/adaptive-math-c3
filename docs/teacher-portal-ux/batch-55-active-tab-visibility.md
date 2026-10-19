# Batch 55 — Selected tab visibility

P1, mobile navigation: visual review of skills showed the selected last class tab clipped at the right edge; report settings had the same issue. Users could not read their current tab despite the active state. Updated the shared Tabs component in TeacherWorkspace.jsx to adjust only its own horizontal scroll when selection or container size changes. No window scroll, routes or selection semantics changed.

verify-teacher-active-tab before/after at1440×900,820×1000,390×844,360×640. Before: class skills/report settings clipped on both phone sizes. After: selected button fully within nav bounds in all8 cases; window.scrollY remains0. Inspected after skills mobile screenshot. Evidence docs/evidence/teacher-active-tab/. Keyboard regression and production build passed. Added to shared regression configuration36 suites; prior complete run35/35, new targeted test passes separately.

Also visually reviewed gradebook desktop/tablet, skills three viewports, recovery desktop/mobile and empty/loading mobile. Gradebook uses bounded horizontal data scrolling; skills displays observed results with limitations; recovery has a visible retry. No claim of exhaustive production accessibility certification.

Remaining: reflect this fix in final broad captures and completion audit; preserve documented supplemental historical-image and real-device limitations.
