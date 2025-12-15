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
