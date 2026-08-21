<?php
/**
 * Admin API: Toggle Publish / Unpublish Status
 * POST /api/admin/blogs/publish.php
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
    jsonResponse(false, 'Valid blog ID is required.', null, 400);
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id, status, published_at FROM blogs WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id]);
$blog = $stmt->fetch();

if (!$blog) {
    jsonResponse(false, 'Blog post not found.', null, 404);
}

$newStatus = ($blog['status'] === 'published') ? 'draft' : 'published';
$publishedAt = $blog['published_at'];

if ($newStatus === 'published' && empty($publishedAt)) {
    $publishedAt = date('Y-m-d H:i:s');
}

$updateStmt = $pdo->prepare("UPDATE blogs SET status = :status, published_at = :published_at WHERE id = :id");
$updateStmt->execute([
    ':status'       => $newStatus,
    ':published_at' => $publishedAt,
    ':id'           => $id,
]);

jsonResponse(true, "Blog status updated to {$newStatus}.", [
    'id'           => $id,
    'new_status'   => $newStatus,
    'published_at' => $publishedAt,
]);
