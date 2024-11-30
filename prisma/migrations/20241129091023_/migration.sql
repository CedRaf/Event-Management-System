/*
  Warnings:

  - You are about to drop the `Calendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Calendar` DROP FOREIGN KEY `Calendar_eventID_fkey`;

-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_eventID_fkey`;

-- DropTable
DROP TABLE `Calendar`;


-- CreateTable
CREATE TABLE `calendar` (
    `calendarID` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `eventID` INTEGER NOT NULL,
    `linked_account` VARCHAR(255) NOT NULL,

    INDEX `Calendar_eventID_fkey`(`eventID`),
    INDEX `Calendar_userID_fkey`(`userID`),
    PRIMARY KEY (`calendarID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `eventID` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `categoryID` INTEGER NOT NULL,
    `event_title` VARCHAR(255) NOT NULL,
    `event_description` VARCHAR(255) NOT NULL,
    `event_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Event_categoryID_fkey`(`categoryID`),
    INDEX `Event_userID_fkey`(`userID`),
    PRIMARY KEY (`eventID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `calendar` ADD CONSTRAINT `Calendar_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar` ADD CONSTRAINT `Calendar_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `eventcategory`(`categoryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `Notifications_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `Notifications_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rsvp` ADD CONSTRAINT `RSVP_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE RESTRICT ON UPDATE CASCADE;
