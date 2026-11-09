# Cloudflare migration preparation — 2026-11-09

Branch: `codex/cloudflare-fullstack-migration`. Base: `c3e667c`.

## Current status

Canonical hostname selected by this agent after the user delegated the decision:
https://adaptive-math-c3.adaptive-learning-c3.workers.dev . Its existing
`AdaptiveMathApi` deployment is retained. On 2026-11-09 this task deployed an
auth-form integration fix as Worker version `c4a0a113-d54f-46e1-8368-478b0a63414b`
(source fix commit `bcc7914`). Container rollout was explicitly disabled and
existing Worker variables/secrets preserved. No database schema or data-copy
cutover was performed. The earlier canonical-URL decision gate is resolved.

Live browser registration, fresh-token automatic login and session reload now
pass on that hostname. The edge still requires and validates Turnstile; no test
key or validation bypass was installed. The account is synthetic QA and remains
in the canonical runtime database. See `.cache/cloudflare-canonical-auth-verification.json`
and `.cache/cloudflare-canonical-qa-dashboard.png`. Its credentials are local,
Git-ignored and protected by the same administrative ACL as the preview secrets.

The discovered defect was an edge/UI mismatch: the deployed edge returned 403
`SECURITY_CHALLENGE_REQUIRED` for every login/registration, while its frontend
had no widget/header integration. Forms now acquire an `auth` token only after
that explicit edge rejection, then submit it in a header. Registration and its
following automatic login acquire separate tokens. Network errors, ordinary
403/401 and rejected consumed tokens are not automatically retried. Retry and
cancel controls are available; all server checks remain in place. Four focused
regression tests and the frontend suite, lint, format, architecture, typecheck,
clean frontend build, API build and Wrangler dry run passed; Graphify updated.

This does not establish complete production migration. Independently recheck
runtime database identity/configuration and the remaining role/ownership/grading/
AI flows on the canonical deployment. Consolidate its exact Worker source and
reproducible release config into the reviewed branch before completion. The
older Vercel/Render/Supabase services remain available for rollback.

Initial preparation is committed. The user subsequently authorized Wrangler
login and Cloudflare preview deployment. A separate candidate deployment is in
progress; no production database change, DNS cutover, or shutdown of an existing
service has been performed. Check the progress section below for live evidence.
The production logical backup is saved locally. All public application tables
have passed an isolated restore and content comparison. A second restore on the
official Supabase PostgreSQL 17.11 image also verified every archived table,
including managed schemas. This verifies database recovery, not hosted Supabase
service configuration or recovery of an entire hosted stack.

Supabase dashboard access to `ulsucorhoygypetcfgxa` is available, but this Free
project has no downloadable scheduled backups. Local `apps/api/.env` points to
localhost and must never be mistaken for a production connection.
The existing database password was supplied through process environment for the
export. It was not written to the migration files or committed. No reset occurred.

## Proposed target

Workers Static Assets serves the existing Vite output. The same hostname routes
`/api` and `/api/*` to a named Durable Object controlling a Cloudflare Container.
The container runs the existing NestJS/Express API, Prisma 5 and native Argon2
on Node 24 Linux. The adapter preserves the full API path, request body, cookies,
Origin and request ID; it returns the original response without buffering SSE.
Readiness checks require both `status: ok` and `database: connected`.

PostgreSQL remains the source of truth in the first stage. Moving the application
does not move its database. D1 is SQLite and is not a drop-in replacement for the
existing PostgreSQL transactions, advisory locks, JSON queries, Prisma schema
and audit/assignment ownership behavior. A separate database move needs its own
validated migration and final write synchronization.

Containers are preferred over a direct Workers port because the API uses Prisma's
native engine, native password hashing, filesystem-backed learning materials,
PDF rendering and DOCX conversion. A Workers-native rewrite would be a separate,
larger compatibility project. Hyperdrive connects Workers to an external database;
it does not host or replace PostgreSQL.

