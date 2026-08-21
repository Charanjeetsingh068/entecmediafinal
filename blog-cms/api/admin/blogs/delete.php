<?php
/**
 * Admin API: Delete Blog
 * POST /api/admin/blogs/delete.php
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
    jsonResponse(false, 'Valid blog ID is required for deletion.', null, 400);
}

$pdo = getDBConnection();

// Delete blog_tags pivot links first
$delTags = $pdo->prepare("DELETE FROM blog_tags WHERE blog_id = :id");
$delTags->execute([':id' => $id]);

// Delete blog_views analytics
$delViews = $pdo->prepare("DELETE FROM blog_views WHERE blog_id = :id");
$delViews->execute([':id' => $id]);

// Delete blog record
$delBlog = $pdo->prepare("DELETE FROM blogs WHERE id = :id");
$delBlog->execute([':id' => $id]);

jsonResponse(true, 'Blog post deleted successfully.');
