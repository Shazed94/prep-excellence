/*
  Warnings:

  - A unique constraint covering the columns `[attemptId,questionId]` on the table `lms_quiz_answers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId,orderIndex]` on the table `lms_quiz_question_options` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quizId,orderIndex]` on the table `lms_quiz_questions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalQuestions` to the `lms_quiz_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderIndex` to the `lms_quiz_question_options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "lms_quiz_attempts" DROP CONSTRAINT "lms_quiz_attempts_studentId_fkey";

-- DropIndex
DROP INDEX "lms_quiz_answers_attemptId_questionId_idx";

-- AlterTable
ALTER TABLE "lms_quiz_answers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pointsEarned" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "isCorrect" SET DEFAULT false;

-- AlterTable
ALTER TABLE "lms_quiz_attempts" ADD COLUMN     "correctAnswers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "totalQuestions" INTEGER NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "isPassed" SET DEFAULT false,
ALTER COLUMN "timeSpent" SET DEFAULT 0,
ALTER COLUMN "completedAt" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "lms_quiz_question_options" ADD COLUMN     "orderIndex" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lms_quiz_questions" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "lms_quizzes" ADD COLUMN     "showResults" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "passingScore" SET DEFAULT 70;

-- CreateIndex
CREATE INDEX "lms_quiz_answers_attemptId_idx" ON "lms_quiz_answers"("attemptId");

-- CreateIndex
CREATE INDEX "lms_quiz_answers_questionId_idx" ON "lms_quiz_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quiz_answers_attemptId_questionId_key" ON "lms_quiz_answers"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "lms_quiz_attempts_studentId_idx" ON "lms_quiz_attempts"("studentId");

-- CreateIndex
CREATE INDEX "lms_quiz_attempts_isPassed_idx" ON "lms_quiz_attempts"("isPassed");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quiz_question_options_questionId_orderIndex_key" ON "lms_quiz_question_options"("questionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quiz_questions_quizId_orderIndex_key" ON "lms_quiz_questions"("quizId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_quizzes_isActive_idx" ON "lms_quizzes"("isActive");

-- AddForeignKey
ALTER TABLE "lms_quiz_attempts" ADD CONSTRAINT "lms_quiz_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlogComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
