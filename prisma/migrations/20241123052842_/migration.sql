/*
  Warnings:

  - Added the required column `userID` to the `eventcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `eventcategory` ADD COLUMN `userID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Event_userID_fkey` ON `eventcategory`(`userID`);

-- AddForeignKey
ALTER TABLE `eventcategory` ADD CONSTRAINT `eventcategory_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
