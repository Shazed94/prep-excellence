/*
  Warnings:

  - You are about to drop the column `difficultyId` on the `sat_practice_tests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sat_practice_tests" DROP CONSTRAINT "sat_practice_tests_difficultyId_fkey";

-- AlterTable
ALTER TABLE "sat_practice_tests" DROP COLUMN "difficultyId",
ADD COLUMN     "difficulty" "DifficultyENUM" DEFAULT 'EASY';
