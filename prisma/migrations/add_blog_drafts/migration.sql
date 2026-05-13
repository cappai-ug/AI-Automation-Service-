-- CreateTable "BlogDraft"
CREATE TABLE IF NOT EXISTS "BlogDraft" (
    "id" TEXT NOT NULL,
    "sourceItemId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contentMarkdown" TEXT NOT NULL,
    "relevanceScore" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "model" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "BlogDraft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BlogDraft_slug_key" ON "BlogDraft"("slug");
CREATE INDEX IF NOT EXISTS "BlogDraft_status_idx" ON "BlogDraft"("status");
CREATE INDEX IF NOT EXISTS "BlogDraft_category_idx" ON "BlogDraft"("category");
CREATE INDEX IF NOT EXISTS "BlogDraft_generatedAt_idx" ON "BlogDraft"("generatedAt");

ALTER TABLE "BlogDraft"
    ADD CONSTRAINT "BlogDraft_sourceItemId_fkey"
    FOREIGN KEY ("sourceItemId") REFERENCES "FeedItem"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
