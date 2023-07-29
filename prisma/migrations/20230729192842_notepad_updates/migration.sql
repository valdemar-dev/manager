/*
  Warnings:

  - The primary key for the `Notepad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Notepad` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Notepad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notepad` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notepad" DROP CONSTRAINT "Notepad_userId_fkey";

-- AlterTable
ALTER TABLE "Notepad" DROP CONSTRAINT "Notepad_pkey",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "contentAuthTag" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "iv" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "titleAuthTag" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notepad_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Notepad_id_seq";

-- AddForeignKey
ALTER TABLE "Notepad" ADD CONSTRAINT "Notepad_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
