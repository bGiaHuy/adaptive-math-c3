# Google sign-in for canonical Cloudflare C3

Status: integration design and provisioning inputs; not enabled or implemented.
Canonical origin: https://adaptive-math-c3.adaptive-learning-c3.workers.dev

## Google Cloud configuration

Use the user's existing project and a Web application OAuth client. Proposed
server callback (must match exactly in Google and the server configuration):

`https://adaptive-math-c3.adaptive-learning-c3.workers.dev/api/v1/auth/google/callback`

Request only `openid email profile`. No Drive, Gmail, Calendar, offline access
or Google Cloud administration scopes are required for website users. Keep the
client secret in server configuration; never in Vite environment variables,
browser storage, URLs, Docker image layers or Git. A local ignored template is
`.cache/c3-google-oauth.env.example`. Verify the consent screen's publishing/test
user state before testing with accounts outside the project.

The currently logged-in Cloud Console account presents a first-use Terms of
Service screen; no terms were accepted. Project identity and console access are
pending while the user prepares Google Cloud CLI. Do not create a replacement
project or change billing merely to avoid this access step.

## Implementation contract

- Use authorization code flow with state, nonce and PKCE. Validate signature,
  issuer, client audience, expiry, nonce, subject and verified email using the
  official Google server library. Do not accept a browser-provided email/profile
  as authentication, and do not use Google's debugging tokeninfo endpoint as
  the production verifier.
- Bind the flow to the initiating browser with a short-lived HttpOnly Secure
  cookie and a dedicated cryptographic context. A callback must not create a
  session without the matching unexpired state. Do not log codes, tokens,
  verifier, cookies or client secret. Reject repeated/invalid callbacks.
- Store Google's stable subject as a unique external identity. Email alone
  never silently merges accounts. An existing local account must authenticate
  normally and explicitly link Google. A link callback must still match that
  active user/session and must not replace another identity or change roles.
- Existing linked accounts retain role, status, permissionVersion, profiles,
  ownership and audit history. Suspended accounts remain denied. New-user role
  selection must use only the existing student/teacher registration policy;
  neither OAuth parameters nor Google email domains confer admin/content roles.
- Issue the existing database session and host-only HttpOnly cookie, preserving
  logout, revocation, CSRF checks and normal password authentication. Google
  access/refresh tokens are unnecessary after identity verification and must not
  be stored as application session tokens.
- Schema changes must be additive, with unique identity constraints, no data
  rewrite or source-bank changes. Keep identity fields out of existing public
  user payloads. Back up and rehearse the migration on the isolated clone before
  updating production, then deploy the compatible API before exposing the button.
- Add a visible sign-in action only when runtime provider configuration is ready.
  Provide cancellation/error handling without repeatedly creating accounts or
  leaving an unusable button on production.

## Verification gate

Test browser state mismatch/expiry/replay, rejected issuer/audience/nonce/subject,
unverified email, duplicate identity, email collision without auto-link, explicit
link ownership/session checks, role/status preservation, suspended denial,
new student/teacher behavior, existing password login, session reload/logout/
revocation and safe cancellation. Use local fake-provider tests for negatives;
positive completion additionally requires the real configured Google project
and a real browser flow on the canonical hostname.

Cloudflare edge routing must preserve start/callback paths and cookies while
retaining rate controls. OAuth code/state callbacks must never be CDN cached or
logged with their query. Keep the previous API image and additive schema
compatible for application rollback; do not roll back a database snapshot over
new user/session writes.

Official reference: https://developers.google.com/identity/openid-connect/openid-connect
