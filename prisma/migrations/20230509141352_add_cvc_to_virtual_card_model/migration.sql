-- CreateEnum
CREATE TYPE "CCTYPE" AS ENUM ('amex', 'jcb', 'mastercard', 'visa');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'VCC';

-- CreateTable
CREATE TABLE "VirtualCreditCard" (
    "id" SERIAL NOT NULL,
    "cardNumber" VARCHAR(19) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "usedFlag" BOOLEAN NOT NULL DEFAULT false,
    "creditCardType" "CCTYPE" NOT NULL,
    "ccHolderName" TEXT NOT NULL,
    "verificationCode" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualCreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualCreditCard_userId_key" ON "VirtualCreditCard"("userId");

-- AddForeignKey
ALTER TABLE "VirtualCreditCard" ADD CONSTRAINT "VirtualCreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("UID") ON DELETE RESTRICT ON UPDATE CASCADE;
