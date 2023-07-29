/*
  Warnings:

  - Added the required column `authorUsername` to the `Notepad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notepad" ADD COLUMN     "authorUsername" TEXT NOT NULL,
ADD COLUMN     "usernameAuthTag" TEXT;
