/*
  Warnings:

  - You are about to drop the column `userID` on the `rsvp` table. All the data in the column will be lost.
  - Added the required column `recipientUserID` to the `rsvp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUserID` to the `rsvp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_userID_fkey`;

-- AlterTable
ALTER TABLE `rsvp` DROP COLUMN `userID`,
    ADD COLUMN `recipientUserID` INTEGER NOT NULL,
    ADD COLUMN `senderUserID` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `RSVP_senderUserID_fkey` ON `rsvp`(`senderUserID`);

-- CreateIndex
CREATE INDEX `RSVP_recipientUserID_fkey` ON `rsvp`(`recipientUserID`);

-- AddForeignKey
ALTER TABLE `rsvp` ADD CONSTRAINT `RSVP_senderUserID_fkey` FOREIGN KEY (`senderUserID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rsvp` ADD CONSTRAINT `RSVP_recipientUserID_fkey` FOREIGN KEY (`recipientUserID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
