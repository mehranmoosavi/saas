-- AlterEnum
ALTER TYPE "public"."FoodType" ADD VALUE 'FAST_FOOD';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
