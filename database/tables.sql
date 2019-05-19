CREATE DATABASE IF NOT EXISTS paysight_db;

-- start: suppliers table
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(100) NULL,
  `name` VARCHAR(255) NOT NULL,
  `tin_number` VARCHAR(30) NULL,
  `tax_class` VARCHAR(20) NULL,
  `principal` VARCHAR(20) NULL,
  `terms` VARCHAR(20) NULL,
  `address` TEXT NULL,
  `contact_number` VARCHAR(20) NULL,
  `email` VARCHAR(50) NULL,
  `representative_name` VARCHAR(100) NULL,
  `representative_contact` VARCHAR(100) NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1
);
-- end: suppliers table



-- start: deliveries table
DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `invoice_number` BIGINT NOT NULL,
  `supplier_id` BIGINT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `date` DATE NOT NULL
);
-- end: deliveries table



-- start: bad_orders table
DROP TABLE IF EXISTS `bad_orders`;
CREATE TABLE IF NOT EXISTS `bad_orders` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `supplier_id` BIGINT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `date` DATE NOT NULL
);
-- end: deliveries table
