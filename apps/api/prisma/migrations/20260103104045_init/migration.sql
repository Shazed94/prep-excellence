-- CreateEnum
CREATE TYPE "ACADEMIC_STATUS" AS ENUM ('ACTIVE', 'PROBATION', 'GRADUATED');

-- CreateEnum
CREATE TYPE "RELATION_TYPE" AS ENUM ('MOTHER', 'FATHER', 'GUARDIAN');

-- CreateEnum
CREATE TYPE "EducatorRoleType" AS ENUM ('TEACHER', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "JOB_TITLE" AS ENUM ('ADMIN', 'SUPPORT', 'MANAGER', 'ACCOUNTANT', 'DEVELOPER', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "DEPARTMENT" AS ENUM ('OPERATIONS', 'FINANCE', 'HR', 'IT', 'SALES', 'MARKETING');

-- CreateEnum
CREATE TYPE "CONTENT_TYPE" AS ENUM ('VIDEO_RECORDED', 'VIDEO_LIVE', 'VIDEO_SCHEDULED', 'QUIZ', 'ASSIGNMENT', 'TEST', 'READING_MATERIAL', 'DISCUSSION');

-- CreateEnum
CREATE TYPE "PAYMENT_TYPE" AS ENUM ('FULL_UPFRONT', 'INSTALLMENT', 'PER_SESSION');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "PAYMENT_PROVIDER" AS ENUM ('STRIPE', 'PAYPAL', 'MANUAL');

-- CreateEnum
CREATE TYPE "ENROLLMENT_STATUS" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SESSION_STATUS" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "DIFFICULTY_LEVEL" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "AVAILABILITY_TYPE" AS ENUM ('RECURRING_WEEKLY', 'ONE_TIME_SLOT');

-- CreateEnum
CREATE TYPE "DAY_OF_WEEK" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE', 'SHORT', 'LONG');

-- CreateEnum
CREATE TYPE "StudentGrade" AS ENUM ('G7', 'G8', 'G9', 'G10', 'G11', 'G12');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SATPracticeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SATPracticeType" AS ENUM ('FULL_LENGTH', 'TEST_PRACTICE');

-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'SHORT_ANSWER');

-- CreateEnum
CREATE TYPE "DifficultyENUM" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'SUBMITTED', 'GRADED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'PUBLISH', 'UNPUBLISH', 'ENROLL', 'CHANGE_STATUS');

-- CreateTable
CREATE TABLE "coaching_courses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "thumbnail" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "level" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'BEGINNER',
    "duration" INTEGER,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "capacity" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "schedule" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "coaching_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_modules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "unlockAtPercent" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,

    CONSTRAINT "coaching_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_topics" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "coaching_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_contents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "contentType" "CONTENT_TYPE" NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "duration" INTEGER,
    "jitsiRoomId" TEXT,
    "jitsiRoomToken" TEXT,
    "jitsiStartUrl" TEXT,
    "instructorId" TEXT,
    "maxParticipants" INTEGER,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "recordingUrl" TEXT,
    "videoStatus" TEXT,
    "rawVideoUrl" TEXT,
    "masterPlaylistUrl" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailOptions" JSONB,
    "videoDuration" INTEGER,
    "videoWidth" INTEGER,
    "videoHeight" INTEGER,
    "videoCodec" TEXT,
    "videoBitrate" INTEGER,
    "videoFps" DOUBLE PRECISION,
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "quizData" JSONB,
    "passingScore" INTEGER,
    "timeLimit" INTEGER,
    "assignmentData" JSONB,
    "dueDate" TIMESTAMP(3),
    "totalPoints" INTEGER,
    "content" TEXT,
    "attachments" TEXT[],
    "topicId" TEXT NOT NULL,

    CONSTRAINT "coaching_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_enrollments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ENROLLMENT_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "lastAccessedAt" TIMESTAMP(3),
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "coaching_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_progress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "grade" TEXT,
    "feedback" TEXT,
    "contentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "coaching_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_submissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUrls" TEXT[],
    "textAnswer" TEXT,
    "score" INTEGER,
    "grade" TEXT,
    "feedback" TEXT,
    "gradedAt" TIMESTAMP(3),
    "gradedById" TEXT,
    "contentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "coaching_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_attendances" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "duration" INTEGER,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "contentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "coaching_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exams" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingScore" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "orderIndex" INTEGER NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_attempts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL,
    "isPassed" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_module_exam_answers" (
    "id" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "teacherRemark" TEXT,
    "teacherScore" INTEGER,
    "questionId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,

    CONSTRAINT "coaching_module_exam_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_courses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) DEFAULT 0,
    "level" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'BEGINNER',
    "duration" INTEGER,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "requirements" TEXT[],
    "whatYouLearn" TEXT[],
    "publishedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "averageRating" DOUBLE PRECISION DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "instructorId" TEXT NOT NULL,

    CONSTRAINT "lms_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_modules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "duration" INTEGER,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "lms_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_lessons" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "contentType" "CONTENT_TYPE" NOT NULL DEFAULT 'VIDEO_RECORDED',
    "videoStatus" TEXT,
    "rawVideoUrl" TEXT,
    "masterPlaylistUrl" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailOptions" JSONB,
    "videoDuration" INTEGER,
    "videoWidth" INTEGER,
    "videoHeight" INTEGER,
    "videoCodec" TEXT,
    "videoBitrate" INTEGER,
    "videoFps" DOUBLE PRECISION,
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "content" TEXT,
    "attachments" TEXT[],
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "lms_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quizzes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "showResults" BOOLEAN NOT NULL DEFAULT true,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "lms_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "orderIndex" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_attempts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "quizId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_answers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedOptionId" TEXT,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "questionId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_enrollments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ENROLLMENT_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "lastAccessedAt" TIMESTAMP(3),
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "lms_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_progress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "watchTimeSeconds" INTEGER NOT NULL DEFAULT 0,
    "lastPosition" INTEGER NOT NULL DEFAULT 0,
    "completionPercent" INTEGER NOT NULL DEFAULT 0,
    "lessonId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "lms_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_discussions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "lessonId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "lms_discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "lms_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bio" TEXT,
    "hourlyRate" DECIMAL(65,30) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "videoUrl" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "responseTime" INTEGER,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_specializations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" TEXT NOT NULL,
    "level" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'INTERMEDIATE',
    "yearsExp" INTEGER,
    "description" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "teacher_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_availabilities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availabilityType" "AVAILABILITY_TYPE" NOT NULL,
    "dayOfWeek" "DAY_OF_WEEK",
    "startTime" TEXT,
    "endTime" TEXT,
    "specificDate" TIMESTAMP(3),
    "specificStartTime" TIMESTAMP(3),
    "specificEndTime" TIMESTAMP(3),
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "teacher_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onetoone_sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "SESSION_STATUS" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL,
    "topic" TEXT,
    "notes" TEXT,
    "jitsiRoomId" TEXT NOT NULL,
    "jitsiRoomToken" TEXT,
    "jitsiStartUrl" TEXT,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "actualDuration" INTEGER,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "cancelledById" TEXT,
    "teacherAvailabilityId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "onetoone_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_recordings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT,
    "rawVideoUrl" TEXT,
    "masterPlaylistUrl" TEXT,
    "thumbnailUrl" TEXT,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "downloadUrl" TEXT,
    "isDownloadEnabled" BOOLEAN NOT NULL DEFAULT true,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastDownloadAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "session_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onetoone_reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "sessionId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "onetoone_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "paymentType" "PAYMENT_TYPE" NOT NULL,
    "provider" "PAYMENT_PROVIDER" NOT NULL DEFAULT 'STRIPE',
    "stripePaymentId" TEXT,
    "stripeSessionId" TEXT,
    "paypalOrderId" TEXT,
    "transactionId" TEXT,
    "paymentMethod" TEXT,
    "last4" TEXT,
    "receiptUrl" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "lmsEnrollmentId" TEXT,
    "coachingEnrollmentId" TEXT,
    "oneToOneSessionId" TEXT,
    "studentId" TEXT NOT NULL,
    "paymentPlanId" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paidAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "installments" JSONB NOT NULL,
    "currentInstallment" INTEGER NOT NULL DEFAULT 0,
    "totalInstallments" INTEGER NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "unlockedPercent" INTEGER NOT NULL DEFAULT 0,
    "coachingEnrollmentId" TEXT,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "items" JSONB NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "notes" TEXT,
    "terms" TEXT,
    "paymentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reason" TEXT NOT NULL,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "stripeRefundId" TEXT,
    "paypalRefundId" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "internalNotes" TEXT,
    "studentNotes" TEXT,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_types" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "test_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difficulties" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "difficulties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "domainId" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_banks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "questionID" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "answerDescription" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "testTypeId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "difficulty" "DifficultyENUM" NOT NULL,
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
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionBankId" TEXT NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillBlank" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "alternatives" TEXT[],
    "questionBankId" TEXT NOT NULL,

    CONSTRAINT "FillBlank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sat_practice_tests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "status" "SATPracticeStatus" NOT NULL DEFAULT 'DRAFT',
    "practiceType" "SATPracticeType" NOT NULL DEFAULT 'TEST_PRACTICE',
    "testTypeId" TEXT,
    "subjectId" TEXT,
    "difficultyId" TEXT,

    CONSTRAINT "sat_practice_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sat_practice_sections" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "duration" INTEGER,
    "orderIndex" INTEGER NOT NULL,
    "satPracticeId" TEXT NOT NULL,

    CONSTRAINT "sat_practice_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sat_practice_modules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "duration" INTEGER,
    "threshold" INTEGER,
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
CREATE TABLE "Guidance" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "stateRegion" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "studentGrade" TEXT NOT NULL,
    "gpa" TEXT NOT NULL,
    "takenSATACT" TEXT NOT NULL,
    "satActScore" TEXT NOT NULL,
    "extracurricular" TEXT NOT NULL,
    "targetColleges" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "childDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guidance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeSeminar" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentCity" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentGrade" "StudentGrade" NOT NULL,
    "studentSchool" TEXT NOT NULL,
    "targetScore" TEXT NOT NULL,
    "dreamColleges" TEXT NOT NULL,
    "seminarGoals" TEXT NOT NULL,
    "questions" TEXT NOT NULL,

    CONSTRAINT "FreeSeminar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorRequestRegistration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentSchool" TEXT NOT NULL,
    "studentGrade" TEXT NOT NULL,
    "studentPhone" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "needHelp" TEXT NOT NULL,
    "studentNeed" TEXT NOT NULL,
    "tutorType" TEXT[],
    "callbackTime" TEXT NOT NULL,
    "tutoringDays" TEXT NOT NULL,
    "referral" TEXT,
    "specificRequest" TEXT,
    "fullName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "agreeTerms" BOOLEAN NOT NULL,

    CONSTRAINT "TutorRequestRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsLetter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedCompanies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "TrustedCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_essay_reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentSchool" TEXT NOT NULL,
    "studentPhone" TEXT,
    "address" TEXT NOT NULL,
    "collegeTarget" TEXT NOT NULL,
    "satExamDate" TEXT,
    "targetScore" TEXT,
    "lastSatScore" TEXT,
    "referral" TEXT,
    "parentQuestion" TEXT,
    "accommodationRequest" TEXT,
    "paymentDate" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "agreedToTerms" BOOLEAN NOT NULL,

    CONSTRAINT "college_essay_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_us" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "studentGrade" TEXT NOT NULL,
    "bestTime" TEXT NOT NULL,
    "helpWith" TEXT[],
    "other" TEXT,
    "query" TEXT NOT NULL,

    CONSTRAINT "contact_us_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "image" TEXT,
    "roleId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "codeName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "scope" TEXT DEFAULT 'all',

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobTitle" "JOB_TITLE",
    "department" "DEPARTMENT",
    "qualifications" TEXT[],
    "experienceYears" INTEGER,
    "certifications" TEXT[],
    "bio" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "system_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "grade" TEXT,
    "class" TEXT,
    "section" TEXT,
    "rollId" SERIAL NOT NULL,
    "enrollmentDate" TIMESTAMP(3),
    "currentLevel" TEXT,
    "gpa" DOUBLE PRECISION,
    "totalCredits" INTEGER,
    "academicStatus" "ACADEMIC_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "userId" TEXT NOT NULL,
    "referredById" TEXT,
    "referredByAffiliateId" TEXT,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "contactNumber" TEXT,
    "relation" "RELATION_TYPE" NOT NULL DEFAULT 'GUARDIAN',
    "userId" TEXT NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "qualifications" TEXT,
    "experienceYears" INTEGER,
    "certifications" TEXT[],
    "subjects" TEXT[],
    "bio" TEXT,
    "role" "EducatorRoleType" NOT NULL DEFAULT 'TEACHER',
    "userId" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "earnings" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "bio" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "referral_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyName" TEXT,
    "contactNumber" TEXT,
    "contactEmail" TEXT,
    "website" TEXT,
    "bio" TEXT,
    "earnings" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "affiliate_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "AuditAction" NOT NULL,
    "module" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "performedById" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubjectToTestType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToTestType_AB_pkey" PRIMARY KEY ("A","B")
);

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

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StudentParents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentParents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "coaching_courses_slug_key" ON "coaching_courses"("slug");

