-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'PUBLISH', 'UNPUBLISH', 'ENROLL', 'CHANGE_STATUS');

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

-- CreateIndex
CREATE INDEX "audit_logs_module_idx" ON "audit_logs"("module");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_performedById_idx" ON "audit_logs"("performedById");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
