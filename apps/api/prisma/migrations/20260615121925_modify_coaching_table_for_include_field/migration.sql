/*
  Warnings:

  - You are about to drop the column `price` on the `coaching_courses` table. All the data in the column will be lost.
  - Added the required column `offer_price` to the `coaching_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coaching_courses" DROP COLUMN "price",
ADD COLUMN     "offer_price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "regular_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "video" TEXT;
