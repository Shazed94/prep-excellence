/*
  Warnings:

  - You are about to drop the column `date` on the `FreeSeminar` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `FreeSeminar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `FreeSeminar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `FreeSeminar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FreeSeminar" DROP COLUMN "date",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
