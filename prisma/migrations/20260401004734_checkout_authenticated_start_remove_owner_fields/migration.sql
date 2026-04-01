/*
  Warnings:

  - You are about to drop the column `ownerDocument` on the `subscription_checkouts` table. All the data in the column will be lost.
  - You are about to drop the column `ownerPhone` on the `subscription_checkouts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_checkouts" DROP COLUMN "ownerDocument",
DROP COLUMN "ownerPhone";
