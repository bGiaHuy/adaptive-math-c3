-- CreateTable
CREATE TABLE "AiRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "conversationId" TEXT,
    "lessonId" TEXT,
    "message" TEXT,
    "model" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "reservedUsd" DOUBLE PRECISION NOT NULL,
    "costUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "result" JSONB,
    "practiceAnswers" JSONB,
    "practiceCorrect" INTEGER,
    "practiceSubmittedAt" TIMESTAMP(3),
    "draftLessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MathReviewCard" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "scheduler" JSONB NOT NULL,
    "due" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "successes" INTEGER NOT NULL DEFAULT 0,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MathReviewCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MathReviewLog" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "cardVersion" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "rating" INTEGER,
    "schedulerLog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "MathReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiRequest_draftLessonId_key" ON "AiRequest"("draftLessonId");

-- CreateIndex
CREATE INDEX "AiRequest_userId_createdAt_idx" ON "AiRequest"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiRequest_ipHash_createdAt_idx" ON "AiRequest"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "AiRequest_conversationId_userId_createdAt_idx" ON "AiRequest"("conversationId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiRequest_status_createdAt_idx" ON "AiRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "MathReviewCard_studentId_due_idx" ON "MathReviewCard"("studentId", "due");

-- CreateIndex
CREATE UNIQUE INDEX "MathReviewCard_studentId_questionId_key" ON "MathReviewCard"("studentId", "questionId");

-- CreateIndex
CREATE INDEX "MathReviewLog_cardId_completedAt_idx" ON "MathReviewLog"("cardId", "completedAt");

-- AddForeignKey
ALTER TABLE "AiRequest" ADD CONSTRAINT "AiRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MathReviewCard" ADD CONSTRAINT "MathReviewCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MathReviewLog" ADD CONSTRAINT "MathReviewLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "MathReviewCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
