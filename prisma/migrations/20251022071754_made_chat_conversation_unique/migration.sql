/*
  Warnings:

  - A unique constraint covering the columns `[productId,senderId,receiverId]` on the table `ChatConversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatConversation_productId_senderId_receiverId_key" ON "public"."ChatConversation"("productId", "senderId", "receiverId");
