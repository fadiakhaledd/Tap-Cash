-- CreateEnum
CREATE TYPE "TransactionLevel" AS ENUM ('PARENT', 'CHILD');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "recipientSubaccountUID" TEXT,
ADD COLUMN     "senderSubaccountUID" TEXT,
ADD COLUMN     "transactionLevel" "TransactionLevel" NOT NULL DEFAULT 'PARENT';

-- CreateTable
CREATE TABLE "Subaccount" (
    "UID" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "nationalID" VARCHAR(15) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profilePicture" TEXT,
    "spendingLimit" DOUBLE PRECISION NOT NULL,
    "spendingCategories" TEXT[],
    "dailyLimit" DOUBLE PRECISION,
    "monthlyLimit" DOUBLE PRECISION,
    "transactionLimit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerID" TEXT NOT NULL,

    CONSTRAINT "Subaccount_pkey" PRIMARY KEY ("UID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subaccount_phone_key" ON "Subaccount"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Subaccount_username_key" ON "Subaccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Subaccount_nationalID_key" ON "Subaccount"("nationalID");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderSubaccountUID_fkey" FOREIGN KEY ("senderSubaccountUID") REFERENCES "Subaccount"("UID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipientSubaccountUID_fkey" FOREIGN KEY ("recipientSubaccountUID") REFERENCES "Subaccount"("UID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subaccount" ADD CONSTRAINT "Subaccount_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("UID") ON DELETE RESTRICT ON UPDATE CASCADE;
