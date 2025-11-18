/*
  Warnings:

  - You are about to drop the column `content` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `event_sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."event_sections" DROP CONSTRAINT "event_sections_eventId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "content",
DROP COLUMN "fullDescription",
ADD COLUMN     "eventDetails" TEXT,
ADD COLUMN     "eventIntro" TEXT;

-- DropTable
DROP TABLE "public"."event_sections";
