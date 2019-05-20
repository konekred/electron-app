-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ABC12abc'

CREATE DATABASE IF NOT EXISTS paysight_db;

-- start: suppliers table
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(100) NULL,
  `name` VARCHAR(255) NOT NULL,
  `tinNumber` VARCHAR(25) NULL,
  `taxClass` VARCHAR(25) NULL,
  `principal` VARCHAR(50) NULL,
  `terms` VARCHAR(20) NULL,
  `address` TEXT NULL,
  `contactNumber` VARCHAR(20) NULL,
  `email` VARCHAR(50) NULL,
  `representativeName` VARCHAR(100) NULL,
  `representativeContact` VARCHAR(100) NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1
);
-- end: suppliers table



-- start: deliveries table
DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `invoiceNumber` BIGINT NOT NULL,
  `supplierId` BIGINT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `date` DATE NOT NULL
);
-- end: deliveries table



-- start: bad_orders table
DROP TABLE IF EXISTS `bad_orders`;
CREATE TABLE IF NOT EXISTS `bad_orders` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `supplierId` BIGINT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `date` DATE NOT NULL
);
-- end: deliveries table
