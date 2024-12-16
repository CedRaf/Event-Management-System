/*
  Warnings:

  - You are about to drop the column `status` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `status`,
    ADD COLUMN `opened` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `rsvp` MODIFY `status` ENUM('ACTIVE', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE';
