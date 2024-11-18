-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_fromAccountNumber_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_toAccountNumber_fkey";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fromAccountNumber_fkey" FOREIGN KEY ("fromAccountNumber") REFERENCES "accounts"("accountNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_toAccountNumber_fkey" FOREIGN KEY ("toAccountNumber") REFERENCES "accounts"("accountNumber") ON DELETE CASCADE ON UPDATE CASCADE;
