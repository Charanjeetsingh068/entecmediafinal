<?php
/**
 * Admin API: Update Category
 * POST /api/admin/categories/update.php
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

$name = trim((string)($input['name'] ?? ''));
$description = trim((string)($input['description'] ?? ''));
$metaTitle = trim((string)($input['meta_title'] ?? ''));
$metaDescription = trim((string)($input['meta_description'] ?? ''));
$status = in_array(($input['status'] ?? ''), ['active', 'inactive'], true) ? $input['status'] : 'active';

if ($name === '') {
    jsonResponse(false, 'Category name is required.', null, 400);
}

$pdo = getDBConnection();

$checkStmt = $pdo->prepare("SELECT id FROM categories WHERE id = :id LIMIT 1");
$checkStmt->execute([':id' => $id]);
if (!$checkStmt->fetch()) {
    jsonResponse(false, 'Category not found.', null, 404);
}

// Generate unique slug excluding current category
$slug = makeUniqueSlug($pdo, 'categories', $name, $id);

$stmt = $pdo->prepare("UPDATE categories SET 
            name = :name,
            slug = :slug,
            description = :desc,
            meta_title = :meta_t,
            meta_description = :meta_d,
            status = :status
        WHERE id = :id");

$stmt->execute([
    ':name'   => $name,
    ':slug'   => $slug,
    ':desc'   => $description,
    ':meta_t' => $metaTitle !== '' ? $metaTitle : $name,
    ':meta_d' => $metaDescription,
    ':status' => $status,
    ':id'     => $id,
]);

jsonResponse(true, 'Category updated successfully.', [
    'category' => [
        'id'     => $id,
        'name'   => $name,
        'slug'   => $slug,
        'status' => $status,
    ]
]);
