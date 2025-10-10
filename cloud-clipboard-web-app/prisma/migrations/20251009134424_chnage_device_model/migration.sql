/*
  Warnings:

  - You are about to drop the column `lastSync` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `devices` table. All the data in the column will be lost.
  - Added the required column `browser` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceType` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fingerprint` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "lastSync",
DROP COLUMN "name",
DROP COLUMN "platform",
ADD COLUMN     "browser" TEXT NOT NULL,
ADD COLUMN     "deviceType" TEXT NOT NULL,
ADD COLUMN     "fingerprint" TEXT NOT NULL,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "os" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "public"."Platform";
