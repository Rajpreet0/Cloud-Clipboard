/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "codeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "verificationCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "devices_deviceId_key" ON "devices"("deviceId");
