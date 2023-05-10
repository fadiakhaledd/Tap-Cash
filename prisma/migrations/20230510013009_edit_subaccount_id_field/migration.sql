/*
  Warnings:

  - The primary key for the `Subaccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UID` on the `Subaccount` table. All the data in the column will be lost.
  - The required column `id` was added to the `Subaccount` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recipientSubaccountUID_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderSubaccountUID_fkey";

-- AlterTable
ALTER TABLE "Subaccount" DROP CONSTRAINT "Subaccount_pkey",
DROP COLUMN "UID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Subaccount_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderSubaccountUID_fkey" FOREIGN KEY ("senderSubaccountUID") REFERENCES "Subaccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipientSubaccountUID_fkey" FOREIGN KEY ("recipientSubaccountUID") REFERENCES "Subaccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
