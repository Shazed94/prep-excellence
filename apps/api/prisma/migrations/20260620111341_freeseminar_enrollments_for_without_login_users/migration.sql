/*
  Warnings:

  - Added the required column `capacity` to the `FreeSeminar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FreeSeminar" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "free_seminar_enrollments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seminarId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "free_seminar_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "free_seminar_enrollments_email_key" ON "free_seminar_enrollments"("email");

-- AddForeignKey
ALTER TABLE "free_seminar_enrollments" ADD CONSTRAINT "free_seminar_enrollments_seminarId_fkey" FOREIGN KEY ("seminarId") REFERENCES "FreeSeminar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
