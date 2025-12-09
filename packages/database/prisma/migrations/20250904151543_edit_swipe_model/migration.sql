/*
  Warnings:

  - You are about to drop the column `titleId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `titleId` on the `Swipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId,movieId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId,userId,movieId]` on the table `Swipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `movieId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `Swipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Match_roomId_titleId_key";

-- DropIndex
DROP INDEX "public"."Swipe_roomId_titleId_idx";

-- AlterTable
ALTER TABLE "public"."Match" DROP COLUMN "titleId",
ADD COLUMN     "movieId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Swipe" DROP COLUMN "titleId",
ADD COLUMN     "movieId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_roomId_movieId_key" ON "public"."Match"("roomId", "movieId");

-- CreateIndex
CREATE INDEX "Swipe_roomId_movieId_idx" ON "public"."Swipe"("roomId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_roomId_userId_movieId_key" ON "public"."Swipe"("roomId", "userId", "movieId");
