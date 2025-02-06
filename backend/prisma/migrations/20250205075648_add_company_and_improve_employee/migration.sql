/*
  Warnings:

  - You are about to drop the column `userId` on the `employees` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "employees_userId_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "userId";
