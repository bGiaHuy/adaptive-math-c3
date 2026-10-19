-- Additive Math-only changes; existing English tables and records are untouched.
ALTER TYPE "CognitiveLevel" ADD VALUE IF NOT EXISTS 'ADVANCED_APPLYING';
ALTER TABLE "Question" ADD COLUMN "irtA" DOUBLE PRECISION,
  ADD COLUMN "irtB" DOUBLE PRECISION, ADD COLUMN "irtC" DOUBLE PRECISION;
ALTER TABLE "SkillMastery" ADD COLUMN "evidenceCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "DiagnosticAttempt" ALTER COLUMN "currentTheta" SET DEFAULT 0;
ALTER TABLE "DiagnosticAttempt" ADD COLUMN "skillIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
CREATE TABLE "MathPracticeSession" (
  "id" TEXT NOT NULL, "studentId" TEXT NOT NULL, "skillId" TEXT NOT NULL,
  "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS', "state" JSONB NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "completedAt" TIMESTAMP(3),
  CONSTRAINT "MathPracticeSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MathPracticeSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "MathPracticeSession_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillNode"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "MathPracticeSession_studentId_status_idx" ON "MathPracticeSession"("studentId", "status");