Cloudflare Containers requires Workers Paid. The user initially requested only
preparation, then reported buying a paid plan and explicitly authorized preview
deployment. Do not purchase or change subscriptions on the user's behalf.

## Preparation files

- `deploy/cloudflare/worker.mjs`: container startup/readiness and forwarding.
- `deploy/cloudflare/router.mjs`: routing and explicit runtime-secret allowlist.
- `deploy/cloudflare/wrangler.jsonc`: preview-only name; no production custom route.
- `deploy/cloudflare/Dockerfile`: existing API runtime and protected learning assets.
- `.dockerignore` and `deploy/cloudflare/Dockerfile.dockerignore`: allowlisted
  build inputs; no env files. The root file also covers Wrangler's temporary Dockerfile.
- `deploy/cloudflare/test/router.test.mjs`: cookie/body/path/SSE forwarding checks.

Install tooling with `npm ci --prefix deploy/cloudflare`. Build the frontend from
the repository root with `npm run build`; then run
`npm --prefix deploy/cloudflare run test` and
`npm --prefix deploy/cloudflare run check`. The latter is a Wrangler dry run and
also builds the container locally; Docker must be running. It does not publish.

Never build a release image from the dirty development tree. Use an isolated
checkout of a reviewed commit. In particular, local learning-material changes
must not be shipped incidentally. Include only approved catalog/image assets;
do not expose their filesystem directories through Worker static assets.
Raw source PDFs remain inaccessible through the API as in the current code.

## Backup and restore gate

1. Use the verified project session pooler on port 5432 or its direct connection,
   not the transaction pooler. Supply the existing password through an ignored
   local secret file or process environment. Never echo connection URLs.
2. Export a consistent PostgreSQL logical snapshot including application schemas,
   sequences, constraints, binary documents and relevant role/privilege metadata.
   Inventory extensions, functions, triggers and Supabase-managed schemas.
   Record versions, timestamps and SHA-256 checksums. A partial dump is not success.
3. Inventory Storage buckets and objects separately. PostgreSQL dumps contain
   Storage metadata, not object bytes. Download each object with a manifest and
   checksum, then reconcile metadata/object versions. Inventory Edge Functions
   and other platform configuration used by the app.
4. Restore into an isolated PostgreSQL instance with no outbound AI or mail and no
   production secrets. Compare table counts and deterministic content checksums
   from the same export snapshot, sequence state and foreign-key validation.
   Verify user hashes, assignment snapshots, submissions, grading and audit data.
5. Store backups under a restricted, explicitly Git-excluded local directory.
   Do not commit dumps, credentials, user data or downloaded private objects.
   Record the actual path only after a successful export, not in advance as proof.

## Preview, cutover and rollback

Start preview against the restored isolated database, with dedicated QA accounts,
session secret, invite HMAC secret, cookie name and restricted trusted origin.
Copy the current AI provider/model/prices/budget configuration intentionally;
do not rely on defaults or omit existing caps. Keep secrets in Worker secrets,
passed only at container startup. Never put secrets in Docker build arguments.

Verify login/logout/session revocation, CSRF rejection, every role, unauthorized
ownership access, bank answers, assignment-specific question edits, started-attempt
restrictions, grading/regrading/revisions/audit, documents, materials and AI SSE.
Test concurrent requests, cold starts, secret rotation/restart and rollback.
Confirm image size and that the runtime process receives SIGTERM.

Do not report success until the cloud preview itself passes these checks.

For application-only cutover using the same PostgreSQL database, preserve schema
compatibility and prevent duplicate side effects; no data-copy delta is needed.
Use one canonical hostname and explicitly handle host-only session cookies.
Keep the existing session and invite secrets only if continuity is intended and
validated; otherwise announce reauthentication. Retain Vercel/Render for rollback.

If the database is also moved, schedule a write freeze on all old writers, take
and validate a final export/delta, then switch all writers together. Never run
independent writable old/new databases without a synchronization design. After
new writes begin, rollback requires reconciling those writes first; DNS reversal
alone is not data rollback. Do not destroy the old database or backup artifacts.

