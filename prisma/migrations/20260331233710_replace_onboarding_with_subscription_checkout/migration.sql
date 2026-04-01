-- CreateEnum
CREATE TYPE "SubscriptionCheckoutStatus" AS ENUM ('PENDING_PAYMENT', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "subscription_checkouts" (
    "id" TEXT NOT NULL,
    "planTier" "PlanTier" NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "studioName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "ownerDocument" TEXT NOT NULL,
    "domainType" TEXT NOT NULL,
    "subdomain" TEXT,
    "customDomain" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "SubscriptionCheckoutStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "studioId" TEXT,
    "subscriberUserId" TEXT,
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscription_checkouts_status_idx" ON "subscription_checkouts"("status");

-- CreateIndex
CREATE INDEX "subscription_checkouts_ownerEmail_idx" ON "subscription_checkouts"("ownerEmail");
