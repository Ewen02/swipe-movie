/*
  Warnings:

  - The `type` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."RoomType" AS ENUM ('MOVIE', 'TV');

-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "genreId" INTEGER,
ADD COLUMN     "selectedTmdbId" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."RoomType" NOT NULL DEFAULT 'MOVIE';

-- CreateIndex
CREATE INDEX "Room_type_genreId_idx" ON "public"."Room"("type", "genreId");
