/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Session" DROP COLUMN "hashedPassword";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hashedPassword" TEXT;
