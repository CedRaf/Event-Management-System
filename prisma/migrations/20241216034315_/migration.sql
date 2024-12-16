-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_categoryID_fkey`;

-- AlterTable
ALTER TABLE `event` MODIFY `categoryID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `eventcategory`(`categoryID`) ON DELETE SET NULL ON UPDATE CASCADE;
