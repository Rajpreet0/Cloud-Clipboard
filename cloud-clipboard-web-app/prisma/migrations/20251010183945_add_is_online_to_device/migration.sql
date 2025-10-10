/*
  Warnings:

  - You are about to drop the column `online` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "online",
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT true;
