/*
  Warnings:

  - You are about to drop the `depositsHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "depositsHistory";

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "depositNumber" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL,
    "interestPerYear" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "interval" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateOfCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "history_depositNumber_key" ON "history"("depositNumber");
