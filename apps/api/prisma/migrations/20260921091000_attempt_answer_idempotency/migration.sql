-- Enforce one immutable answer per question in an attempt.
CREATE UNIQUE INDEX "AttemptAnswer_attemptId_questionId_key"
ON "AttemptAnswer"("attemptId", "questionId");
