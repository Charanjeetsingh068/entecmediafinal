<?php
/**
 * Admin API: Secure Admin Login
 * POST /api/admin/auth/login.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    jsonResponse(false, 'Method not allowed. Use POST.', null, 405);
}

startAdminSession();

// Parse input
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$email = isset($input['email']) ? trim((string)$input['email']) : '';
$password = isset($input['password']) ? (string)$input['password'] : '';

if ($email === '' || $password === '') {
    jsonResponse(false, 'Email and password are required.', null, 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Invalid email address format.', null, 400);
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id, name, email, password_hash, status FROM admins WHERE email = :email LIMIT 1");
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

if (!$admin || $admin['status'] !== 'active' || !verifyPassword($password, $admin['password_hash'])) {
    jsonResponse(false, 'Invalid email address or password.', null, 401);
}

// Regenerate session ID to prevent Session Fixation
session_regenerate_id(true);

$_SESSION['admin_logged_in'] = true;
$_SESSION['admin_id']        = (int)$admin['id'];
$_SESSION['admin_name']      = $admin['name'];
$_SESSION['admin_email']     = $admin['email'];

$csrfToken = generateCSRFToken();

// Record last login time
$updateStmt = $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = :id");
$updateStmt->execute([':id' => $admin['id']]);

jsonResponse(true, 'Login successful. Welcome back!', [
    'admin' => [
        'id'    => $admin['id'],
        'name'  => $admin['name'],
        'email' => $admin['email'],
    ],
    'csrf_token' => $csrfToken,
]);
