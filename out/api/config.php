<?php
/**
 * Database & API Configuration
 * Supports Hostinger MySQL with PDO
 */

// Error reporting (disabled display in prod, enabled for debugging)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set CORS Headers for secure API access
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Session configuration
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Credentials - update these with your Hostinger DB details
// You can also create a config.local.php file to override credentials locally without committing secrets
$db_host = 'localhost';
$db_name = 'u399205733_Entecmedia'; // Hostinger Database Name
$db_user = 'u399205733_Entecmedia'; // Hostinger Database User
$db_pass = 'Entecmedia@123';        // Hostinger Database Password

// Load local overrides if present
if (file_exists(__DIR__ . '/config.local.php')) {
    include_once __DIR__ . '/config.local.php';
}

function get_db_connection() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    try {
        $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, $db_user, $db_pass, $options);
        ensure_database_schema($pdo);
        return $pdo;
    } catch (PDOException $e) {
        send_json_response(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
        exit();
    }
}

function ensure_database_schema($db) {
    try {
        $check = $db->query("SHOW TABLES LIKE 'admins'");
        if ($check && $check->rowCount() > 0) return;

        $db->exec("
            CREATE TABLE IF NOT EXISTS `admins` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `name` VARCHAR(100) NOT NULL,
              `email` VARCHAR(150) NOT NULL UNIQUE,
              `password_hash` VARCHAR(255) NOT NULL,
              `role` ENUM('superadmin', 'editor') DEFAULT 'superadmin',
              `last_login` DATETIME NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `careers` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(255) NOT NULL UNIQUE,
              `department` VARCHAR(100) DEFAULT 'Engineering',
              `location` VARCHAR(150) DEFAULT 'Remote / Mohali',
              `job_type` ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid', 'On-site') DEFAULT 'Full-time',
              `experience` VARCHAR(100) DEFAULT '1-3 Years',
              `salary_range` VARCHAR(100) NULL,
              `description` LONGTEXT NOT NULL,
              `requirements` LONGTEXT NULL,
              `responsibilities` LONGTEXT NULL,
              `status` ENUM('open', 'closed') DEFAULT 'open',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `projects` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(255) NOT NULL UNIQUE,
              `client` VARCHAR(150) NULL,
              `category` VARCHAR(100) DEFAULT 'Web Development',
              `thumbnail` VARCHAR(500) NULL,
              `short_desc` TEXT NULL,
              `overview` LONGTEXT NULL,
              `featured` TINYINT(1) DEFAULT 0,
              `status` ENUM('published', 'draft') DEFAULT 'published',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `services` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(255) NOT NULL UNIQUE,
              `icon` VARCHAR(500) NULL,
              `short_desc` TEXT NULL,
              `full_desc` LONGTEXT NULL,
              `status` ENUM('active', 'inactive') DEFAULT 'active',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `site_settings` (
              `key_name` VARCHAR(100) PRIMARY KEY,
              `value_data` LONGTEXT NULL,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `pages` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(100) NOT NULL UNIQUE,
              `meta_title` VARCHAR(255) NULL,
              `meta_description` TEXT NULL,
              `status` ENUM('published', 'draft') DEFAULT 'published',
              `sections` LONGTEXT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_page_slug` (`slug`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        $pass_hash = password_hash('Entecmedia@123', PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `role`) VALUES (1, 'Entec Administrator', 'admin@entecmedia.com', ?, 'superadmin') ON DUPLICATE KEY UPDATE `email` = VALUES(`email`)");
        $stmt->execute([$pass_hash]);
    } catch (Exception $e) {
        error_log("Schema ensure error: " . $e->getMessage());
    }
}

// Standard JSON Response Helper
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

// Get JSON Request Body Helper
function get_json_input() {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);
    return is_array($decoded) ? $decoded : [];
}

// Generate Slug from String Helper
function create_slug($string) {
    $slug = preg_replace('/[^A-Za-z0-9-]+/', '-', strtolower(trim($string)));
    return trim($slug, '-');
}

// Admin Authentication Check Helper
function require_admin_auth() {
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    // Check Session or Bearer token
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        return $_SESSION['admin_user'];
    }
    
    if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        $token = trim($matches[1]);
        $token_data = validate_auth_token($token);
        if ($token_data) {
            return $token_data;
        }
    }
    
    send_json_response(['error' => 'Unauthorized: Please login to access this resource.'], 401);
}

// Simple Signed Token for stateless auth
define('AUTH_SECRET_KEY', 'entec_media_jwt_secret_token_2026_xyz');

function generate_auth_token($user) {
    $payload = [
        'id'    => $user['id'],
        'email' => $user['email'],
        'name'  => $user['name'],
        'role'  => $user['role'],
        'exp'   => time() + (86400 * 7) // 7 days expiration
    ];
    $encoded = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $encoded, AUTH_SECRET_KEY);
    return $encoded . '.' . $signature;
}

function validate_auth_token($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 2) return false;
    
    $encoded = $parts[0];
    $signature = $parts[1];
    
    $expected_signature = hash_hmac('sha256', $encoded, AUTH_SECRET_KEY);
    if (!hash_equals($expected_signature, $signature)) return false;
    
    $payload = json_decode(base64_decode($encoded), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) return false;
    
    return $payload;
}
