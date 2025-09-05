/*
  Warnings:

  - Changed the type of `value` on the `Swipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Swipe" DROP COLUMN "value",
ADD COLUMN     "value" BOOLEAN NOT NULL;
