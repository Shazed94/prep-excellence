/*
  Warnings:

  - You are about to drop the column `description` on the `coaching_courses` table. All the data in the column will be lost.
  - You are about to drop the column `answers` on the `lms_quiz_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `lms_quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `teacherProfileId` on the `onetoone_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `oneToOneSessionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityType` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `isBooked` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `specificDate` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `specificEndTime` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `specificStartTime` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `teacher_specializations` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `teacher_specializations` table. All the data in the column will be lost.
  - You are about to drop the `onetoone_reviews` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slotId]` on the table `onetoone_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[oneToOneEnrollmentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,dayOfWeek]` on the table `teacher_availabilities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,topicId]` on the table `teacher_specializations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `longDescription` to the `coaching_courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `coaching_courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortDescription` to the `coaching_courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorId` to the `coaching_modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotId` to the `onetoone_sessions` table without a default value. This is not possible if the table is not empty.
  - Made the column `dayOfWeek` on table `teacher_availabilities` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `topicId` to the `teacher_specializations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE', 'SHORT', 'LONG');

-- DropForeignKey
ALTER TABLE "lms_quiz_attempts" DROP CONSTRAINT "lms_quiz_attempts_studentId_fkey";

-- DropForeignKey
ALTER TABLE "onetoone_reviews" DROP CONSTRAINT "onetoone_reviews_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "onetoone_reviews" DROP CONSTRAINT "onetoone_reviews_studentId_fkey";

-- DropForeignKey
ALTER TABLE "onetoone_reviews" DROP CONSTRAINT "onetoone_reviews_teacherProfileId_fkey";

-- DropForeignKey
ALTER TABLE "onetoone_sessions" DROP CONSTRAINT "onetoone_sessions_teacherProfileId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_oneToOneSessionId_fkey";

-- DropIndex
DROP INDEX "onetoone_sessions_teacherProfileId_idx";

-- DropIndex
DROP INDEX "payments_oneToOneSessionId_idx";

-- DropIndex
DROP INDEX "payments_oneToOneSessionId_key";

-- DropIndex
DROP INDEX "teacher_availabilities_dayOfWeek_idx";

-- DropIndex
DROP INDEX "teacher_availabilities_specificDate_idx";

-- DropIndex
DROP INDEX "teacher_specializations_subject_idx";

-- AlterTable
ALTER TABLE "coaching_courses" DROP COLUMN "description",
ADD COLUMN     "longDescription" TEXT NOT NULL,
ADD COLUMN     "schedule" JSONB NOT NULL,
ADD COLUMN     "sortDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "coaching_modules" ADD COLUMN     "instructorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lms_quiz_attempts" DROP COLUMN "answers";

-- AlterTable
ALTER TABLE "lms_quizzes" DROP COLUMN "questions";

-- AlterTable
ALTER TABLE "onetoone_sessions" DROP COLUMN "teacherProfileId",
ADD COLUMN     "slotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "oneToOneSessionId",
ADD COLUMN     "oneToOneEnrollmentId" TEXT;

-- AlterTable
ALTER TABLE "teacher_availabilities" DROP COLUMN "availabilityType",
DROP COLUMN "endTime",
DROP COLUMN "isBooked",
DROP COLUMN "specificDate",
DROP COLUMN "specificEndTime",
DROP COLUMN "specificStartTime",
DROP COLUMN "startTime",
ALTER COLUMN "dayOfWeek" SET NOT NULL;

-- AlterTable
ALTER TABLE "teacher_specializations" DROP COLUMN "level",
DROP COLUMN "subject",
ADD COLUMN     "topicId" TEXT NOT NULL;

-- DropTable
DROP TABLE "onetoone_reviews";

-- CreateTable
CREATE TABLE "coaching_module_exams" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingScore" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "orderIndex" INTEGER NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_attempts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL,
    "isPassed" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_answers" (
    "id" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "orderIndex" INTEGER NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_answers" (
    "id" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_availability_slots" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "enrollmentId" TEXT,

    CONSTRAINT "teacher_availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "one_to_one_enrollments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ENROLLMENT_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "studentId" TEXT NOT NULL,

    CONSTRAINT "one_to_one_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "one_to_one_reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "sessionId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "one_to_one_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "coaching_module_exams_moduleId_idx" ON "coaching_module_exams"("moduleId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_questions_examId_idx" ON "coaching_module_exam_questions"("examId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_question_options_questionId_idx" ON "coaching_module_exam_question_options"("questionId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_attempts_examId_studentId_idx" ON "coaching_module_exam_attempts"("examId", "studentId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_answers_attemptId_questionId_idx" ON "coaching_module_exam_answers"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "lms_quiz_questions_quizId_idx" ON "lms_quiz_questions"("quizId");

-- CreateIndex
CREATE INDEX "lms_quiz_question_options_questionId_idx" ON "lms_quiz_question_options"("questionId");

-- CreateIndex
CREATE INDEX "lms_quiz_answers_attemptId_questionId_idx" ON "lms_quiz_answers"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "topics_subjectId_idx" ON "topics"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "topics_subjectId_name_key" ON "topics"("subjectId", "name");

-- CreateIndex
CREATE INDEX "teacher_availability_slots_availabilityId_idx" ON "teacher_availability_slots"("availabilityId");

-- CreateIndex
CREATE INDEX "teacher_availability_slots_enrollmentId_idx" ON "teacher_availability_slots"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "one_to_one_reviews_sessionId_key" ON "one_to_one_reviews"("sessionId");

-- CreateIndex
CREATE INDEX "one_to_one_reviews_teacherProfileId_idx" ON "one_to_one_reviews"("teacherProfileId");

-- CreateIndex
CREATE INDEX "one_to_one_reviews_studentId_idx" ON "one_to_one_reviews"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "onetoone_sessions_slotId_key" ON "onetoone_sessions"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_oneToOneEnrollmentId_key" ON "payments"("oneToOneEnrollmentId");

-- CreateIndex
CREATE INDEX "payments_oneToOneEnrollmentId_idx" ON "payments"("oneToOneEnrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_availabilities_profileId_dayOfWeek_key" ON "teacher_availabilities"("profileId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "teacher_specializations_topicId_idx" ON "teacher_specializations"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_specializations_profileId_topicId_key" ON "teacher_specializations"("profileId", "topicId");

-- AddForeignKey
ALTER TABLE "coaching_modules" ADD CONSTRAINT "coaching_modules_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exams" ADD CONSTRAINT "coaching_module_exams_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "coaching_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_questions" ADD CONSTRAINT "coaching_module_exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "coaching_module_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_question_options" ADD CONSTRAINT "coaching_module_exam_question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "coaching_module_exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_attempts" ADD CONSTRAINT "coaching_module_exam_attempts_examId_fkey" FOREIGN KEY ("examId") REFERENCES "coaching_module_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_attempts" ADD CONSTRAINT "coaching_module_exam_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_answers" ADD CONSTRAINT "coaching_module_exam_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "coaching_module_exam_question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_answers" ADD CONSTRAINT "coaching_module_exam_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "coaching_module_exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_answers" ADD CONSTRAINT "coaching_module_exam_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "coaching_module_exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_questions" ADD CONSTRAINT "lms_quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "lms_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_question_options" ADD CONSTRAINT "lms_quiz_question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "lms_quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_attempts" ADD CONSTRAINT "lms_quiz_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_answers" ADD CONSTRAINT "lms_quiz_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "lms_quiz_question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_answers" ADD CONSTRAINT "lms_quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "lms_quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_answers" ADD CONSTRAINT "lms_quiz_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "lms_quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_specializations" ADD CONSTRAINT "teacher_specializations_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_availability_slots" ADD CONSTRAINT "teacher_availability_slots_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "teacher_availabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_availability_slots" ADD CONSTRAINT "teacher_availability_slots_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "one_to_one_enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_to_one_enrollments" ADD CONSTRAINT "one_to_one_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "teacher_availability_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_to_one_reviews" ADD CONSTRAINT "one_to_one_reviews_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "onetoone_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_to_one_reviews" ADD CONSTRAINT "one_to_one_reviews_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_to_one_reviews" ADD CONSTRAINT "one_to_one_reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_oneToOneEnrollmentId_fkey" FOREIGN KEY ("oneToOneEnrollmentId") REFERENCES "one_to_one_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
