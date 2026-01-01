/*
  Warnings:

  - You are about to drop the column `teacherProfileId` on the `onetoone_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherAvailabilityId,scheduledAt]` on the table `onetoone_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionID]` on the table `question_banks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherAvailabilityId` to the `onetoone_sessions` table without a default value. This is not possible if the table is not empty.
  - The required column `questionID` was added to the `question_banks` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "SATPracticeType" AS ENUM ('FULL_LENGTH', 'TEST_PRACTICE');

-- DropForeignKey
ALTER TABLE "onetoone_sessions" DROP CONSTRAINT "onetoone_sessions_teacherProfileId_fkey";

-- DropIndex
DROP INDEX "onetoone_sessions_teacherProfileId_idx";

-- AlterTable
ALTER TABLE "onetoone_sessions" DROP COLUMN "teacherProfileId",
ADD COLUMN     "teacherAvailabilityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "question_banks" ADD COLUMN     "questionID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sat_practice_modules" ADD COLUMN     "duration" INTEGER;

-- AlterTable
ALTER TABLE "sat_practice_tests" ADD COLUMN     "practiceType" "SATPracticeType" NOT NULL DEFAULT 'TEST_PRACTICE';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "isVerified" SET DEFAULT true;

-- CreateIndex
CREATE INDEX "onetoone_sessions_teacherAvailabilityId_idx" ON "onetoone_sessions"("teacherAvailabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "onetoone_sessions_teacherAvailabilityId_scheduledAt_key" ON "onetoone_sessions"("teacherAvailabilityId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "question_banks_questionID_key" ON "question_banks"("questionID");

-- AddForeignKey
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_teacherAvailabilityId_fkey" FOREIGN KEY ("teacherAvailabilityId") REFERENCES "teacher_availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
