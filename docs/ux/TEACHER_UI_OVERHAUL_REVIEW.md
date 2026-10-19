# Teacher Portal UI overhaul — independent finish gate

Decision: PASS for the inspected Teacher Portal visual overhaul and fixture interactions at the four named viewport sizes.

## Product lens
A lower-secondary maths teacher needs to find an assignment, understand its class/status/submission progress, and open results or the paper. Repeated work is scanning and reopening assignments; creating and deleting are less frequent. The first-read object must remain the actual assignment, with class and progress beside it. Existing green identity and Vietnamese domain language are retained.

## Design contract used for review
- First read: assignment title, class, status, submission count.
- Primary actions: open results and paper; create a new paper from the page heading.
- Density: a two-column browsing view plus explicit list mode for repeated scanning.
- Hierarchy: page action, status filters, search, assignments; no decorative hero.
- Responsive priority: full left navigation on desktop, compact rail on tablet, labelled bottom navigation on phone.
- Forbidden defaults: decorative charts, unrelated imagery, oversized promotional headings, hidden domain metadata.
- Finish evidence: actual before/after screenshots and the automated fixture report at 1440×900, 1280×800, 768×1024, 390×844.

## Observed changes
The desktop library visibly changes from a horizontal navigation bar and one enclosing table panel to a 232px vertical navigation rail, breadcrumb header, separated filters and a two-column assignment view. Each assignment includes its real status, deadline and submission progress, with direct results/paper buttons. Explicit list mode preserves a scan-oriented option. This is a genuine structural visual change, rather than an invisible component cleanup.

The overview now gives recent assignments the wider work area and classes a smaller adjacent panel. The three summary numbers support the assignment list rather than replacing it. The tablet report keeps the paper title and report actions visible and uses two columns for supporting metrics. Phone navigation retains text labels and active state; the library filters and assignment titles fit the available width.

## Resolved during review
1. The mobile composer footer initially overlapped bottom navigation. The final screenshot shows its complete error text and save/continue controls. The targeted bounds check now reports left 16px, right 374px, bottom 750px, above navigation top 761.4px, both initially and at maximum scroll.
2. actions.json records successful interaction groups at all four sizes: grid/list, search, status and topic filtering, direct results/paper opening, delete cancellation, account menu and navigation. No JavaScript errors are recorded. The harness centres click targets before native clicks so fixed mobile navigation does not intercept them.

## Keep
The existing green identity, Vietnamese maths/class/assignment labels, direct paper/results actions and explicit list option serve the teacher workflow. No decorative imagery or unrelated analytics was introduced.
## Verification boundaries
The refreshed after.json contains 116 records, no reported horizontal overflow or JavaScript errors, and no reported axe violations in the captured fixture screens. This supports the tested visual states only. It does not establish production API behaviour, real upload/grading/publishing flows, complete keyboard/screen-reader accessibility or WCAG conformance.

## Evidence inspected
- before-library-desktop.png vs after-library-desktop.png
- final-library-list-desktop.png and final-library-grid-mobile.png
- after-overview-desktop.png
- after-report-results-tablet.png
- after-bank-long-expanded-mobile.png
- after-composer-bottom-mobile.png
- after.json (refreshed 18 October 2026)

Additional final evidence: actions.json, footer-clearance.json and final-composer-bottom-mobile.png. The later targeted footer repair supersedes the mobile footer bounds in the broad after.json capture.

