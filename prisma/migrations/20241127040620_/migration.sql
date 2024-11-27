-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_eventID_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `rsvpID` INTEGER NULL,
    MODIFY `eventID` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Notifications_rsvpID_fkey` ON `notifications`(`rsvpID`);

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `Notifications_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `Notifications_rsvpID_fkey` FOREIGN KEY (`rsvpID`) REFERENCES `rsvp`(`rsvpID`) ON DELETE CASCADE ON UPDATE CASCADE;
