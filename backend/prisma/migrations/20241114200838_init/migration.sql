/*
  Warnings:

  - You are about to drop the column `fromCurrency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toCurrency` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fromCurrency",
DROP COLUMN "toCurrency",
ALTER COLUMN "amountToCurrency" DROP NOT NULL;
