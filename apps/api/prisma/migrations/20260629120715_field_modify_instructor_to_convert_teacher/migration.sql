/*
  Warnings:

  - You are about to drop the column `instructorId` on the `course_modules` table. All the data in the column will be lost.
  - You are about to drop the column `instructorId` on the `live_classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_modules" DROP CONSTRAINT "course_modules_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "live_classes" DROP CONSTRAINT "live_classes_instructorId_fkey";

-- DropIndex
DROP INDEX "course_modules_instructorId_idx";

-- DropIndex
DROP INDEX "live_classes_instructorId_idx";

-- AlterTable
ALTER TABLE "course_modules" DROP COLUMN "instructorId",
ADD COLUMN     "teacherId" TEXT;

-- AlterTable
ALTER TABLE "live_classes" DROP COLUMN "instructorId",
ADD COLUMN     "teacherId" TEXT;

-- CreateIndex
CREATE INDEX "course_modules_teacherId_idx" ON "course_modules"("teacherId");

-- CreateIndex
CREATE INDEX "live_classes_teacherId_idx" ON "live_classes"("teacherId");

-- AddForeignKey
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_classes" ADD CONSTRAINT "live_classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
