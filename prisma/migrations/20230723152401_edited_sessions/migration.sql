/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Session` table. All the data in the column will be lost.
  - Added the required column `sessionBrowser` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "deviceId",
ADD COLUMN     "sessionBrowser" TEXT NOT NULL;
