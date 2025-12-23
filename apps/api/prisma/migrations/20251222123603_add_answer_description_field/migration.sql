/*
  Warnings:

  - Added the required column `answerDescription` to the `question_banks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_banks" ADD COLUMN     "answerDescription" TEXT NOT NULL;
