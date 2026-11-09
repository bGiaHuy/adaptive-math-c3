# Cloudflare migration preparation — 2026-11-09

Branch: `codex/cloudflare-fullstack-migration`. Base: `c3e667c`.

## Current status

Preparation only. No Cloudflare deployment, paid subscription, production database
change, DNS cutover, or shutdown of an existing service has been performed.
The production logical backup is saved locally. All public application tables
have passed an isolated restore and content comparison. Supabase-managed schemas
are archived but have not been restored into a full Supabase stack.

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

Cloudflare Containers requires Workers Paid. The user requested preparation only
because Paid is not enabled. Do not enable billing or deploy until authorized.

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
Managed auth/storage/realtime/vault extensions and platform configuration require
a separate Supabase-compatible recovery rehearsal; a vanilla PostgreSQL public
schema restore does not establish full platform recovery.

Checks passed: lint, format:check, architecture:check, architecture:test (22),
typecheck, frontend tests, API tests (233 in 36 files), Vite build, API build,
three forwarding tests, and Wrangler dry run including the full Docker image
build. Graphify was updated. Its existing SQL-parser and batch-061 Python syntax
warnings remain; no policy or test was weakened. Docker npm install reported
12 lockfile vulnerabilities; dependency remediation is outside this preparation.

No Cloudflare URL exists yet. Live Cloudflare regression testing, cold starts,
production-role privilege rehearsal and cutover remain unverified. Account
selection and Workers Paid are needed only when deployment is requested.
The user explicitly requested preparation without enabling Paid.

## Official references

- https://developers.cloudflare.com/containers/
- https://developers.cloudflare.com/containers/examples/container-backend/
- https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/
- https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/
- https://supabase.com/docs/guides/platform/backups
