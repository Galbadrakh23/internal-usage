-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DAILY', 'HOURLY', 'IMPORTANT');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'DELIVERED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('PENDING', 'COMPLETED', 'ISSUES_FOUND', 'MISSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_directory" (
    "id" SERIAL NOT NULL,
    "floor" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_directory_pkey" PRIMARY KEY ("id")
);

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
    "requestedBy" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrol_checks" (
    "id" TEXT NOT NULL,
    "checkPoint" TEXT NOT NULL,
    "status" "CheckStatus" NOT NULL,
    "notes" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checkedBy" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "totalCheckPoint" INTEGER NOT NULL,

    CONSTRAINT "patrol_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealCount" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "breakfast" INTEGER NOT NULL DEFAULT 0,
    "lunch" INTEGER NOT NULL DEFAULT 0,
    "dinner" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Report_date_idx" ON "Report"("date");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Comment_reportId_idx" ON "Comment"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE INDEX "employees_name_idx" ON "employees"("name");

-- CreateIndex
CREATE INDEX "company_directory_floor_idx" ON "company_directory"("floor");

-- CreateIndex
CREATE INDEX "company_directory_companyName_idx" ON "company_directory"("companyName");

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
CREATE UNIQUE INDEX "MealCount_date_key" ON "MealCount"("date");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patrol_checks" ADD CONSTRAINT "patrol_checks_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patrol_checks" ADD CONSTRAINT "patrol_checks_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
