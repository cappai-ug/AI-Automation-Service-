ALTER TABLE "FeedItem" ADD COLUMN IF NOT EXISTS "topicCluster" TEXT;
ALTER TABLE "BlogDraft" ADD COLUMN IF NOT EXISTS "topicCluster" TEXT;
CREATE INDEX IF NOT EXISTS "FeedItem_topicCluster_idx" ON "FeedItem"("topicCluster");
CREATE INDEX IF NOT EXISTS "BlogDraft_topicCluster_idx" ON "BlogDraft"("topicCluster");
