# Adaptive Math C3 deployment isolation

- Repository: bGiaHuy/adaptive-math-c3; branch codex/thpt-production-release.
- Frontend: https://adaptive-math-thpt.vercel.app; Vercel project prj_zJPunX8ZNxawrOsyG7LZwDJeYh21. Domain reservation confirmed by Vercel API.
- API: https://adaptive-math-c3-api.onrender.com; Render service srv-dbbkgb49v7es73fhqeug, My Workspace tea-d93tae6q1p3s73aa7ba0, free plan.
- Database: adaptivemathc3, project ulsucorhoygypetcfgxa, region ap-south-1. Discovered and configured using the user's authenticated Supabase CLI; the Supabase connector has a different identity.
- Existing public schema had 31 tables and no users/questions/skills. Runtime c3_web_app has CRUD, no schema CREATE/DDL, and role-specific RLS; anon/authenticated have no table grants. The user explicitly approved this runtime access. THPT database defaults are set to grade 10 and final-term study.
- Only reviewed THPT drafts were seeded: 152 questions, 48 skills; no historical accounts, sessions, assignments or private records were copied from another website. Admin is newly created; access details are stored only in ignored release/c3-admin-access.json.
- Frontend /api rewrites to the C3 API above. API WEB_URL is the confirmed frontend domain; production cookie is __Host-am_c3_session with a unique signing secret. Database, session and invite secrets were freshly generated and are not in Git. AI uses the project-specific credential, never a browser environment variable.
- The preexisting adaptivemath project and adaptivemath-api service belong to another website and are excluded targets. Their previous frontend/API deployments were restored before proceeding with C3.
- No automatic migration is added to application startup or the Render build. Future schema changes must explicitly target C3 through its CLI context.
- Before release: verify source, endpoints, health, authentication, ownership, three grade-specific papers, safe answer payloads and AI. Rollback applies only to the C3 deployment IDs and this repository's configuration.
