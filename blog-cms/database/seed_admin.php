<?php
/**
 * Entec Media Blog CMS - Initial Admin Account Creator
 * Run via CLI: php seed_admin.php admin@entecmedia.com MySecretPassword123!
 * Or via web browser once during initial setup.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';

$pdo = getDBConnection();

// Command Line or HTTP Request Arguments
$email = $argv[1] ?? $_GET['email'] ?? 'admin@entecmedia.com';
$password = $argv[2] ?? $_GET['password'] ?? 'EntecAdmin2026!';
$name = $argv[3] ?? $_GET['name'] ?? 'Entec Super Admin';

if (empty($email) || empty($password)) {
    exit("Usage: php seed_admin.php <email> <password> [name]\n");
}

// Check if admin already exists
$stmt = $pdo->prepare("SELECT id FROM admins WHERE email = :email LIMIT 1");
$stmt->execute([':email' => $email]);

if ($stmt->fetch()) {
    echo "Admin user '{$email}' already exists in database.\n";
    exit;
}

$hash = hashPassword($password);

$insert = $pdo->prepare("INSERT INTO admins (name, email, password_hash, status) VALUES (:name, :email, :hash, 'active')");
$insert->execute([
    ':name'  => $name,
    ':email' => $email,
    ':hash'  => $hash
]);

echo "SUCCESS: Admin user created successfully!\n";
echo "Email: {$email}\n";
echo "Password: (Set to provided password)\n";
echo "IMPORTANT: Remove or restrict access to seed_admin.php in production.\n";
