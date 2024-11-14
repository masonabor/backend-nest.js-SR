/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromAccountNumber_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAccountNumber_fkey";

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "fromAccountNumber" INTEGER NOT NULL,
    "toAccountNumber" INTEGER NOT NULL,
    "amountFromCurrency" DOUBLE PRECISION NOT NULL,
    "amountToCurrency" DOUBLE PRECISION,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fromAccountNumber_fkey" FOREIGN KEY ("fromAccountNumber") REFERENCES "accounts"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_toAccountNumber_fkey" FOREIGN KEY ("toAccountNumber") REFERENCES "accounts"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
