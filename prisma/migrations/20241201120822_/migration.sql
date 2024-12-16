/*
  Warnings:

  - You are about to drop the `calendar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `calendar` DROP FOREIGN KEY `Calendar_eventID_fkey`;

-- DropForeignKey
ALTER TABLE `calendar` DROP FOREIGN KEY `Calendar_userID_fkey`;

-- AlterTable
ALTER TABLE `event` ADD COLUMN `location` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `calendar`;