## Evidence and outstanding access

Backup directory (Git ignored):
`C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math C3\.cache\private-backups\c3-2026-11-09`.
The final archive is `production-consistent.dump`; `source-manifest.json` contains
the source counts/checksums from its exported repeatable-read snapshot.
`schema-with-privileges.sql` additionally preserves owner/ACL definitions;
role attributes without passwords are inventoried in the source manifest.
`restore-verification.json` records the comparison results. Keep these private.

Integrity recheck on 2026-11-09 matched all ten files in `checksums.json`,
including the full-restore verifier and evidence. Windows ACLs on this backup
tree and this task's preview/runtime/AI/session credential files are protected
from inherited permissions and allow only SYSTEM and Administrators.
`.cache/cloudflare-backup-integrity.json` and
`.cache/cloudflare-private-acl-verification.json` record these checks without
credential contents. The backup and secret paths are confirmed Git-ignored.
Administrative access is required for subsequent recovery tooling; this local
backup is not an off-machine copy or a continuous/PITR backup.

Verified on PostgreSQL 17.11 in Docker container `c3-backup-verify-20261109`,
with `--network none`, no published port and no production application secrets:

- 72 source tables across application and managed schemas; 1,165 total rows.
- All 31 public application tables restored; 907 rows and full row-content
  checksums match. This covers user password hashes, sessions, question options,
  assignment snapshots, answers, scores and audit records.
- All 42 public foreign keys match and are validated; sequence metadata matches.
- `ExamDocument` has zero rows at the snapshot; there are no binary document rows
  to exercise in this backup.
- Storage inventory: zero buckets and zero objects at the same snapshot.
- Supabase dashboard Edge Functions inventory: no deployed functions (the page
  offers to deploy the first function). No function code needs downloading.
- Final dump SHA-256:
  `b6f978e35e3a12838ed5265dd39285a46f28f57381b199a7f1e6366febcb8e0e`.

Source float formatting was normalized to `extra_float_digits=3`, matching
pg_dump, before checksumming. Without this, three adaptive-score tables had
different textual checksums despite a successful restore. The final comparison
used a newly exported snapshot and a fresh restore, not the initial archive.

The restore creates referenced role names as NOLOGIN, and skips original owners
and ACL application. Original privilege definitions are archived separately;
restoring/validating them under a production runtime role remains a release gate.
The subsequent full restore used the official Supabase PostgreSQL 17.11 image,
container `c3-cf-full-restore-20261109-v2`, database `c3_full_restore`, with no
network or published port. `full-restore-verification.json` records all 72 table
counts and row-content checksums matching (1,165 rows), all 72 foreign-key
definitions matching, exact sequence state, zero orphans and 31 restored RLS
policies. The archive was restored in one transaction with exit-on-error.
Original owners/ACLs and role login capabilities were intentionally not activated;
their definitions remain archived separately. Hosted Auth, Realtime and Storage
service settings were not exercised by this database-only restore.

Checks passed: lint, format:check, architecture:check, architecture:test (22),
typecheck, frontend tests, API tests (233 in 36 files), Vite build, API build,
three forwarding tests, and Wrangler dry run including the full Docker image
build. Graphify was updated. Its existing SQL-parser and batch-061 Python syntax
warnings remain; no policy or test was weakened. Docker npm install reported
12 lockfile vulnerabilities; dependency remediation is outside this preparation.

Production-role privilege rehearsal and production
cutover remain release gates. Live candidate regression evidence is recorded
below; a build/dry run alone is not proof of application behavior.

## Preview progress and security additions

Wrangler authenticated as `buigiahuy092007@gmail.com`, account
`dd2f7a1c403332569d3a1058ab9dd3d2`, using encrypted credentials protected by
Windows Credential Manager. Only Workers/Containers-related write scopes were
requested; missing unrelated optional Wrangler scopes are intentional.

