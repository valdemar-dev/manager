/*
  Warnings:

  - You are about to drop the column `encryptionIv` on the `Account` table. All the data in the column will be lost.
  - Added the required column `iv` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "encryptionIv",
ADD COLUMN     "iv" TEXT NOT NULL,
ALTER COLUMN "accountUsername" DROP NOT NULL;
