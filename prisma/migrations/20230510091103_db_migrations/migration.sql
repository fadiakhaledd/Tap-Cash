/*
  Warnings:

  - You are about to drop the column `balance` on the `Subaccount` table. All the data in the column will be lost.
  - You are about to drop the `TransactionRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionStatus" ADD VALUE 'ACCEPTED';
ALTER TYPE "TransactionStatus" ADD VALUE 'REJECTED';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'REQUEST';

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionRequest" DROP CONSTRAINT "TransactionRequest_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionRequest" DROP CONSTRAINT "TransactionRequest_requester_id_fkey";

-- AlterTable
ALTER TABLE "Subaccount" DROP COLUMN "balance",
ALTER COLUMN "spendingLimit" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "reciever_id" TEXT,
ADD COLUMN     "requester_id" TEXT,
ALTER COLUMN "sender_id" DROP NOT NULL;

-- DropTable
DROP TABLE "TransactionRequest";

-- DropEnum
DROP TYPE "TransactionRequestStatus";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("UID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "User"("UID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "User"("UID") ON DELETE SET NULL ON UPDATE CASCADE;
