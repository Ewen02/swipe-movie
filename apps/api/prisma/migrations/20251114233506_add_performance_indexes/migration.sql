-- CreateIndex
CREATE INDEX "Match_roomId_idx" ON "public"."Match"("roomId");

-- CreateIndex
CREATE INDEX "Match_createdAt_idx" ON "public"."Match"("createdAt");

-- CreateIndex
CREATE INDEX "Swipe_roomId_idx" ON "public"."Swipe"("roomId");

-- CreateIndex
CREATE INDEX "Swipe_userId_idx" ON "public"."Swipe"("userId");
