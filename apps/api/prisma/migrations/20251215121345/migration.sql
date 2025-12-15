/*
  Warnings:

  - You are about to drop the column `level` on the `difficulties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "difficulties" DROP COLUMN "level",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "domains" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "test_types" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
