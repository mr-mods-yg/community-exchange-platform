-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ELECTRONICS', 'FASHION', 'FURNITURE', 'BOOKS', 'SPORTS', 'MUSIC', 'HOME_GARDEN', 'TOYS', 'AUTOMOTIVE', 'ART_CRAFTS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Condition" AS ENUM ('NEW', 'LIKE_NEW', 'USED', 'REPAIRED');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('unreviewed', 'allowed', 'blocked', 'onhold');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL,
    "category" "public"."Category" NOT NULL,
    "condition" "public"."Condition" NOT NULL,
    "userId" TEXT NOT NULL,
    "locationCoords" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LocationInfo" (
    "id" TEXT NOT NULL,
    "amenity" TEXT,
    "road" TEXT,
    "city" TEXT NOT NULL,
    "county" TEXT,
    "state_district" TEXT,
    "state" TEXT NOT NULL,
    "iso3166_lvl4" TEXT,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,

    CONSTRAINT "LocationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_locationId_key" ON "public"."Product"("locationId");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."LocationInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
