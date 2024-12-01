/*
  Warnings:

  - A unique constraint covering the columns `[googleID]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_eventID_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `googleID` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_googleID_key` ON `user`(`googleID`);

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `Notifications_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE CASCADE ON UPDATE CASCADE;
