/*
  Warnings:

  - The values [APPROVED] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `HourlyActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED');
ALTER TABLE "DailyReport" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "DailyReport" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
ALTER TABLE "DailyReport" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "HourlyActivity" DROP CONSTRAINT "HourlyActivity_userId_fkey";

-- DropTable
DROP TABLE "HourlyActivity";

-- CreateTable
CREATE TABLE "hourly_activities" (
    "id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hourly_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hourly_activities" ADD CONSTRAINT "hourly_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
