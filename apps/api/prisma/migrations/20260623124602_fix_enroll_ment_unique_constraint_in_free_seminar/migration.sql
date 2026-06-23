/*
  Warnings:

  - A unique constraint covering the columns `[email,seminarId]` on the table `free_seminar_enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "free_seminar_enrollments_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "free_seminar_enrollments_email_seminarId_key" ON "free_seminar_enrollments"("email", "seminarId");
