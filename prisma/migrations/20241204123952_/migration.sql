-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_eventID_fkey`;

-- AddForeignKey
ALTER TABLE `rsvp` ADD CONSTRAINT `RSVP_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE CASCADE ON UPDATE CASCADE;
