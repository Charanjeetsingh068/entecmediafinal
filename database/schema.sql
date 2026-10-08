-- ====================================================================
-- ENTEC MEDIA - MySQL Database Schema
-- Modules: Admins, Blogs, Projects/Portfolio, Services, Careers, Leads
-- Character Set: utf8mb4 (Full Unicode & Emoji support)
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------------------
-- 1. Table: admins
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('superadmin', 'editor') DEFAULT 'superadmin',
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Table: blogs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` TEXT NULL,
  `content` LONGTEXT NOT NULL,
  `cover_image` VARCHAR(500) NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `author` VARCHAR(100) DEFAULT 'Entec Media Team',
  `read_time` VARCHAR(30) DEFAULT '5 min read',
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `keywords` VARCHAR(500) NULL,
  `status` ENUM('published', 'draft') DEFAULT 'published',
  `views` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Table: projects (Portfolio / Case Studies)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `client` VARCHAR(150) NULL,
  `category` VARCHAR(100) DEFAULT 'Web Development',
  `thumbnail` VARCHAR(500) NULL,
  `gallery` LONGTEXT NULL COMMENT 'JSON array of image URLs',
  `short_desc` TEXT NULL,
  `overview` LONGTEXT NULL,
  `challenge` LONGTEXT NULL,
  `solution` LONGTEXT NULL,
  `results` LONGTEXT NULL,
  `services_used` VARCHAR(500) NULL COMMENT 'Comma separated services',
  `live_url` VARCHAR(500) NULL,
  `featured` TINYINT(1) DEFAULT 0,
  `display_order` INT DEFAULT 0,
  `status` ENUM('published', 'draft') DEFAULT 'published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_project_slug` (`slug`),
  INDEX `idx_project_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Table: services
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `icon` VARCHAR(500) NULL,
  `short_desc` TEXT NULL,
  `full_desc` LONGTEXT NULL,
  `deliverables` LONGTEXT NULL COMMENT 'JSON array of bullet points',
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_service_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Table: careers (Job Openings)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `careers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `department` VARCHAR(100) DEFAULT 'Engineering',
  `location` VARCHAR(150) DEFAULT 'Remote / Mohali',
  `job_type` ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote') DEFAULT 'Full-time',
  `experience` VARCHAR(100) DEFAULT '1-3 Years',
  `description` LONGTEXT NOT NULL,
  `requirements` LONGTEXT NULL,
  `responsibilities` LONGTEXT NULL,
  `status` ENUM('open', 'closed') DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_career_slug` (`slug`),
  INDEX `idx_career_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Table: job_applications
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `career_id` INT UNSIGNED NULL,
  `job_title` VARCHAR(255) NOT NULL,
  `applicant_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `portfolio_url` VARCHAR(500) NULL,
  `resume_path` VARCHAR(500) NOT NULL,
  `cover_note` TEXT NULL,
  `status` ENUM('new', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`career_id`) REFERENCES `careers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Table: leads (Contact / Inquiries)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `service_needed` VARCHAR(150) NULL,
  `budget` VARCHAR(100) NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'in_progress', 'converted', 'closed') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. Table: site_settings
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `value_data` LONGTEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Initial Default Admin User:
-- Email: admin@entecmedia.com
-- Password: AdminPassword@2026 (Change on first login)
-- Hash generated via standard PHP password_hash() Bcrypt
-- --------------------------------------------------------------------
INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `role`)
VALUES (1, 'Entec Administrator', 'admin@entecmedia.com', '$2y$10$tZ261x790BskxL18e5tE4O1yH52c80V9Jm4j1K/zF6Cg7Q9y3P8jC', 'superadmin')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
