/*
  Warnings:

  - You are about to drop the column `slotId` on the `onetoone_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `oneToOneEnrollmentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `teacher_specializations` table. All the data in the column will be lost.
  - You are about to drop the `one_to_one_enrollments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `one_to_one_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_availability_slots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `topics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[oneToOneSessionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherProfileId` to the `onetoone_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityType` to the `teacher_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `teacher_specializations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudentGrade" AS ENUM ('G7', 'G8', 'G9', 'G10', 'G11', 'G12');

-- DropForeignKey
ALTER TABLE "one_to_one_enrollments" DROP CONSTRAINT "one_to_one_enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "one_to_one_reviews" DROP CONSTRAINT "one_to_one_reviews_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "one_to_one_reviews" DROP CONSTRAINT "one_to_one_reviews_studentId_fkey";

-- DropForeignKey
ALTER TABLE "one_to_one_reviews" DROP CONSTRAINT "one_to_one_reviews_teacherProfileId_fkey";

-- DropForeignKey
ALTER TABLE "onetoone_sessions" DROP CONSTRAINT "onetoone_sessions_slotId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_oneToOneEnrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_availability_slots" DROP CONSTRAINT "teacher_availability_slots_availabilityId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_availability_slots" DROP CONSTRAINT "teacher_availability_slots_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_specializations" DROP CONSTRAINT "teacher_specializations_topicId_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_subjectId_fkey";

-- DropIndex
DROP INDEX "onetoone_sessions_slotId_key";

-- DropIndex
DROP INDEX "payments_oneToOneEnrollmentId_idx";

-- DropIndex
DROP INDEX "payments_oneToOneEnrollmentId_key";

-- DropIndex
DROP INDEX "teacher_availabilities_profileId_dayOfWeek_key";

-- DropIndex
DROP INDEX "teacher_specializations_profileId_topicId_key";

-- DropIndex
DROP INDEX "teacher_specializations_topicId_idx";

-- AlterTable
ALTER TABLE "coaching_module_exam_answers" ADD COLUMN     "teacherRemark" TEXT,
ADD COLUMN     "teacherScore" INTEGER;

-- AlterTable
ALTER TABLE "onetoone_sessions" DROP COLUMN "slotId",
ADD COLUMN     "teacherProfileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "oneToOneEnrollmentId",
ADD COLUMN     "oneToOneSessionId" TEXT;

-- AlterTable
ALTER TABLE "teacher_availabilities" ADD COLUMN     "availabilityType" "AVAILABILITY_TYPE" NOT NULL,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specificDate" TIMESTAMP(3),
ADD COLUMN     "specificEndTime" TIMESTAMP(3),
ADD COLUMN     "specificStartTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TEXT,
ALTER COLUMN "dayOfWeek" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teacher_specializations" DROP COLUMN "topicId",
ADD COLUMN     "level" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'INTERMEDIATE',
ADD COLUMN     "subject" TEXT NOT NULL;

-- DropTable
DROP TABLE "one_to_one_enrollments";

-- DropTable
DROP TABLE "one_to_one_reviews";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "teacher_availability_slots";

-- DropTable
DROP TABLE "topics";

-- CreateTable
CREATE TABLE "onetoone_reviews" (
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

    CONSTRAINT "onetoone_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeSeminar" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentCity" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentGrade" "StudentGrade" NOT NULL,
    "studentSchool" TEXT NOT NULL,
    "targetScore" TEXT NOT NULL,
    "dreamColleges" TEXT NOT NULL,
    "seminarGoals" TEXT NOT NULL,
    "questions" TEXT NOT NULL,

    CONSTRAINT "FreeSeminar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorRequestRegistration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentSchool" TEXT NOT NULL,
    "studentGrade" TEXT NOT NULL,
    "studentPhone" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "needHelp" TEXT NOT NULL,
    "studentNeed" TEXT NOT NULL,
    "tutorType" TEXT[],
    "callbackTime" TEXT NOT NULL,
    "tutoringDays" TEXT NOT NULL,
    "referral" TEXT,
    "specificRequest" TEXT,
    "fullName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "agreeTerms" BOOLEAN NOT NULL,

    CONSTRAINT "TutorRequestRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsLetter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onetoone_reviews_sessionId_key" ON "onetoone_reviews"("sessionId");

-- CreateIndex
CREATE INDEX "onetoone_reviews_teacherProfileId_idx" ON "onetoone_reviews"("teacherProfileId");

-- CreateIndex
CREATE INDEX "onetoone_reviews_studentId_idx" ON "onetoone_reviews"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "FreeSeminar_studentEmail_key" ON "FreeSeminar"("studentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "TutorRequestRegistration_email_key" ON "TutorRequestRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetter_email_key" ON "NewsLetter"("email");

-- CreateIndex
CREATE INDEX "onetoone_sessions_teacherProfileId_idx" ON "onetoone_sessions"("teacherProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_oneToOneSessionId_key" ON "payments"("oneToOneSessionId");

-- CreateIndex
CREATE INDEX "payments_oneToOneSessionId_idx" ON "payments"("oneToOneSessionId");

-- CreateIndex
CREATE INDEX "teacher_availabilities_dayOfWeek_idx" ON "teacher_availabilities"("dayOfWeek");

-- CreateIndex
CREATE INDEX "teacher_availabilities_specificDate_idx" ON "teacher_availabilities"("specificDate");

-- CreateIndex
CREATE INDEX "teacher_specializations_subject_idx" ON "teacher_specializations"("subject");

-- AddForeignKey
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_reviews" ADD CONSTRAINT "onetoone_reviews_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "onetoone_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_reviews" ADD CONSTRAINT "onetoone_reviews_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_reviews" ADD CONSTRAINT "onetoone_reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_oneToOneSessionId_fkey" FOREIGN KEY ("oneToOneSessionId") REFERENCES "onetoone_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
