/*
  Warnings:

  - A unique constraint covering the columns `[questionID]` on the table `question_banks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionID` to the `question_banks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_banks" ADD COLUMN     "questionID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "question_banks_questionID_key" ON "question_banks"("questionID");
