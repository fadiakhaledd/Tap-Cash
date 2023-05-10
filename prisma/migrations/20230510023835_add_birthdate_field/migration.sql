/*
  Warnings:

  - Added the required column `birthdate` to the `Subaccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subaccount" ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL;
