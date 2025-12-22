/*
  Warnings:

  - You are about to drop the column `testTypeId` on the `subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_testTypeId_fkey";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "testTypeId";

-- CreateTable
CREATE TABLE "_SubjectToTestType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToTestType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectToTestType_B_index" ON "_SubjectToTestType"("B");

-- AddForeignKey
ALTER TABLE "_SubjectToTestType" ADD CONSTRAINT "_SubjectToTestType_A_fkey" FOREIGN KEY ("A") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTestType" ADD CONSTRAINT "_SubjectToTestType_B_fkey" FOREIGN KEY ("B") REFERENCES "test_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
