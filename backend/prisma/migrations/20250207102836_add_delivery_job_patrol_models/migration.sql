-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('PENDING', 'COMPLETED', 'ISSUES_FOUND', 'MISSED');

-- CreateTable
CREATE TABLE "delivery_items" (
    "id" TEXT NOT NULL,
    "trackingNo" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "receiverName" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderPhone" TEXT NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "weight" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "JobStatus" NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "assignedTo" TEXT,
    "requestedBy" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_request_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_request_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrol_checks" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "checkPoint" TEXT NOT NULL,
    "status" "CheckStatus" NOT NULL,
    "notes" TEXT,
    "issues" TEXT,
    "imagePath" TEXT,
    "performedBy" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patrol_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_items_trackingNo_key" ON "delivery_items"("trackingNo");

-- CreateIndex
CREATE INDEX "delivery_items_trackingNo_idx" ON "delivery_items"("trackingNo");

-- CreateIndex
CREATE INDEX "delivery_items_status_idx" ON "delivery_items"("status");

-- CreateIndex
CREATE INDEX "job_requests_status_idx" ON "job_requests"("status");

-- CreateIndex
CREATE INDEX "job_requests_priority_idx" ON "job_requests"("priority");

-- CreateIndex
CREATE INDEX "job_requests_requestedBy_idx" ON "job_requests"("requestedBy");

-- CreateIndex
CREATE INDEX "job_request_comments_jobRequestId_idx" ON "job_request_comments"("jobRequestId");

-- CreateIndex
CREATE INDEX "patrol_checks_location_idx" ON "patrol_checks"("location");

-- CreateIndex
CREATE INDEX "patrol_checks_performedBy_idx" ON "patrol_checks"("performedBy");

-- CreateIndex
CREATE INDEX "patrol_checks_startTime_idx" ON "patrol_checks"("startTime");

-- AddForeignKey
ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_request_comments" ADD CONSTRAINT "job_request_comments_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "job_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_request_comments" ADD CONSTRAINT "job_request_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patrol_checks" ADD CONSTRAINT "patrol_checks_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
