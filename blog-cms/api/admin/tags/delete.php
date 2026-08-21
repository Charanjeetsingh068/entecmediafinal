<?php
/**
 * Admin API: Delete Tag
 * POST /api/admin/tags/delete.php
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
    jsonResponse(false, 'Valid tag ID is required.', null, 400);
}

$pdo = getDBConnection();

// Delete blog_tags links first
$delLinks = $pdo->prepare("DELETE FROM blog_tags WHERE tag_id = :id");
$delLinks->execute([':id' => $id]);

// Delete tag record
$delTag = $pdo->prepare("DELETE FROM tags WHERE id = :id");
$delTag->execute([':id' => $id]);

jsonResponse(true, 'Tag deleted successfully.');
