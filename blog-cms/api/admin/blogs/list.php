<?php
/**
 * Admin API: List All Blogs (Drafts & Published)
 * GET /api/admin/blogs/list.php?page=1&status=draft&category_id=2&search=kw
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../includes/auth.php';

$admin = requireAdminAuth(true);
$pdo = getDBConnection();

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(50, max(1, (int)($_GET['limit'] ?? 15)));
$offset = ($page - 1) * $limit;

$status = isset($_GET['status']) ? trim((string)$_GET['status']) : '';
$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
$search = isset($_GET['search']) ? trim((string)$_GET['search']) : '';

$whereConditions = [];
$params = [];

if ($status !== '' && in_array($status, ['draft', 'published'], true)) {
    $whereConditions[] = "b.status = :status";
    $params[':status'] = $status;
}

if ($categoryId > 0) {
    $whereConditions[] = "b.category_id = :category_id";
    $params[':category_id'] = $categoryId;
}

if ($search !== '') {
    $whereConditions[] = "(b.title LIKE :search OR b.slug LIKE :search OR b.author_name LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}

$whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

// Count Total
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM blogs b {$whereClause}");
foreach ($params as $k => $v) {
    $countStmt->bindValue($k, $v);
}
$countStmt->execute();
$totalCount = (int)$countStmt->fetchColumn();

// Fetch Paginated Records
$sql = "SELECT 
            b.id,
            b.category_id,
            b.title,
            b.slug,
            b.excerpt,
            b.featured_image,
            b.featured_image_alt,
            b.author_name,
            b.status,
            b.meta_title,
            b.meta_description,
            b.published_at,
            b.created_at,
            b.updated_at,
            c.name as category_name
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        {$whereClause}
        ORDER BY b.updated_at DESC
        LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);
foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$blogs = $stmt->fetchAll();

foreach ($blogs as &$blog) {
    $blog['featured_image_url'] = getFeaturedImageUrl($blog['featured_image']);
}

$totalPages = max(1, (int)ceil($totalCount / $limit));

jsonResponse(true, 'Admin blogs retrieved.', [
    'blogs'      => $blogs,
    'pagination' => [
        'total'        => $totalCount,
        'total_pages'  => $totalPages,
        'current_page' => $page,
        'limit'        => $limit,
    ]
]);
