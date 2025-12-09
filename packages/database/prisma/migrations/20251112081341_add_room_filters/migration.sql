/*
  Warnings:

  - Made the column `genreId` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "minRating" DOUBLE PRECISION,
ADD COLUMN     "originalLanguage" TEXT,
ADD COLUMN     "releaseYearMax" INTEGER,
ADD COLUMN     "releaseYearMin" INTEGER,
ADD COLUMN     "runtimeMax" INTEGER,
ADD COLUMN     "runtimeMin" INTEGER,
ADD COLUMN     "watchProviders" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "watchRegion" TEXT DEFAULT 'FR',
ALTER COLUMN "genreId" SET NOT NULL,
ALTER COLUMN "genreId" SET DEFAULT 0;
