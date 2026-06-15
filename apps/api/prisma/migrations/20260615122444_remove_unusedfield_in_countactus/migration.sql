/*
  Warnings:

  - You are about to drop the column `bestTime` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `helpWith` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `other` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `studentGrade` on the `contact_us` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact_us" DROP COLUMN "bestTime",
DROP COLUMN "country",
DROP COLUMN "helpWith",
DROP COLUMN "other",
DROP COLUMN "state",
DROP COLUMN "studentGrade";
