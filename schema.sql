-- ============================================================================
-- AuthShield Database Schema Definition
-- MySQL / MariaDB Schema for Login and Registration System
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `auth_demo` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `auth_demo`;

-- ----------------------------------------------------------------------------
-- Table: users
-- Stores account credentials, hashed passwords, and creation timestamps.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_username` (`username`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Seed Data: Sample Demo User
-- Username: demo
-- Email: demo@example.com
-- Password: password123 (BCRYPT Hashed)
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`username`, `email`, `password`)
VALUES (
  'demo',
  'demo@example.com',
  '$2y$12$K8/Nq2w928YxN4cQpGZf9eYgZ0a8O9j7P6l5m4k3j2h1g0f9e8d7c'
) ON DUPLICATE KEY UPDATE `id`=`id`;
