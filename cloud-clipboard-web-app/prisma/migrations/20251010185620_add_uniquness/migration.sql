/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint,userId]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "devices_fingerprint_userId_key" ON "devices"("fingerprint", "userId");
