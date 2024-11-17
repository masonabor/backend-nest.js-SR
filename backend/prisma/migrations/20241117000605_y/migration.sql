/*
  Warnings:

  - Added the required column `interval` to the `deposits` table without a default value. This is not possible if the table is not empty.
  - Made the column `expiryDate` on table `deposits` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "deposits" ADD COLUMN     "interval" INTEGER NOT NULL,
ALTER COLUMN "expiryDate" SET NOT NULL;
