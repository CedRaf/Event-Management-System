/*
  Warnings:

  - You are about to drop the column `canceled` on the `recipient` table. All the data in the column will be lost.
  - You are about to drop the column `canceled_at` on the `recipient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recipient` DROP COLUMN `canceled`,
    DROP COLUMN `canceled_at`,
    ADD COLUMN `cancelled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `cancelled_at` DATETIME(3) NULL;
