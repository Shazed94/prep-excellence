/*
  Warnings:

  - You are about to drop the column `difficultyId` on the `question_banks` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `question_banks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DifficultyENUM" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "question_banks" DROP CONSTRAINT "question_banks_difficultyId_fkey";

-- AlterTable
ALTER TABLE "question_banks" DROP COLUMN "difficultyId",
ADD COLUMN     "difficulty" "DifficultyENUM" NOT NULL;

-- CreateTable
CREATE TABLE "FillBlank" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "alternatives" TEXT[],
    "questionBankId" TEXT NOT NULL,

    CONSTRAINT "FillBlank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FillBlank" ADD CONSTRAINT "FillBlank_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
