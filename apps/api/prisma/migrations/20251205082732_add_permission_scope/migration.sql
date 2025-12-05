/*
  Warnings:

  - You are about to drop the column `interests` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `preferredLanguage` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `students` table. All the data in the column will be lost.
  - The `rollId` column on the `students` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[rollId]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "scope" TEXT DEFAULT 'all';

-- AlterTable
ALTER TABLE "students" DROP COLUMN "interests",
DROP COLUMN "preferredLanguage",
DROP COLUMN "skills",
DROP COLUMN "rollId",
ADD COLUMN     "rollId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_rollId_key" ON "students"("rollId");
