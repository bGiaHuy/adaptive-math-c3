-- Additive: no changes to existing User fields, passwords, roles or sessions.
CREATE TABLE "ExternalIdentity" (
  "id" TEXT NOT NULL,
  "provider" VARCHAR(32) NOT NULL,
  "subject" VARCHAR(255) NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExternalIdentity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExternalIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ExternalIdentity_provider_subject_key" ON "ExternalIdentity"("provider", "subject");
CREATE UNIQUE INDEX "ExternalIdentity_userId_provider_key" ON "ExternalIdentity"("userId", "provider");
ALTER TABLE "ExternalIdentity" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "ExternalIdentity" FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "ExternalIdentity" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "ExternalIdentity" FROM authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'c3_web_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "ExternalIdentity" TO c3_web_app;
    CREATE POLICY "external_identity_backend_only" ON "ExternalIdentity" TO c3_web_app USING (true) WITH CHECK (true);
  END IF;
END $$;
