CREATE TABLE "EnglishClassAssignment" (
  "id" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EnglishClassAssignment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EnglishClassAssignment_classId_lessonId_key" ON "EnglishClassAssignment"("classId", "lessonId");
CREATE INDEX "EnglishClassAssignment_classId_createdAt_idx" ON "EnglishClassAssignment"("classId", "createdAt");
ALTER TABLE "EnglishClassAssignment" ADD CONSTRAINT "EnglishClassAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EnglishClassAssignment" ADD CONSTRAINT "EnglishClassAssignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "EnglishLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
