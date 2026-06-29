/*
  Warnings:

  - You are about to drop the column `endTime` on the `teacher_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `teacher_availabilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "teacher_availabilities" DROP COLUMN "endTime",
DROP COLUMN "startTime";
