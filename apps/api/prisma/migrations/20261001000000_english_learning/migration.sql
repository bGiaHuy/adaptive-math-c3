CREATE TYPE "EnglishLessonKind" AS ENUM ('LISTENING', 'VOCABULARY', 'GRAMMAR', 'READING');
CREATE TYPE "EnglishExerciseKind" AS ENUM ('SINGLE_CHOICE', 'FILL_BLANK', 'DICTATION');

CREATE TABLE "EnglishTopic" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "EnglishTopic_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EnglishLesson" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "level" TEXT NOT NULL,
  "kind" "EnglishLessonKind" NOT NULL,
  "body" TEXT,
  "audioUrl" TEXT,
  "transcript" JSONB,
  "sourceAttribution" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EnglishLesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EnglishExercise" (
  "id" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "kind" "EnglishExerciseKind" NOT NULL,
  "prompt" TEXT NOT NULL,
  "options" JSONB,
  "correctAnswer" TEXT NOT NULL,
  "acceptedAnswers" JSONB,
  "explanation" TEXT,
  "segmentId" TEXT,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "EnglishExercise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EnglishLessonProgress" (
  "id" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "answers" JSONB NOT NULL,
  "correctCount" INTEGER NOT NULL,
  "totalCount" INTEGER NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EnglishLessonProgress_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EnglishLesson_topicId_published_orderIndex_idx" ON "EnglishLesson"("topicId", "published", "orderIndex");
CREATE INDEX "EnglishExercise_lessonId_orderIndex_idx" ON "EnglishExercise"("lessonId", "orderIndex");
CREATE UNIQUE INDEX "EnglishLessonProgress_lessonId_studentId_key" ON "EnglishLessonProgress"("lessonId", "studentId");
CREATE INDEX "EnglishLessonProgress_studentId_completedAt_idx" ON "EnglishLessonProgress"("studentId", "completedAt");
ALTER TABLE "EnglishLesson" ADD CONSTRAINT "EnglishLesson_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "EnglishTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EnglishExercise" ADD CONSTRAINT "EnglishExercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "EnglishLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EnglishLessonProgress" ADD CONSTRAINT "EnglishLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "EnglishLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EnglishLessonProgress" ADD CONSTRAINT "EnglishLessonProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "EnglishPlacementResult" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "correctCount" INTEGER NOT NULL,
  "totalCount" INTEGER NOT NULL,
  "suggestedLevel" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EnglishPlacementResult_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EnglishPlacementResult_studentId_key" ON "EnglishPlacementResult"("studentId");
ALTER TABLE "EnglishPlacementResult" ADD CONSTRAINT "EnglishPlacementResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
