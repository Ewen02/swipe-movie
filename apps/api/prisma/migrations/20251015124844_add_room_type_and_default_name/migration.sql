/*
  Warnings:

  - Made the column `name` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'movie',
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Untitled Room';
