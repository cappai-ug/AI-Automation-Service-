-- CreateTable "Waitlist"
CREATE TABLE IF NOT EXISTS "Waitlist" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "useCase" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'landing_page',
    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Waitlist_email_key" UNIQUE ("email")
);

-- CreateTable "Customer"
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Customer_email_key" UNIQUE ("email")
);

-- CreateIndex "Waitlist_email_idx"
CREATE INDEX IF NOT EXISTS "Waitlist_email_idx" ON "Waitlist"("email");

-- CreateIndex "Waitlist_status_idx"
CREATE INDEX IF NOT EXISTS "Waitlist_status_idx" ON "Waitlist"("status");

-- CreateIndex "Waitlist_createdAt_idx"
CREATE INDEX IF NOT EXISTS "Waitlist_createdAt_idx" ON "Waitlist"("createdAt");
