ALTER TABLE "FeedItem" ADD COLUMN IF NOT EXISTS "relevanceScore" INTEGER;
ALTER TABLE "FeedItem" ADD COLUMN IF NOT EXISTS "scoredAt" TIMESTAMP(3);
ALTER TABLE "FeedItem" ADD COLUMN IF NOT EXISTS "skipReason" TEXT;
CREATE INDEX IF NOT EXISTS "FeedItem_relevanceScore_idx" ON "FeedItem"("relevanceScore");
