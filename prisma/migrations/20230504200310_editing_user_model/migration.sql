-- CreateTable
CREATE TABLE "User" (
    "UID" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "nationalID" VARCHAR(14) NOT NULL,
    "nationalIdFileName" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
