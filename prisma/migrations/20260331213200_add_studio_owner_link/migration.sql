-- AlterTable
ALTER TABLE "studios" ADD COLUMN     "ownerUserId" TEXT;

-- CreateIndex
CREATE INDEX "studios_ownerUserId_idx" ON "studios"("ownerUserId");

-- AddForeignKey
ALTER TABLE "studios" ADD CONSTRAINT "studios_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
