/*
  Warnings:

  - You are about to drop the column `correctAnswerText` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `question_banks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "options" DROP COLUMN "correctAnswerText";

-- AlterTable
ALTER TABLE "question_banks" DROP COLUMN "correctAnswer";
