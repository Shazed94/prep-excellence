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
