/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Notepad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notepad" DROP COLUMN "isPublic",
ALTER COLUMN "title" SET DEFAULT 'Untitled notepad';
