/*
  Warnings:

  - Added the required column `type` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FoodType" AS ENUM ('DRINKING', 'JAPANESE', 'PERSIAN', 'DESERT');

-- AlterTable
ALTER TABLE "public"."Food" ADD COLUMN     "type" "public"."FoodType" NOT NULL;
