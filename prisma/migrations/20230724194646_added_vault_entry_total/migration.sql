/*
  Warnings:

  - Added the required column `encryptionIv` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "encryptionIv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vaultEntryTotal" INTEGER NOT NULL DEFAULT 0;
