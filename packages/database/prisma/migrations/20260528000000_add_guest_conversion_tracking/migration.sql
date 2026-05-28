-- AlterTable: track guest -> user conversion metadata so admin can compute
-- a true guest-to-user conversion rate and separate organic from trial signups.
ALTER TABLE "User"
  ADD COLUMN "convertedFromGuestAt" TIMESTAMP(3),
  ADD COLUMN "guestSwipesAtConversion" INTEGER,
  ADD COLUMN "guestCreatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_convertedFromGuestAt_idx" ON "User"("convertedFromGuestAt");
