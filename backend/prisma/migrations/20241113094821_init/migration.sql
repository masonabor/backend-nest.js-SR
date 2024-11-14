-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromAccountNumber_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAccountNumber_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountNumber_fkey" FOREIGN KEY ("fromAccountNumber") REFERENCES "accounts"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountNumber_fkey" FOREIGN KEY ("toAccountNumber") REFERENCES "accounts"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
