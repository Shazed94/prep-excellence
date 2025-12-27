-- CreateEnum
CREATE TYPE "EducatorRoleType" AS ENUM ('TEACHER', 'INSTRUCTOR');

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "role" "EducatorRoleType" NOT NULL DEFAULT 'TEACHER';
