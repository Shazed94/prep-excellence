-- AlterTable
ALTER TABLE "sat_practice_tests" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "sat_practice_tests" ADD CONSTRAINT "sat_practice_tests_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
