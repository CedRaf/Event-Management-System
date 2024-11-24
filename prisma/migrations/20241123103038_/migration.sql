-- DropForeignKey
ALTER TABLE `recipient` DROP FOREIGN KEY `Recipient_RSVP_fkey`;

-- AddForeignKey
ALTER TABLE `recipient` ADD CONSTRAINT `Recipient_RSVP_fkey` FOREIGN KEY (`rsvpID`) REFERENCES `rsvp`(`rsvpID`) ON DELETE CASCADE ON UPDATE CASCADE;
