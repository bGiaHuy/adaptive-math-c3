# Google sign-in for canonical Cloudflare C3

Status: implementation passes local verification; not deployed/enabled yet.
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

Project `gen-lang-client-0244530142` (`brandify`), owner account
`buigiahuy092007@gmail.com`, was found through the installed Google Cloud CLI.
The user separately approved Google Cloud terms and Google API Services User
Data Policy at the respective UI steps. No billing/trial was enabled. The new
OAuth app is `Adaptive Math C3`, Web client `Adaptive Math C3 Web`, in Testing
mode with the owner as a test user. The existing Gemini API key was not read or
changed. No previous OAuth clients existed in this project.

Client secret is protected by Windows administrator/SYSTEM ACL in Git-ignored
`.cache/c3-google-oauth-secrets.json`; it is not in the image/source. Registered
callbacks are the canonical URL above and the same callback path on
`adaptive-math-c3-candidate.adaptive-learning-c3.workers.dev` for isolated QA.

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

Implemented: backend authorization-code/PKCE flow using the official Google
library, encrypted short-lived state cookie, explicit session-bound linking,
an additive private `ExternalIdentity` table, existing-session issuance, existing
teacher policy and a feature-gated frontend/link action. No automatic email
merge, role change of linked accounts, or token persistence. The Google-only
account password is an independent random secret that is never retained.

`npm run verify` passed 56 frontend tests and 242 API tests (37 files), including
RSA-signed ID tokens checked by the real Google verifier with isolated test
certificates. These tests cover issuer/audience/expiry/signature/nonce, state
binding/expiry/tampering, email collision, owner-origin checks, revoked linking
sessions, cross-account identity ownership, student/teacher policy, suspended
denial and normal logout. Google endpoints are mocked in these local tests;
they do not prove a real Google consent flow.

The migration was rehearsed on preview project `otpekgrqjnzjecieiqra`: existing
42 users unchanged, RLS enabled, runtime insert/select/update/delete passed in a
rolled-back transaction, direct `anon` and `authenticated` access denied.
Connection used the CA from the dashboard's Download certificate link and full
TLS verification. Report: `.cache/google-preview-migration-verification.json`.
No production migration has been applied. State-table grants intentionally allow
the trusted backend role to perform pre-login identity lookup; end-user access
still goes through authenticated ownership checks and no Data API role is granted.

Remaining: clean image build and clone deployment, real Google browser flow,
compatible production migration/privilege check and rollout, consent publishing
readiness and canonical regression. Do not expose Google login to ordinary users
while the OAuth app remains restricted to test users.

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
