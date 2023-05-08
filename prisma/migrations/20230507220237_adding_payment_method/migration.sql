-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFER', 'CASH', 'CREDIT_CARD');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recipient_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fundPayment" "PaymentMethod" NOT NULL DEFAULT 'TRANSFER',
ALTER COLUMN "recipient_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "User"("UID") ON DELETE SET NULL ON UPDATE CASCADE;
