# Canonical Cloudflare release

Worker: `adaptive-math-c3` in account `dd2f7a1c403332569d3a1058ab9dd3d2`.
URL: https://adaptive-math-c3.adaptive-learning-c3.workers.dev
`../cloudflare` remains the separate candidate/clone configuration.

This directory consolidates the existing canonical `AdaptiveMathApi` and
`EdgeRateGuard` implementation without replacing its Durable Object namespaces.
Keep the `APP_ENV_JSON` and Turnstile Worker secrets already provisioned. Never
substitute the candidate's database/session secrets. Backend port is 4000.

Install the pinned Wrangler with `npm ci --prefix deploy/cloudflare`. Build from
a reviewed clean checkout; do not deploy the user's dirty development tree.
Run from that checkout's root:

```powershell
npm run build
Copy-Item deploy/cloudflare-production/_headers dist/_headers
node --test deploy/cloudflare-production/test/*.test.mjs
node deploy/cloudflare/node_modules/wrangler/bin/wrangler.js deploy --config deploy/cloudflare-production/wrangler.jsonc --containers-rollout none --keep-vars --dry-run
```

The `none` rollout is for Worker/static-only changes and does not rebuild/update
the API container. Inspect the active Worker version and capture a rollback ID
before deploying with `--dry-run` removed and `--strict` added. Retain secrets and
existing variable values. Configuration contains public binding names only.

For a reviewed API image change, remove `--containers-rollout none`, inspect the
Docker inputs and exact runtime environment, and verify the image on the clone
before any production rollout. Keep the previous image/config and rehearse
rollback; a Worker rollback does not revert database writes or bound resources.
Do not select a new instance key until process replacement and stream draining
are intended. Never seed, reset, or run schema migrations in the entry point.

The auth edge preserves server-side Turnstile validation and its rate controls
for case-insensitive/trailing-slash aliases accepted by Express. It forwards
the original request and streams the original response. Private API responses
are never cached; public image optimization excludes private material APIs.

See `docs/deployment/CLOUDFLARE-MIGRATION.md` for backup, verified scope and the
remaining production completion gates. Google authentication is a separate
pending integration; no Google OAuth keys or routes are enabled here yet.
