-- CreateTable
CREATE TABLE "TrustedCompanies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "logo" TEXT NOT NULL,

    CONSTRAINT "TrustedCompanies_pkey" PRIMARY KEY ("id")
);
