CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" TEXT NOT NULL DEFAULT 'newsletter_form',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confirmToken" TEXT NOT NULL,
    "unsubscribeToken" TEXT NOT NULL,
    "consentText" TEXT NOT NULL,
    "consentIp" TEXT,
    "consentUserAgent" TEXT,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_confirmToken_key" ON "NewsletterSubscriber"("confirmToken");
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_source_idx" ON "NewsletterSubscriber"("source");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_subscribedAt_idx" ON "NewsletterSubscriber"("subscribedAt");
