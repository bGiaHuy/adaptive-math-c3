-- New records default to THPT. Historical question/assignment data is untouched.
ALTER TABLE "StudentProfile" ALTER COLUMN "grade" SET DEFAULT 10;
ALTER TABLE "StudentProfile" ALTER COLUMN "targetGoal" SET DEFAULT 'Ôn thi cuối kỳ';
ALTER TABLE "Classroom" ALTER COLUMN "grade" SET DEFAULT 10;
ALTER TABLE "SkillNode" ALTER COLUMN "grade" SET DEFAULT 10;
