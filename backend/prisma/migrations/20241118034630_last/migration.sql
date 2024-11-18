-- DropForeignKey
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_accountId_fkey";

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
