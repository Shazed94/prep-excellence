/*
  Warnings:

  - You are about to drop the column `subjectId` on the `domains` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_domainId_fkey";

-- AlterTable
ALTER TABLE "domains" DROP COLUMN "subjectId";

-- CreateTable
CREATE TABLE "_DomainToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DomainToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DomainToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DomainToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DomainToSubject_B_index" ON "_DomainToSubject"("B");

-- CreateIndex
CREATE INDEX "_DomainToSkill_B_index" ON "_DomainToSkill"("B");

-- AddForeignKey
ALTER TABLE "_DomainToSubject" ADD CONSTRAINT "_DomainToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSubject" ADD CONSTRAINT "_DomainToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSkill" ADD CONSTRAINT "_DomainToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSkill" ADD CONSTRAINT "_DomainToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
