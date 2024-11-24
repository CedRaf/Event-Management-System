-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_recipientUserID_fkey`;

-- CreateTable
CREATE TABLE `recipient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rsvpID` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,

    INDEX `Recipient_RSVP_fkey`(`rsvpID`),
    INDEX `Recipient_User_fkey`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recipient` ADD CONSTRAINT `Recipient_RSVP_fkey` FOREIGN KEY (`rsvpID`) REFERENCES `rsvp`(`rsvpID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipient` ADD CONSTRAINT `Recipient_User_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
