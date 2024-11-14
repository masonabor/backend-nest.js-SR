/*
  Warnings:

  - You are about to drop the column `ammount_of_currency` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `interest_per_year` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `ban_reason` on the `users` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `deposits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestPerYear` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_userId_fkey";

-- DropIndex
DROP INDEX "deposits_userId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "ammount_of_currency",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "interest_per_year",
DROP COLUMN "userId",
ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "interestPerYear" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "ban_reason",
ADD COLUMN     "banReason" TEXT;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
