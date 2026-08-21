<?php
/**
 * Admin API: Create Tag
 * POST /api/admin/tags/create.php
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

$name = trim((string)($input['name'] ?? ''));

if ($name === '') {
    jsonResponse(false, 'Tag name is required.', null, 400);
}

$pdo = getDBConnection();

$slug = makeUniqueSlug($pdo, 'tags', $name);

$stmt = $pdo->prepare("INSERT IGNORE INTO tags (name, slug) VALUES (:name, :slug)");
$stmt->execute([':name' => $name, ':slug' => $slug]);

$tagId = (int)$pdo->lastInsertId();

if ($tagId === 0) {
    $getStmt = $pdo->prepare("SELECT id, slug FROM tags WHERE name = :name LIMIT 1");
    $getStmt->execute([':name' => $name]);
    $existing = $getStmt->fetch();
    $tagId = (int)$existing['id'];
    $slug = $existing['slug'];
}

jsonResponse(true, 'Tag created/retrieved.', ['tag' => ['id' => $tagId, 'name' => $name, 'slug' => $slug]]);