-- CreateIndex
CREATE INDEX "coaching_courses_slug_idx" ON "coaching_courses"("slug");

-- CreateIndex
CREATE INDEX "coaching_courses_createdById_idx" ON "coaching_courses"("createdById");

-- CreateIndex
CREATE INDEX "coaching_courses_category_idx" ON "coaching_courses"("category");

-- CreateIndex
CREATE INDEX "coaching_modules_courseId_idx" ON "coaching_modules"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_modules_courseId_orderIndex_key" ON "coaching_modules"("courseId", "orderIndex");

-- CreateIndex
CREATE INDEX "coaching_topics_moduleId_idx" ON "coaching_topics"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_topics_moduleId_orderIndex_key" ON "coaching_topics"("moduleId", "orderIndex");

-- CreateIndex
CREATE INDEX "coaching_contents_topicId_idx" ON "coaching_contents"("topicId");

-- CreateIndex
CREATE INDEX "coaching_contents_instructorId_idx" ON "coaching_contents"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_contents_topicId_orderIndex_key" ON "coaching_contents"("topicId", "orderIndex");

-- CreateIndex
CREATE INDEX "coaching_enrollments_studentId_idx" ON "coaching_enrollments"("studentId");

-- CreateIndex
CREATE INDEX "coaching_enrollments_courseId_idx" ON "coaching_enrollments"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_enrollments_courseId_studentId_key" ON "coaching_enrollments"("courseId", "studentId");

