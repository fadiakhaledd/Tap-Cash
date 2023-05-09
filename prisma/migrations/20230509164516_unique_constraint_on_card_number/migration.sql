/*
  Warnings:

  - A unique constraint covering the columns `[cardNumber]` on the table `VirtualCreditCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VirtualCreditCard_cardNumber_key" ON "VirtualCreditCard"("cardNumber");
