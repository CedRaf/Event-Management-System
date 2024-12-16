/*
  Warnings:

  - You are about to drop the column `event_date` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `event_date`,
    ADD COLUMN `eventEnd_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `eventStart_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
