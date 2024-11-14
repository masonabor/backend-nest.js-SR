/*
  Warnings:

  - You are about to drop the column `ban_eason` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "ban_eason",
ADD COLUMN     "ban_reason" TEXT;
