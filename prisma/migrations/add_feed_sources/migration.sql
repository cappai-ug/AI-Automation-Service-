-- CreateTable "FeedSource"
CREATE TABLE IF NOT EXISTS "FeedSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT,
    "lastFetchedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedSource_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "FeedSource_url_key" ON "FeedSource"("url");
CREATE INDEX IF NOT EXISTS "FeedSource_enabled_idx" ON "FeedSource"("enabled");

-- CreateTable "FeedItem"
CREATE TABLE IF NOT EXISTS "FeedItem" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "contentSnippet" TEXT,
    "publishedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FeedItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "FeedItem_sourceId_externalId_key" ON "FeedItem"("sourceId", "externalId");
CREATE INDEX IF NOT EXISTS "FeedItem_fetchedAt_idx" ON "FeedItem"("fetchedAt");
CREATE INDEX IF NOT EXISTS "FeedItem_processed_idx" ON "FeedItem"("processed");

ALTER TABLE "FeedItem"
    ADD CONSTRAINT "FeedItem_sourceId_fkey"
    FOREIGN KEY ("sourceId") REFERENCES "FeedSource"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
