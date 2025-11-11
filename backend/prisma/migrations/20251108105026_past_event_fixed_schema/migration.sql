/*
  Warnings:

  - You are about to drop the column `activities` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `galleryImages` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `heroImage` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `heroQuote` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `heroTitle` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `introContent` on the `past_events` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `past_events` table. All the data in the column will be lost.
  - The `conclusion` column on the `past_events` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "public"."past_events_featured_idx";

-- DropIndex
DROP INDEX "public"."past_events_year_status_idx";

-- AlterTable
ALTER TABLE "past_events" DROP COLUMN "activities",
DROP COLUMN "featured",
DROP COLUMN "galleryImages",
DROP COLUMN "heroImage",
DROP COLUMN "heroQuote",
DROP COLUMN "heroTitle",
DROP COLUMN "introContent",
DROP COLUMN "status",
ADD COLUMN     "featureList" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "gallery" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "hero" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "intro" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "thumbnailImage" TEXT,
DROP COLUMN "conclusion",
ADD COLUMN     "conclusion" JSONB NOT NULL DEFAULT '{}';

-- CreateIndex
CREATE INDEX "past_events_year_idx" ON "past_events"("year");
