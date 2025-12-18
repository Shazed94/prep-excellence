-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'SHORT_ANSWER');

-- CreateEnum
CREATE TYPE "SATPracticeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'SUBMITTED', 'GRADED');

-- CreateTable
CREATE TABLE "question_banks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "testTypeId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "difficultyId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "optionType" "OptionType" NOT NULL DEFAULT 'SINGLE_CHOICE',

    CONSTRAINT "question_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "correctAnswerText" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionBankId" TEXT NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sat_practice_tests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "status" "SATPracticeStatus" NOT NULL DEFAULT 'DRAFT',
    "testTypeId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "difficultyId" TEXT,

    CONSTRAINT "sat_practice_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sat_practice_sections" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "satPracticeId" TEXT NOT NULL,

    CONSTRAINT "sat_practice_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sat_practice_modules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "direction" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "sat_practice_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_sat_attempts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "satPracticeId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "totalScore" INTEGER,
    "maxScore" INTEGER,
    "percentageScore" DOUBLE PRECISION,
    "totalTimeSpent" INTEGER,

    CONSTRAINT "student_sat_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_section_progress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attemptId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER,
    "currentModuleId" TEXT,

    CONSTRAINT "student_section_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_module_progress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sectionProgressId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "usedQuestionSet" TEXT,
    "score" INTEGER,
    "maxScore" INTEGER,
    "correctAnswers" INTEGER,
    "totalQuestions" INTEGER,
    "nextModuleId" TEXT,

    CONSTRAINT "student_module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_answers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "isManuallyGraded" BOOLEAN NOT NULL DEFAULT false,
    "gradedByTeacherId" TEXT,
    "gradedAt" TIMESTAMP(3),
    "teacherFeedback" TEXT,
    "timeSpent" INTEGER,
    "flaggedForReview" BOOLEAN NOT NULL DEFAULT false,
    "answerOrder" INTEGER,

    CONSTRAINT "student_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_answer_options" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentAnswerId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "student_answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModuleQuestionsSetOne" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModuleQuestionsSetOne_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ModuleQuestionsSetTwo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModuleQuestionsSetTwo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "question_banks_id_idx" ON "question_banks"("id");

-- CreateIndex
CREATE INDEX "options_id_idx" ON "options"("id");

-- CreateIndex
CREATE INDEX "sat_practice_tests_id_idx" ON "sat_practice_tests"("id");

-- CreateIndex
CREATE INDEX "sat_practice_sections_id_idx" ON "sat_practice_sections"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sat_practice_modules_sectionId_orderIndex_key" ON "sat_practice_modules"("sectionId", "orderIndex");

-- CreateIndex
CREATE INDEX "student_sat_attempts_studentId_idx" ON "student_sat_attempts"("studentId");

-- CreateIndex
CREATE INDEX "student_sat_attempts_satPracticeId_idx" ON "student_sat_attempts"("satPracticeId");

-- CreateIndex
CREATE INDEX "student_sat_attempts_status_idx" ON "student_sat_attempts"("status");

-- CreateIndex
CREATE INDEX "student_section_progress_attemptId_idx" ON "student_section_progress"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "student_section_progress_attemptId_sectionId_key" ON "student_section_progress"("attemptId", "sectionId");

-- CreateIndex
CREATE INDEX "student_module_progress_sectionProgressId_idx" ON "student_module_progress"("sectionProgressId");

-- CreateIndex
CREATE UNIQUE INDEX "student_module_progress_sectionProgressId_moduleId_key" ON "student_module_progress"("sectionProgressId", "moduleId");

-- CreateIndex
CREATE INDEX "student_answers_attemptId_idx" ON "student_answers"("attemptId");

-- CreateIndex
CREATE INDEX "student_answers_questionId_idx" ON "student_answers"("questionId");

-- CreateIndex
CREATE INDEX "student_answers_isManuallyGraded_idx" ON "student_answers"("isManuallyGraded");

-- CreateIndex
CREATE UNIQUE INDEX "student_answers_attemptId_questionId_key" ON "student_answers"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "student_answer_options_studentAnswerId_idx" ON "student_answer_options"("studentAnswerId");

-- CreateIndex
CREATE INDEX "student_answer_options_optionId_idx" ON "student_answer_options"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "student_answer_options_studentAnswerId_optionId_key" ON "student_answer_options"("studentAnswerId", "optionId");

-- CreateIndex
CREATE INDEX "_ModuleQuestionsSetOne_B_index" ON "_ModuleQuestionsSetOne"("B");

-- CreateIndex
CREATE INDEX "_ModuleQuestionsSetTwo_B_index" ON "_ModuleQuestionsSetTwo"("B");

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_testTypeId_fkey" FOREIGN KEY ("testTypeId") REFERENCES "test_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "difficulties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sat_practice_tests" ADD CONSTRAINT "sat_practice_tests_testTypeId_fkey" FOREIGN KEY ("testTypeId") REFERENCES "test_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sat_practice_tests" ADD CONSTRAINT "sat_practice_tests_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sat_practice_tests" ADD CONSTRAINT "sat_practice_tests_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "difficulties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sat_practice_sections" ADD CONSTRAINT "sat_practice_sections_satPracticeId_fkey" FOREIGN KEY ("satPracticeId") REFERENCES "sat_practice_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sat_practice_modules" ADD CONSTRAINT "sat_practice_modules_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sat_practice_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_sat_attempts" ADD CONSTRAINT "student_sat_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_sat_attempts" ADD CONSTRAINT "student_sat_attempts_satPracticeId_fkey" FOREIGN KEY ("satPracticeId") REFERENCES "sat_practice_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_section_progress" ADD CONSTRAINT "student_section_progress_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "student_sat_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_section_progress" ADD CONSTRAINT "student_section_progress_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sat_practice_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_module_progress" ADD CONSTRAINT "student_module_progress_sectionProgressId_fkey" FOREIGN KEY ("sectionProgressId") REFERENCES "student_section_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_module_progress" ADD CONSTRAINT "student_module_progress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "sat_practice_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "student_sat_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_gradedByTeacherId_fkey" FOREIGN KEY ("gradedByTeacherId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answer_options" ADD CONSTRAINT "student_answer_options_studentAnswerId_fkey" FOREIGN KEY ("studentAnswerId") REFERENCES "student_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answer_options" ADD CONSTRAINT "student_answer_options_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetOne" ADD CONSTRAINT "_ModuleQuestionsSetOne_A_fkey" FOREIGN KEY ("A") REFERENCES "sat_practice_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetOne" ADD CONSTRAINT "_ModuleQuestionsSetOne_B_fkey" FOREIGN KEY ("B") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetTwo" ADD CONSTRAINT "_ModuleQuestionsSetTwo_A_fkey" FOREIGN KEY ("A") REFERENCES "sat_practice_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetTwo" ADD CONSTRAINT "_ModuleQuestionsSetTwo_B_fkey" FOREIGN KEY ("B") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
