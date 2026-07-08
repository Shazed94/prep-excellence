-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REPLIED', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "contact_us" ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "phone" DROP NOT NULL;
