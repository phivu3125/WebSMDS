/*
  Warnings:

  - You are about to drop the column `image` on the `past_events` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."past_events_year_idx";

-- AlterTable
ALTER TABLE "past_events" DROP COLUMN "image",
ADD COLUMN     "activities" JSONB,
ADD COLUMN     "conclusion" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "heroQuote" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "introContent" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "subtitle" TEXT;

-- CreateIndex
CREATE INDEX "past_events_year_status_idx" ON "past_events"("year", "status");

-- CreateIndex
CREATE INDEX "past_events_featured_idx" ON "past_events"("featured");
