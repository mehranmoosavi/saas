/*
  Warnings:

  - A unique constraint covering the columns `[orderId,foodId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_foodId_key" ON "public"."OrderItem"("orderId", "foodId");
