/*
  Warnings:

  - You are about to drop the column `category` on the `coaching_courses` table. All the data in the column will be lost.
  - You are about to drop the `FreeSeminar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "coaching_courses_category_idx";

-- AlterTable
ALTER TABLE "coaching_courses" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "category_s" TEXT;

-- DropTable
DROP TABLE "FreeSeminar";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_addresses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "billing_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "billing_addresses_userId_idx" ON "billing_addresses"("userId");

-- CreateIndex
CREATE INDEX "coaching_courses_categoryId_idx" ON "coaching_courses"("categoryId");

-- AddForeignKey
ALTER TABLE "coaching_courses" ADD CONSTRAINT "coaching_courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_addresses" ADD CONSTRAINT "billing_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
