/*
  Warnings:

  - You are about to drop the column `locationId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ProductImage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Product_locationId_key";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "locationId";

-- AlterTable
ALTER TABLE "public"."ProductImage" DROP COLUMN "createdAt";
