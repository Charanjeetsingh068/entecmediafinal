<?php
/**
 * Admin API: Delete Category (With Safety Check)
 * POST /api/admin/categories/delete.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed. Use POST.', null, 405);
}

$admin = requireAdminAuth(true);

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$csrfToken = $input['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

if (!validateCSRFToken((string)$csrfToken)) {
    jsonResponse(false, 'Invalid or expired CSRF token.', null, 403);
}

$id = (int)($input['id'] ?? 0);

if ($id <= 0) {
    jsonResponse(false, 'Valid category ID is required.', null, 400);
}

$pdo = getDBConnection();

// Check if blogs are currently assigned to this category
$checkStmt = $pdo->prepare("SELECT COUNT(*) FROM blogs WHERE category_id = :id");
$checkStmt->execute([':id' => $id]);
$blogCount = (int)$checkStmt->fetchColumn();

if ($blogCount > 0) {
    jsonResponse(false, "Cannot delete category. There are currently {$blogCount} blog post(s) assigned to this category. Please reassign or delete those blogs first.", [
        'assigned_blogs' => $blogCount
    ], 400);
}

$delStmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
$delStmt->execute([':id' => $id]);

jsonResponse(true, 'Category deleted successfully.');
