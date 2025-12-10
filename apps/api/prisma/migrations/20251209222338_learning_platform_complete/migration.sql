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

-- CreateTable
CREATE TABLE "coaching_courses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "level" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'BEGINNER',
    "duration" INTEGER,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "capacity" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
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
    "passingScore" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER,
    "questions" JSONB NOT NULL,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "lms_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lms_quiz_attempts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "isPassed" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quizId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "lms_quiz_attempts_pkey" PRIMARY KEY ("id")
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
    "teacherProfileId" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "lms_quizzes_moduleId_orderIndex_key" ON "lms_quizzes"("moduleId", "orderIndex");

-- CreateIndex
CREATE INDEX "lms_quiz_attempts_quizId_studentId_idx" ON "lms_quiz_attempts"("quizId", "studentId");

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
CREATE INDEX "onetoone_sessions_teacherProfileId_idx" ON "onetoone_sessions"("teacherProfileId");

-- CreateIndex
CREATE INDEX "onetoone_sessions_studentId_idx" ON "onetoone_sessions"("studentId");

-- CreateIndex
CREATE INDEX "onetoone_sessions_scheduledAt_idx" ON "onetoone_sessions"("scheduledAt");

-- CreateIndex
CREATE INDEX "onetoone_sessions_status_idx" ON "onetoone_sessions"("status");

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
CREATE UNIQUE INDEX "Guidance_email_key" ON "Guidance"("email");

-- AddForeignKey
ALTER TABLE "coaching_courses" ADD CONSTRAINT "coaching_courses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_modules" ADD CONSTRAINT "coaching_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "coaching_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "lms_courses" ADD CONSTRAINT "lms_courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_modules" ADD CONSTRAINT "lms_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "lms_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_lessons" ADD CONSTRAINT "lms_lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "lms_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quizzes" ADD CONSTRAINT "lms_quizzes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "lms_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_attempts" ADD CONSTRAINT "lms_quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "lms_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lms_quiz_attempts" ADD CONSTRAINT "lms_quiz_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "onetoone_sessions" ADD CONSTRAINT "onetoone_sessions_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
