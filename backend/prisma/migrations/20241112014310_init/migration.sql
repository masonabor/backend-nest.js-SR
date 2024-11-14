/*
  Warnings:

  - You are about to drop the column `is_administrator` on the `administrators` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "administrators" DROP COLUMN "is_administrator",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT true;
