-- AlterTable: add optional creator (Teacher.id) to question bank for teacher scoping
ALTER TABLE "question_banks" ADD COLUMN "createdById" TEXT;

-- CreateIndex
CREATE INDEX "question_banks_createdById_idx" ON "question_banks"("createdById");