An existing Worker `adaptive-math-c3-preview` with class `AdaptiveApi` was found
in the account. Its home page returned 200 but `/api/v1/health` returned 500.
Do not overwrite that deployment without reconciling its source. This task uses
the distinct name `adaptive-math-c3-candidate` with class `C3Api`.

A clean Git archive of `ce14155` was built separately from the dirty worktree.
Running its image exposed a real packaging defect: npm installs some API
dependencies in `apps/api/node_modules`, but the image originally copied only
root `node_modules`. The Dockerfile now copies both. The corrected image ran
against a fresh restore on an internal Docker network with a non-superuser
runtime role inheriting `c3_web_app`; AI and outbound networking were disabled.
`smoke.mjs` passed health, anonymous rejection, registration, login, production
cookie flags, authenticated session, material catalog, student role rejection,
CSRF rejection without session loss, logout, and revoked-session rejection.
This is a container test, not a live Cloudflare or browser test.

The user authorized a separate free Supabase preview project. Created
`otpekgrqjnzjecieiqra` (`adaptivemathc3-cloudflare-preview`, Seoul). Data API is
disabled. Its initial database password is stored only in the Git-ignored local
file `.cache/c3-cloudflare-preview.env`, inside this repository directory as
requested. No production password was reset. All 31 application tables (907
rows) were restored and compared before deployment. The Worker receives only a
dedicated non-superuser runtime connection inheriting `c3_web_app`, not the
project administrator connection.

The user requested applicable Cloudflare security/performance features and has
no purchased domain. Prepared changes:

| Feature | Implementation / release condition |
| --- | --- |
| HTTPS | workers.dev HTTPS; HSTS for the served hostname, without preload or includeSubDomains |
| Static CDN / cache | Workers Static Assets; immutable one-year browser caching only for fingerprinted `/assets/*`; HTML keeps revalidation |
| Private API / AI | `private, no-store` plus CDN no-store, including errors and SSE; streaming body and cookies remain intact |
| Auth rate limiting | Worker binding: coarse 120 login/registration POSTs per IP per 60s per Cloudflare location; preserves existing API/user/AI limits; handles trailing slashes, query strings and route case |
| Browser protection | nosniff, deny framing, limited CSP for frame ancestors/object/base and a referrer policy on static responses |
| Observability | Worker observability configuration enabled; verify live error/rate-limit visibility after deployment |
| WAF / Super Bot Fight | Await a user-owned Cloudflare domain and applicable zone plan; do not pretend these are enabled on workers.dev |
| Image optimization | Keep private academic images behind API authorization; no new paid Images subscription or lossy math-image transformation |
| Turnstile | Not enabled yet; needs a site widget, secret and server validation with regression coverage before enforcing |

Rate limiting uses Cloudflare's approximate, per-location binding rather than
a global strict counter. The IP threshold is deliberately generous for classroom
NATs; this does not replace per-account brute-force defenses. Requests denied at
the edge return JSON 429 with Retry-After, not an HTML challenge inside the API.
Five forwarding/security tests and a Wrangler dry run with the rate-limit binding
pass. `prepare:assets` installs the Cloudflare-only `_headers` file into the built
asset directory; it does not change the Vercel deployment.

Additional references:
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
- https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/

## Live candidate evidence

Candidate: https://adaptive-math-c3-candidate.adaptive-learning-c3.workers.dev
uses only the restored preview project `otpekgrqjnzjecieiqra`. It is not the
production database or a production cutover. QA accounts and fixtures remain in
the clone; credentials are Git-ignored in `.cache/c3-cloudflare-qa.json`.

Evidence files under Git-ignored `.cache`:

