<?php
/**
 * Entec Media Blog CMS - Admin Session, Security & Authentication
 */

declare(strict_types=1);

require_once __DIR__ . '/functions.php';

/**
 * Configures and starts a secure PHP session for Admin.
 */
function startAdminSession(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', '1');
        ini_set('session.use_only_cookies', '1');
        ini_set('session.cookie_samesite', 'Lax');

        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            ini_set('session.cookie_secure', '1');
        }

        session_start();
    }

    // Inactivity Timeout (2 Hours)
    $timeout = 7200;
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
        session_unset();
        session_destroy();
        session_start();
    }
    $_SESSION['last_activity'] = time();
}

/**
 * Ensures user is authenticated as an admin. Redirects or outputs JSON error.
 */
function requireAdminAuth(bool $isApiRequest = false): array
{
    startAdminSession();

    if (empty($_SESSION['admin_logged_in']) || empty($_SESSION['admin_id'])) {
        if ($isApiRequest) {
            jsonResponse(false, 'Unauthorized. Session expired or admin login required.', null, 401);
        } else {
            header('Location: ' . SITE_URL . '/blog-cms/admin/login.php?error=expired');
            exit;
        }
    }

    return [
        'id'    => $_SESSION['admin_id'],
        'name'  => $_SESSION['admin_name'] ?? 'Admin',
        'email' => $_SESSION['admin_email'] ?? '',
    ];
}

/**
 * Generates CSRF token stored in session
 */
function generateCSRFToken(): string
{
    startAdminSession();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validates CSRF token from POST header or field
 */
function validateCSRFToken(?string $token): bool
{
    startAdminSession();
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Password hashing using Argon2id / bcrypt
 */
function hashPassword(string $password): string
{
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Password verification
 */
function verifyPassword(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}
