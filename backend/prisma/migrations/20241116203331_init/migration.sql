-- AlterTable
ALTER TABLE "deposits" ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
