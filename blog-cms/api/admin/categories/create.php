<?php
/**
 * Admin API: Create Category
 * POST /api/admin/categories/create.php
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
$description = trim((string)($input['description'] ?? ''));
$metaTitle = trim((string)($input['meta_title'] ?? ''));
$metaDescription = trim((string)($input['meta_description'] ?? ''));
$status = in_array(($input['status'] ?? ''), ['active', 'inactive'], true) ? $input['status'] : 'active';

if ($name === '') {
    jsonResponse(false, 'Category name is required.', null, 400);
}

$pdo = getDBConnection();

// Duplicate Name Check
$checkStmt = $pdo->prepare("SELECT id FROM categories WHERE name = :name LIMIT 1");
$checkStmt->execute([':name' => $name]);
if ($checkStmt->fetch()) {
    jsonResponse(false, "Category name '{$name}' already exists.", null, 400);
}

$slug = makeUniqueSlug($pdo, 'categories', $name);

$stmt = $pdo->prepare("INSERT INTO categories (name, slug, description, meta_title, meta_description, status) VALUES (:name, :slug, :desc, :meta_t, :meta_d, :status)");
$stmt->execute([
    ':name'   => $name,
    ':slug'   => $slug,
    ':desc'   => $description,
    ':meta_t' => $metaTitle !== '' ? $metaTitle : $name,
    ':meta_d' => $metaDescription,
    ':status' => $status,
]);

$catId = (int)$pdo->lastInsertId();

jsonResponse(true, 'Category created successfully.', [
    'category' => [
        'id'     => $catId,
        'name'   => $name,
        'slug'   => $slug,
        'status' => $status,
    ]
]);
