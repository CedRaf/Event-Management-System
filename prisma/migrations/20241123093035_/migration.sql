/*
  Warnings:

  - You are about to drop the column `recipientUserID` on the `rsvp` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `RSVP_recipientUserID_fkey` ON `rsvp`;

-- AlterTable
ALTER TABLE `rsvp` DROP COLUMN `recipientUserID`;
