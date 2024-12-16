-- AlterTable
ALTER TABLE `recipient` ADD COLUMN `canceled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canceled_at` DATETIME(3) NULL;
