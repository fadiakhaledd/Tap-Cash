/*
  Warnings:

  - You are about to drop the column `nationalID` on the `Subaccount` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subaccount_nationalID_key";

-- AlterTable
ALTER TABLE "Subaccount" DROP COLUMN "nationalID";
