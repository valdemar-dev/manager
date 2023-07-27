/*
  Warnings:

  - Added the required column `creationTimestamp` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creationTimestampAuthTag` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "creationTimestamp" TEXT NOT NULL,
ADD COLUMN     "creationTimestampAuthTag" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'Free',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Member';
