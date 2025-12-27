/*
  Warnings:

  - A unique constraint covering the columns `[qestionID]` on the table `question_banks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qestionID` to the `question_banks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_banks" ADD COLUMN     "qestionID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "question_banks_qestionID_key" ON "question_banks"("qestionID");
