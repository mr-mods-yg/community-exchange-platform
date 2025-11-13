/*
  Warnings:

  - Made the column `state_district` on table `LocationInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."LocationInfo" ALTER COLUMN "state_district" SET NOT NULL;
