/*
  Warnings:

  - You are about to drop the column `authTag` on the `Account` table. All the data in the column will be lost.
  - Added the required column `emailAuthTag` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordAuthTag` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceAuthTag` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usernameAuthTag` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "authTag",
ADD COLUMN     "emailAuthTag" TEXT NOT NULL,
ADD COLUMN     "passwordAuthTag" TEXT NOT NULL,
ADD COLUMN     "serviceAuthTag" TEXT NOT NULL,
ADD COLUMN     "usernameAuthTag" TEXT NOT NULL;
