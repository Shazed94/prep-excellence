/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TrustedCompanies` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `TrustedCompanies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TrustedCompanies" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TrustedCompanies_name_key" ON "TrustedCompanies"("name");
