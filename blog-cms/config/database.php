<?php
/**
 * Entec Media Blog CMS - Hostinger Compatible Database Connection Config
 */

declare(strict_types=1);

// Disable direct execution
if (count(get_included_files()) === 1) {
    http_response_code(403);
    exit('Direct script access forbidden.');
}

// Database Credentials (Environment or Default Production/Local Config)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'entec_blog_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// Base Site & Upload URLs
define('SITE_URL', getenv('SITE_URL') ?: 'http://localhost:3000');
define('API_BASE_URL', getenv('API_BASE_URL') ?: 'http://localhost/blog-cms/api');
define('UPLOADS_BASE_URL', getenv('UPLOADS_BASE_URL') ?: 'http://localhost/blog-cms/uploads/blogs');

/**
 * Returns a shared PDO database instance with prepared statement configuration.
 *
 * @return PDO
 */
function getDBConnection(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Log error server-side silently, never leak credentials to client
            error_log('Database Connection Failure: ' . $e->getMessage());

            if (strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') !== false) {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection failed. Please verify configuration.',
                ]);
                exit;
            } else {
                exit('System Maintenance: Database connection unavailable.');
            }
        }
    }

    return $pdo;
}
