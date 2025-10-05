/*
  Warnings:

  - You are about to drop the column `locationCoords` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `LocationInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `LocationInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_locationId_fkey";

-- AlterTable
ALTER TABLE "public"."LocationInfo" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "locationCoords";

-- CreateIndex
CREATE UNIQUE INDEX "LocationInfo_productId_key" ON "public"."LocationInfo"("productId");

-- AddForeignKey
ALTER TABLE "public"."LocationInfo" ADD CONSTRAINT "LocationInfo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
