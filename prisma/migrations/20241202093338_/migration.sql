-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `eventcategory`(`categoryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `Notifications_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rsvp` ADD CONSTRAINT `RSVP_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `event`(`eventID`) ON DELETE RESTRICT ON UPDATE CASCADE;
