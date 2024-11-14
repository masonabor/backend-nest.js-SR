/*
  Warnings:

  - You are about to drop the column `ammout_of_currency` on the `deposits` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[depositNumber]` on the table `deposits` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountNumber` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depositNumber` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "accountNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "ammout_of_currency",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "depositNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "fromAccountId" INTEGER NOT NULL,
    "toAccountId" INTEGER NOT NULL,
    "amountFromCurrency" DOUBLE PRECISION NOT NULL,
    "amountToCurrency" DOUBLE PRECISION NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountNumber_key" ON "accounts"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_depositNumber_key" ON "deposits"("depositNumber");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
