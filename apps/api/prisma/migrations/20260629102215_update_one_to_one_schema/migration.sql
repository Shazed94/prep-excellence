/*
  Warnings:

  - The values [RECURRING_WEEKLY,ONE_TIME_SLOT] on the enum `AVAILABILITY_TYPE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hourlyRate` on the `teacher_profiles` table. All the data in the column will be lost.
  - Added the required column `category` to the `teacher_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offlineHourlyRate` to the `teacher_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `onlineHourlyRate` to the `teacher_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AVAILABILITY_CATEGORY" AS ENUM ('AVAILABLE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ATTENDANCE_STATUS" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "SUBMISSION_STATUS" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'GRADED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('NEW_LESSON', 'LIVE_CLASS_REMINDER', 'ASSIGNMENT_DEADLINE', 'QUIZ_AVAILABLE', 'EXAM_SCHEDULED', 'RESULT_PUBLISHED', 'CERTIFICATE_AVAILABLE', 'GENERAL_ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "CERTIFICATE_STATUS" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LEADERBOARD_TYPE" AS ENUM ('COURSE_WISE', 'GLOBAL');

-- CreateEnum
CREATE TYPE "POINT_SOURCE" AS ENUM ('QUIZ', 'EXAM', 'ASSIGNMENT', 'ATTENDANCE', 'COURSE_COMPLETION', 'BONUS');

-- AlterEnum
BEGIN;
CREATE TYPE "AVAILABILITY_TYPE_new" AS ENUM ('ONLINE', 'OFFLINE');
ALTER TABLE "teacher_availabilities" ALTER COLUMN "availabilityType" TYPE "AVAILABILITY_TYPE_new" USING ("availabilityType"::text::"AVAILABILITY_TYPE_new");
ALTER TYPE "AVAILABILITY_TYPE" RENAME TO "AVAILABILITY_TYPE_old";
ALTER TYPE "AVAILABILITY_TYPE_new" RENAME TO "AVAILABILITY_TYPE";
DROP TYPE "public"."AVAILABILITY_TYPE_old";
COMMIT;

-- AlterTable
ALTER TABLE "coaching_contents" ALTER COLUMN "contentType" SET DEFAULT 'VIDEO_LIVE';

-- AlterTable
ALTER TABLE "teacher_availabilities" ADD COLUMN     "bufferTime" INTEGER,
ADD COLUMN     "category" "AVAILABILITY_CATEGORY" NOT NULL,
ADD COLUMN     "hourlyRate" DECIMAL(65,30),
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "repeatDuration" INTEGER DEFAULT 90,
ADD COLUMN     "sessionDuration" INTEGER,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "teacher_profiles" DROP COLUMN "hourlyRate",
ADD COLUMN     "offlineHourlyRate" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "onlineHourlyRate" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "thumbnail" TEXT,
    "level" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'BEGINNER',
    "tags" TEXT[],
    "capacity" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_schedules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayOfWeek" "DAY_OF_WEEK" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "course_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_schedule_exceptions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exceptionDate" TIMESTAMP(3) NOT NULL,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "rescheduleDate" TIMESTAMP(3),
    "courseId" TEXT NOT NULL,

    CONSTRAINT "course_schedule_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_classes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "dayOfWeek" "DAY_OF_WEEK" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "scheduled_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "courseId" TEXT NOT NULL,
    "scheduledClassId" TEXT,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_attachments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "linkUrl" TEXT,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "lesson_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_class_details" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "jitsiRoomId" TEXT,
    "jitsiRoomToken" TEXT,
    "jitsiStartUrl" TEXT,
    "instructorId" TEXT,
    "maxParticipants" INTEGER,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "recordedContentId" TEXT,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "live_class_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "showResults" BOOLEAN NOT NULL DEFAULT true,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "orderIndex" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "examId" TEXT NOT NULL,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "exam_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_submissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "earnedPoints" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "status" "SUBMISSION_STATUS" NOT NULL DEFAULT 'DRAFT',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "teacherFeedback" TEXT,
    "publishedAt" TIMESTAMP(3),
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "exam_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_answers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedOptionId" TEXT,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "isManuallyGraded" BOOLEAN NOT NULL DEFAULT false,
    "teacherScore" INTEGER,
    "teacherFeedback" TEXT,
    "questionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "exam_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "totalPoints" INTEGER NOT NULL DEFAULT 100,
    "dueDate" TIMESTAMP(3),
    "allowLateSubmission" BOOLEAN NOT NULL DEFAULT false,
    "lateSubmissionPenalty" INTEGER,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "textAnswer" TEXT,
    "status" "SUBMISSION_STATUS" NOT NULL DEFAULT 'DRAFT',
    "score" INTEGER,
    "isPassed" BOOLEAN,
    "teacherFeedback" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_attachments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "assignment_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ENROLLMENT_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "liveClassWatched" BOOLEAN NOT NULL DEFAULT false,
    "liveClassWatchTime" INTEGER NOT NULL DEFAULT 0,
    "quizCompleted" BOOLEAN,
    "quizScore" INTEGER,
    "quizPassed" BOOLEAN,
    "examCompleted" BOOLEAN,
    "examScore" INTEGER,
    "examPassed" BOOLEAN,
    "assignmentCompleted" BOOLEAN,
    "assignmentScore" INTEGER,
    "assignmentPassed" BOOLEAN,
    "lessonId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ATTENDANCE_STATUS" NOT NULL DEFAULT 'PRESENT',
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "duration" INTEGER,
    "markedById" TEXT,
    "studentId" TEXT NOT NULL,
    "scheduledClassId" TEXT NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "NOTIFICATION_TYPE" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "referenceId" TEXT,
    "referenceType" TEXT,
    "actionUrl" TEXT,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationCode" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "status" "CERTIFICATE_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "LEADERBOARD_TYPE" NOT NULL DEFAULT 'COURSE_WISE',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "quizScore" INTEGER NOT NULL DEFAULT 0,
    "examScore" INTEGER NOT NULL DEFAULT 0,
    "assignmentScore" INTEGER NOT NULL DEFAULT 0,
    "attendancePoints" INTEGER NOT NULL DEFAULT 0,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "leaderboardId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_transactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" INTEGER NOT NULL,
    "source" "POINT_SOURCE" NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_slug_idx" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_createdById_idx" ON "courses"("createdById");

-- CreateIndex
CREATE INDEX "course_schedules_courseId_idx" ON "course_schedules"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_schedules_courseId_dayOfWeek_startTime_key" ON "course_schedules"("courseId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE INDEX "course_schedule_exceptions_courseId_idx" ON "course_schedule_exceptions"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_schedule_exceptions_courseId_exceptionDate_key" ON "course_schedule_exceptions"("courseId", "exceptionDate");

-- CreateIndex
CREATE INDEX "scheduled_classes_courseId_idx" ON "scheduled_classes"("courseId");

-- CreateIndex
CREATE INDEX "scheduled_classes_classDate_idx" ON "scheduled_classes"("classDate");

-- CreateIndex
CREATE UNIQUE INDEX "scheduled_classes_courseId_classDate_startTime_key" ON "scheduled_classes"("courseId", "classDate", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_scheduledClassId_key" ON "lessons"("scheduledClassId");

-- CreateIndex
CREATE INDEX "lessons_courseId_idx" ON "lessons"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_courseId_orderIndex_key" ON "lessons"("courseId", "orderIndex");

-- CreateIndex
CREATE INDEX "lesson_attachments_lessonId_idx" ON "lesson_attachments"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "live_class_details_lessonId_key" ON "live_class_details"("lessonId");

-- CreateIndex
CREATE INDEX "live_class_details_lessonId_idx" ON "live_class_details"("lessonId");

-- CreateIndex
CREATE INDEX "live_class_details_instructorId_idx" ON "live_class_details"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "exams_lessonId_key" ON "exams"("lessonId");

-- CreateIndex
CREATE INDEX "exams_lessonId_idx" ON "exams"("lessonId");

-- CreateIndex
CREATE INDEX "exam_questions_examId_idx" ON "exam_questions"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_questions_examId_orderIndex_key" ON "exam_questions"("examId", "orderIndex");

-- CreateIndex
CREATE INDEX "exam_question_options_questionId_idx" ON "exam_question_options"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_question_options_questionId_orderIndex_key" ON "exam_question_options"("questionId", "orderIndex");

-- CreateIndex
CREATE INDEX "exam_submissions_examId_idx" ON "exam_submissions"("examId");

-- CreateIndex
CREATE INDEX "exam_submissions_studentId_idx" ON "exam_submissions"("studentId");

-- CreateIndex
CREATE INDEX "exam_submissions_status_idx" ON "exam_submissions"("status");

-- CreateIndex
CREATE INDEX "exam_answers_submissionId_idx" ON "exam_answers"("submissionId");

-- CreateIndex
CREATE INDEX "exam_answers_questionId_idx" ON "exam_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_answers_submissionId_questionId_key" ON "exam_answers"("submissionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_lessonId_key" ON "assignments"("lessonId");

-- CreateIndex
CREATE INDEX "assignments_lessonId_idx" ON "assignments"("lessonId");

-- CreateIndex
CREATE INDEX "assignment_submissions_assignmentId_idx" ON "assignment_submissions"("assignmentId");

-- CreateIndex
CREATE INDEX "assignment_submissions_studentId_idx" ON "assignment_submissions"("studentId");

-- CreateIndex
CREATE INDEX "assignment_submissions_status_idx" ON "assignment_submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_assignmentId_studentId_key" ON "assignment_submissions"("assignmentId", "studentId");

-- CreateIndex
CREATE INDEX "assignment_attachments_submissionId_idx" ON "assignment_attachments"("submissionId");

-- CreateIndex
CREATE INDEX "enrollments_studentId_idx" ON "enrollments"("studentId");

-- CreateIndex
CREATE INDEX "enrollments_courseId_idx" ON "enrollments"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_courseId_studentId_key" ON "enrollments"("courseId", "studentId");

-- CreateIndex
CREATE INDEX "lesson_progress_lessonId_idx" ON "lesson_progress"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_progress_enrollmentId_idx" ON "lesson_progress"("enrollmentId");

-- CreateIndex
CREATE INDEX "lesson_progress_studentId_idx" ON "lesson_progress"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_lessonId_enrollmentId_key" ON "lesson_progress"("lessonId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_lessonId_studentId_key" ON "lesson_progress"("lessonId", "studentId");

-- CreateIndex
CREATE INDEX "attendances_scheduledClassId_idx" ON "attendances"("scheduledClassId");

-- CreateIndex
CREATE INDEX "attendances_studentId_idx" ON "attendances"("studentId");

-- CreateIndex
CREATE INDEX "attendances_status_idx" ON "attendances"("status");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_studentId_scheduledClassId_key" ON "attendances"("studentId", "scheduledClassId");

-- CreateIndex
CREATE INDEX "notifications_studentId_isRead_idx" ON "notifications"("studentId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_studentId_idx" ON "notifications"("studentId");

-- CreateIndex
CREATE INDEX "notifications_courseId_idx" ON "notifications"("courseId");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "certificates"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_verificationCode_key" ON "certificates"("verificationCode");

-- CreateIndex
CREATE INDEX "certificates_courseId_idx" ON "certificates"("courseId");

-- CreateIndex
CREATE INDEX "certificates_studentId_idx" ON "certificates"("studentId");

-- CreateIndex
CREATE INDEX "certificates_verificationCode_idx" ON "certificates"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_courseId_studentId_key" ON "certificates"("courseId", "studentId");

-- CreateIndex
CREATE INDEX "leaderboards_courseId_idx" ON "leaderboards"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_type_courseId_key" ON "leaderboards"("type", "courseId");

-- CreateIndex
CREATE INDEX "leaderboard_entries_leaderboardId_idx" ON "leaderboard_entries"("leaderboardId");

-- CreateIndex
CREATE INDEX "leaderboard_entries_studentId_idx" ON "leaderboard_entries"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entries_leaderboardId_studentId_key" ON "leaderboard_entries"("leaderboardId", "studentId");

-- CreateIndex
CREATE INDEX "point_transactions_studentId_idx" ON "point_transactions"("studentId");

-- CreateIndex
CREATE INDEX "point_transactions_courseId_idx" ON "point_transactions"("courseId");

-- CreateIndex
CREATE INDEX "point_transactions_source_idx" ON "point_transactions"("source");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_schedules" ADD CONSTRAINT "course_schedules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_schedule_exceptions" ADD CONSTRAINT "course_schedule_exceptions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_classes" ADD CONSTRAINT "scheduled_classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_scheduledClassId_fkey" FOREIGN KEY ("scheduledClassId") REFERENCES "scheduled_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_attachments" ADD CONSTRAINT "lesson_attachments_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_class_details" ADD CONSTRAINT "live_class_details_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_class_details" ADD CONSTRAINT "live_class_details_recordedContentId_fkey" FOREIGN KEY ("recordedContentId") REFERENCES "coaching_contents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_class_details" ADD CONSTRAINT "live_class_details_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_question_options" ADD CONSTRAINT "exam_question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "exam_question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "exam_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attachments" ADD CONSTRAINT "assignment_attachments_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "assignment_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_scheduledClassId_fkey" FOREIGN KEY ("scheduledClassId") REFERENCES "scheduled_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "leaderboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