-- CreateIndex
CREATE INDEX "coaching_progress_studentId_idx" ON "coaching_progress"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_progress_contentId_studentId_key" ON "coaching_progress"("contentId", "studentId");

-- CreateIndex
CREATE INDEX "coaching_submissions_contentId_idx" ON "coaching_submissions"("contentId");

-- CreateIndex
CREATE INDEX "coaching_submissions_studentId_idx" ON "coaching_submissions"("studentId");

-- CreateIndex
CREATE INDEX "coaching_submissions_gradedById_idx" ON "coaching_submissions"("gradedById");

-- CreateIndex
CREATE INDEX "coaching_attendances_studentId_idx" ON "coaching_attendances"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_attendances_contentId_studentId_key" ON "coaching_attendances"("contentId", "studentId");

-- CreateIndex
CREATE INDEX "coaching_module_exams_moduleId_idx" ON "coaching_module_exams"("moduleId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_questions_examId_idx" ON "coaching_module_exam_questions"("examId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_question_options_questionId_idx" ON "coaching_module_exam_question_options"("questionId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_attempts_examId_studentId_idx" ON "coaching_module_exam_attempts"("examId", "studentId");

-- CreateIndex
CREATE INDEX "coaching_module_exam_answers_attemptId_questionId_idx" ON "coaching_module_exam_answers"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_courses_slug_key" ON "lms_courses"("slug");

-- CreateIndex
CREATE INDEX "lms_courses_slug_idx" ON "lms_courses"("slug");

-- CreateIndex
CREATE INDEX "lms_courses_instructorId_idx" ON "lms_courses"("instructorId");

-- CreateIndex
CREATE INDEX "lms_courses_category_idx" ON "lms_courses"("category");

-- CreateIndex
CREATE INDEX "lms_modules_courseId_idx" ON "lms_modules"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_modules_courseId_orderIndex_key" ON "lms_modules"("courseId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_lessons_moduleId_idx" ON "lms_lessons"("moduleId");

-- CreateIndex
CREATE INDEX "lms_lessons_videoStatus_idx" ON "lms_lessons"("videoStatus");

-- CreateIndex
CREATE UNIQUE INDEX "lms_lessons_moduleId_orderIndex_key" ON "lms_lessons"("moduleId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_quizzes_moduleId_idx" ON "lms_quizzes"("moduleId");

-- CreateIndex
CREATE INDEX "lms_quizzes_isActive_idx" ON "lms_quizzes"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quizzes_moduleId_orderIndex_key" ON "lms_quizzes"("moduleId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_quiz_questions_quizId_idx" ON "lms_quiz_questions"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quiz_questions_quizId_orderIndex_key" ON "lms_quiz_questions"("quizId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_quiz_question_options_questionId_idx" ON "lms_quiz_question_options"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quiz_question_options_questionId_orderIndex_key" ON "lms_quiz_question_options"("questionId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_quiz_attempts_quizId_studentId_idx" ON "lms_quiz_attempts"("quizId", "studentId");

-- CreateIndex
CREATE INDEX "lms_quiz_attempts_studentId_idx" ON "lms_quiz_attempts"("studentId");

-- CreateIndex
CREATE INDEX "lms_quiz_attempts_isPassed_idx" ON "lms_quiz_attempts"("isPassed");

-- CreateIndex
CREATE INDEX "lms_quiz_answers_attemptId_idx" ON "lms_quiz_answers"("attemptId");

-- CreateIndex
CREATE INDEX "lms_quiz_answers_questionId_idx" ON "lms_quiz_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_quiz_answers_attemptId_questionId_key" ON "lms_quiz_answers"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "lms_enrollments_studentId_idx" ON "lms_enrollments"("studentId");

-- CreateIndex
CREATE INDEX "lms_enrollments_courseId_idx" ON "lms_enrollments"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_enrollments_courseId_studentId_key" ON "lms_enrollments"("courseId", "studentId");

-- CreateIndex
CREATE INDEX "lms_progress_studentId_idx" ON "lms_progress"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_progress_lessonId_studentId_key" ON "lms_progress"("lessonId", "studentId");

-- CreateIndex
CREATE INDEX "lms_discussions_lessonId_idx" ON "lms_discussions"("lessonId");

-- CreateIndex
CREATE INDEX "lms_discussions_authorId_idx" ON "lms_discussions"("authorId");

-- CreateIndex
CREATE INDEX "lms_discussions_parentId_idx" ON "lms_discussions"("parentId");

-- CreateIndex
CREATE INDEX "lms_reviews_courseId_idx" ON "lms_reviews"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "lms_reviews_courseId_studentId_key" ON "lms_reviews"("courseId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_teacherId_key" ON "teacher_profiles"("teacherId");

-- CreateIndex
CREATE INDEX "teacher_profiles_teacherId_idx" ON "teacher_profiles"("teacherId");

-- CreateIndex
CREATE INDEX "teacher_profiles_isAvailable_idx" ON "teacher_profiles"("isAvailable");

-- CreateIndex
CREATE INDEX "teacher_specializations_profileId_idx" ON "teacher_specializations"("profileId");

-- CreateIndex
CREATE INDEX "teacher_specializations_subject_idx" ON "teacher_specializations"("subject");

-- CreateIndex
CREATE INDEX "teacher_availabilities_profileId_idx" ON "teacher_availabilities"("profileId");

-- CreateIndex
CREATE INDEX "teacher_availabilities_dayOfWeek_idx" ON "teacher_availabilities"("dayOfWeek");

-- CreateIndex
CREATE INDEX "teacher_availabilities_specificDate_idx" ON "teacher_availabilities"("specificDate");

-- CreateIndex
CREATE UNIQUE INDEX "onetoone_sessions_jitsiRoomId_key" ON "onetoone_sessions"("jitsiRoomId");

-- CreateIndex
CREATE INDEX "onetoone_sessions_teacherAvailabilityId_idx" ON "onetoone_sessions"("teacherAvailabilityId");

-- CreateIndex
CREATE INDEX "onetoone_sessions_studentId_idx" ON "onetoone_sessions"("studentId");

-- CreateIndex
CREATE INDEX "onetoone_sessions_scheduledAt_idx" ON "onetoone_sessions"("scheduledAt");

-- CreateIndex
CREATE INDEX "onetoone_sessions_status_idx" ON "onetoone_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "onetoone_sessions_teacherAvailabilityId_scheduledAt_key" ON "onetoone_sessions"("teacherAvailabilityId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_recordings_sessionId_key" ON "session_recordings"("sessionId");

-- CreateIndex
CREATE INDEX "session_recordings_expiresAt_idx" ON "session_recordings"("expiresAt");

-- CreateIndex
CREATE INDEX "session_recordings_deletedAt_idx" ON "session_recordings"("deletedAt");

-- CreateIndex
CREATE INDEX "session_recordings_status_idx" ON "session_recordings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "onetoone_reviews_sessionId_key" ON "onetoone_reviews"("sessionId");

-- CreateIndex
CREATE INDEX "onetoone_reviews_teacherProfileId_idx" ON "onetoone_reviews"("teacherProfileId");

-- CreateIndex
CREATE INDEX "onetoone_reviews_studentId_idx" ON "onetoone_reviews"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentId_key" ON "payments"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paypalOrderId_key" ON "payments"("paypalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_oneToOneSessionId_key" ON "payments"("oneToOneSessionId");

-- CreateIndex
CREATE INDEX "payments_studentId_idx" ON "payments"("studentId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_lmsEnrollmentId_idx" ON "payments"("lmsEnrollmentId");

-- CreateIndex
CREATE INDEX "payments_coachingEnrollmentId_idx" ON "payments"("coachingEnrollmentId");

-- CreateIndex
CREATE INDEX "payments_oneToOneSessionId_idx" ON "payments"("oneToOneSessionId");

-- CreateIndex
CREATE INDEX "payments_stripePaymentId_idx" ON "payments"("stripePaymentId");

-- CreateIndex
CREATE INDEX "payments_paypalOrderId_idx" ON "payments"("paypalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_plans_coachingEnrollmentId_key" ON "payment_plans"("coachingEnrollmentId");

-- CreateIndex
CREATE INDEX "payment_plans_coachingEnrollmentId_idx" ON "payment_plans"("coachingEnrollmentId");

-- CreateIndex
CREATE INDEX "payment_plans_nextDueDate_idx" ON "payment_plans"("nextDueDate");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_paymentId_key" ON "invoices"("paymentId");

-- CreateIndex
CREATE INDEX "invoices_studentId_idx" ON "invoices"("studentId");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_isPaid_idx" ON "invoices"("isPaid");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_stripeRefundId_key" ON "refunds"("stripeRefundId");

-- CreateIndex
CREATE INDEX "refunds_paymentId_idx" ON "refunds"("paymentId");

-- CreateIndex
CREATE INDEX "refunds_status_idx" ON "refunds"("status");

-- CreateIndex
CREATE INDEX "refunds_processedById_idx" ON "refunds"("processedById");

-- CreateIndex
CREATE INDEX "test_types_id_idx" ON "test_types"("id");

-- CreateIndex
CREATE INDEX "subjects_id_idx" ON "subjects"("id");

-- CreateIndex
CREATE INDEX "difficulties_id_idx" ON "difficulties"("id");

-- CreateIndex
CREATE INDEX "domains_id_idx" ON "domains"("id");

-- CreateIndex
CREATE INDEX "skills_id_idx" ON "skills"("id");

-- CreateIndex
CREATE UNIQUE INDEX "question_banks_questionID_key" ON "question_banks"("questionID");

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
CREATE UNIQUE INDEX "Guidance_email_key" ON "Guidance"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FreeSeminar_studentEmail_key" ON "FreeSeminar"("studentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "TutorRequestRegistration_email_key" ON "TutorRequestRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetter_email_key" ON "NewsLetter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TrustedCompanies_name_key" ON "TrustedCompanies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_name_key" ON "BlogCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_status_idx" ON "blogs"("status");

-- CreateIndex
CREATE INDEX "blogs_publishedAt_idx" ON "blogs"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "roles_id_idx" ON "roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_codeName_key" ON "permissions"("codeName");

-- CreateIndex
CREATE INDEX "permissions_moduleName_idx" ON "permissions"("moduleName");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_userId_key" ON "system_users"("userId");

-- CreateIndex
CREATE INDEX "system_users_userId_idx" ON "system_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_rollId_key" ON "students"("rollId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "referral_users_userId_key" ON "referral_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_users_userId_key" ON "affiliate_users"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_module_idx" ON "audit_logs"("module");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_performedById_idx" ON "audit_logs"("performedById");

-- CreateIndex
CREATE INDEX "_SubjectToTestType_B_index" ON "_SubjectToTestType"("B");

-- CreateIndex
CREATE INDEX "_DomainToSubject_B_index" ON "_DomainToSubject"("B");

-- CreateIndex
CREATE INDEX "_DomainToSkill_B_index" ON "_DomainToSkill"("B");

-- CreateIndex
CREATE INDEX "_ModuleQuestionsSetOne_B_index" ON "_ModuleQuestionsSetOne"("B");

-- CreateIndex
CREATE INDEX "_ModuleQuestionsSetTwo_B_index" ON "_ModuleQuestionsSetTwo"("B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE INDEX "_StudentParents_B_index" ON "_StudentParents"("B");

-- AddForeignKey
ALTER TABLE "coaching_courses" ADD CONSTRAINT "coaching_courses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_modules" ADD CONSTRAINT "coaching_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "coaching_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_modules" ADD CONSTRAINT "coaching_modules_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_topics" ADD CONSTRAINT "coaching_topics_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "coaching_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_contents" ADD CONSTRAINT "coaching_contents_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_contents" ADD CONSTRAINT "coaching_contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "coaching_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_enrollments" ADD CONSTRAINT "coaching_enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "coaching_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_enrollments" ADD CONSTRAINT "coaching_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_progress" ADD CONSTRAINT "coaching_progress_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "coaching_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_progress" ADD CONSTRAINT "coaching_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_submissions" ADD CONSTRAINT "coaching_submissions_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_submissions" ADD CONSTRAINT "coaching_submissions_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "coaching_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_submissions" ADD CONSTRAINT "coaching_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_attendances" ADD CONSTRAINT "coaching_attendances_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "coaching_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_attendances" ADD CONSTRAINT "coaching_attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exams" ADD CONSTRAINT "coaching_module_exams_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "coaching_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_questions" ADD CONSTRAINT "coaching_module_exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "coaching_module_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_question_options" ADD CONSTRAINT "coaching_module_exam_question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "coaching_module_exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_attempts" ADD CONSTRAINT "coaching_module_exam_attempts_examId_fkey" FOREIGN KEY ("examId") REFERENCES "coaching_module_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_attempts" ADD CONSTRAINT "coaching_module_exam_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_answers" ADD CONSTRAINT "coaching_module_exam_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "coaching_module_exam_question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_answers" ADD CONSTRAINT "coaching_module_exam_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "coaching_module_exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_module_exam_answers" ADD CONSTRAINT "coaching_module_exam_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "coaching_module_exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_courses" ADD CONSTRAINT "lms_courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_modules" ADD CONSTRAINT "lms_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "lms_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_lessons" ADD CONSTRAINT "lms_lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "lms_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quizzes" ADD CONSTRAINT "lms_quizzes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "lms_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_questions" ADD CONSTRAINT "lms_quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "lms_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_question_options" ADD CONSTRAINT "lms_quiz_question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "lms_quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_attempts" ADD CONSTRAINT "lms_quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "lms_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_attempts" ADD CONSTRAINT "lms_quiz_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_answers" ADD CONSTRAINT "lms_quiz_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "lms_quiz_question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_answers" ADD CONSTRAINT "lms_quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "lms_quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_answers" ADD CONSTRAINT "lms_quiz_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "lms_quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_enrollments" ADD CONSTRAINT "lms_enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "lms_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_enrollments" ADD CONSTRAINT "lms_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_progress" ADD CONSTRAINT "lms_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lms_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_progress" ADD CONSTRAINT "lms_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_discussions" ADD CONSTRAINT "lms_discussions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lms_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_discussions" ADD CONSTRAINT "lms_discussions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_discussions" ADD CONSTRAINT "lms_discussions_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "lms_discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_reviews" ADD CONSTRAINT "lms_reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "lms_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_reviews" ADD CONSTRAINT "lms_reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_specializations" ADD CONSTRAINT "teacher_specializations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_availabilities" ADD CONSTRAINT "teacher_availabilities_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_teacherAvailabilityId_fkey" FOREIGN KEY ("teacherAvailabilityId") REFERENCES "teacher_availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_recordings" ADD CONSTRAINT "session_recordings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "onetoone_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_reviews" ADD CONSTRAINT "onetoone_reviews_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "onetoone_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_reviews" ADD CONSTRAINT "onetoone_reviews_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onetoone_reviews" ADD CONSTRAINT "onetoone_reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_lmsEnrollmentId_fkey" FOREIGN KEY ("lmsEnrollmentId") REFERENCES "lms_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_coachingEnrollmentId_fkey" FOREIGN KEY ("coachingEnrollmentId") REFERENCES "coaching_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_oneToOneSessionId_fkey" FOREIGN KEY ("oneToOneSessionId") REFERENCES "onetoone_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_coachingEnrollmentId_fkey" FOREIGN KEY ("coachingEnrollmentId") REFERENCES "coaching_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_testTypeId_fkey" FOREIGN KEY ("testTypeId") REFERENCES "test_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillBlank" ADD CONSTRAINT "FillBlank_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlogComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "referral_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_referredByAffiliateId_fkey" FOREIGN KEY ("referredByAffiliateId") REFERENCES "affiliate_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_users" ADD CONSTRAINT "referral_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_users" ADD CONSTRAINT "affiliate_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTestType" ADD CONSTRAINT "_SubjectToTestType_A_fkey" FOREIGN KEY ("A") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTestType" ADD CONSTRAINT "_SubjectToTestType_B_fkey" FOREIGN KEY ("B") REFERENCES "test_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSubject" ADD CONSTRAINT "_DomainToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSubject" ADD CONSTRAINT "_DomainToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSkill" ADD CONSTRAINT "_DomainToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToSkill" ADD CONSTRAINT "_DomainToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetOne" ADD CONSTRAINT "_ModuleQuestionsSetOne_A_fkey" FOREIGN KEY ("A") REFERENCES "sat_practice_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetOne" ADD CONSTRAINT "_ModuleQuestionsSetOne_B_fkey" FOREIGN KEY ("B") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetTwo" ADD CONSTRAINT "_ModuleQuestionsSetTwo_A_fkey" FOREIGN KEY ("A") REFERENCES "sat_practice_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleQuestionsSetTwo" ADD CONSTRAINT "_ModuleQuestionsSetTwo_B_fkey" FOREIGN KEY ("B") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentParents" ADD CONSTRAINT "_StudentParents_A_fkey" FOREIGN KEY ("A") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentParents" ADD CONSTRAINT "_StudentParents_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
