-- DropForeignKey
ALTER TABLE "student_answers" DROP CONSTRAINT "student_answers_gradedByTeacherId_fkey";

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_gradedByTeacherId_fkey" FOREIGN KEY ("gradedByTeacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
