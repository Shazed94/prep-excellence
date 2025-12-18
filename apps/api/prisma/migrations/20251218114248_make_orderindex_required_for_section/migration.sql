-- AlterTable
ALTER TABLE "sat_practice_modules" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "threshold" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sat_practice_sections" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "orderIndex" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sat_practice_tests" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "testTypeId" DROP NOT NULL,
ALTER COLUMN "subjectId" DROP NOT NULL;
