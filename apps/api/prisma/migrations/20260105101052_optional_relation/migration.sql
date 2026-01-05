-- DropForeignKey
ALTER TABLE "student_section_progress" DROP CONSTRAINT "student_section_progress_sectionId_fkey";

-- AlterTable
ALTER TABLE "student_section_progress" ALTER COLUMN "sectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "student_section_progress" ADD CONSTRAINT "student_section_progress_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sat_practice_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