| Report | Observed result |
| --- | --- |
| `cloudflare-live-smoke.json` | 11 requests: login, cookie flags, session, role rejection, CSRF and logout/revocation |
| `cloudflare-live-regression.json` | 47 requests: roles, bank permissions, ownership rejection, assignment snapshots, draft/resume, submit/grade, preview/apply regrade, stale revision rejection and audit |
| `cloudflare-live-content.json` | 16 requests: all three question types scored 10, answer secrecy, exact uploaded/downloaded bytes, document ownership, protected images and all 408 packaged image assets |
| `cloudflare-ai-verification.json` | Two real Sonnet requests completed: ordinary and SSE; multiple text events arrived before done, no-store/no-transform preserved |
| `cloudflare-headers-verification.json` | Live static headers checked: HTML revalidation, fingerprinted JS immutable caching, HSTS and framing protection |
| `cloudflare-concurrent-health.json` | Six simultaneous health requests returned 200 with database connected; process uptime was 3 seconds and responses completed in 3.7–4.3 seconds |

The regression compared the complete question bank before/after assignment
snapshot editing and verified other assignments unchanged. Controlled published
questions were inserted only in the isolated clone because the restored bank
did not contain the expected published single-choice fixture. Existing teacher
applicant auto-approval behavior was observed and preserved, not changed to make
the migration test pass.

The deployed image includes both root and nested API node_modules. Container
generation is selected by `API_INSTANCE`; change it when rotating process
secrets so new requests reach a freshly initialized process. Existing streams
can drain on the previous generation. Six routing/security unit tests cover
forwarding, no-store, rate limiting and generation selection.

A live generation-switch and Worker rollback rehearsal passed on 2026-11-09:
version `1834fa53-cf93-4987-8307-56c40b927509` selected a fresh process (uptime
5 seconds), then Wrangler rollback restored version
`494c4d70-bfe1-4804-9e89-1047769c88d4`. The same teacher session issued six
successful concurrent `/auth/me` requests before, after the switch, and after
rollback. Reports are `.cache/cloudflare-generation-{before,rotated,rollback}.json`.
All use the same preview database, image digest and session signing secret.
This proves process replacement and application-version rollback with retained
sessions; it does not prove signing-secret rotation, database rollback, or
continued AI streams during a live Worker code replacement. No additional AI
requests were made for this rehearsal. Archive configuration was returned to
the original generation after rollback.

Browser login and assignment paper presentation were checked on the candidate.
Evidence includes `.cache/cloudflare-paper-options.png` showing visible A–D
boxes and green/black correct-answer styling. Turnstile is not enabled on this
candidate. A separate preview from another worktree displayed the reported
Turnstile failure message, then later displayed Success; this does not prove
the intermittent failure has been fixed.

Other workers (`adaptive-math-c3-preview` and `adaptive-math-thpt`) and worktrees
were discovered. Do not overwrite or promote them without reconciling ownership,
database targets and the canonical URL. The user authorized internal-chat
coordination, but the available chat inventory did not identify their matching
chats. No deployment was overwritten as part of that investigation.

Reconciliation at 2026-11-09 11:10 UTC found an additional live
`adaptive-math-c3.adaptive-learning-c3.workers.dev`, owned by the other worktree's
`AdaptiveMathApi` implementation. Wrangler's latest deployment was version
`6c8c4373-1785-491f-abdb-9f918e40b144`, created at 11:06:52 UTC. This changed
during this task's investigation, so assuming another deployment is idle is
unsafe. `cloudflare-url-reconciliation.json` records HTTP 200/database-connected
health for that URL, `adaptive-math-thpt`, the other preview, and retained Vercel.
The C3 login form also rendered in the real browser without an initial challenge.
These observations do not establish database identity, authenticated production
workflows, or successful human Turnstile verification. A canonical-URL decision
was requested; promotion or overwriting another worktree remains pending.

Before production promotion: confirm exact current global AI budgets (candidate
uses explicit preview caps), canonical hostname and cookie reauthentication,
production runtime-role privileges, concurrent authenticated mutations, signing-secret
rotation and the selected security configuration. Database rollback needs its
own reconciliation if a database move is selected. Keep original Vercel, Render
and Supabase available. A clone containing QA data must never be promoted as an
unreconciled replacement for the live database.

## Official references

- https://developers.cloudflare.com/containers/
- https://developers.cloudflare.com/containers/examples/container-backend/
- https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/
- https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/
- https://supabase.com/docs/guides/platform/backups
