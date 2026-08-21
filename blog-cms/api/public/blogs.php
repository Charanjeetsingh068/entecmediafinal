<?php
/**
 * Public API: List Published Blogs with Pagination, Category Filter, and Search
 * GET /api/public/blogs.php?page=1&limit=9&category=slug&tag=slug&search=query
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    jsonResponse(false, 'Method not allowed. Use GET.', null, 405);
}

$pdo = getDBConnection();

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(50, max(1, (int)($_GET['limit'] ?? 9)));
$offset = ($page - 1) * $limit;

$categorySlug = isset($_GET['category']) ? trim((string)$_GET['category']) : '';
$tagSlug = isset($_GET['tag']) ? trim((string)$_GET['tag']) : '';
$search = isset($_GET['search']) ? trim((string)$_GET['search']) : '';

$whereConditions = ["b.status = 'published'", "(b.published_at IS NULL OR b.published_at <= NOW())"];
$params = [];

if ($categorySlug !== '') {
    $whereConditions[] = "c.slug = :category_slug";
    $params[':category_slug'] = $categorySlug;
}

if ($tagSlug !== '') {
    $whereConditions[] = "b.id IN (SELECT blog_id FROM blog_tags bt JOIN tags t ON bt.tag_id = t.id WHERE t.slug = :tag_slug)";
    $params[':tag_slug'] = $tagSlug;
}

if ($search !== '') {
    $whereConditions[] = "(b.title LIKE :search OR b.excerpt LIKE :search OR b.content LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}

$whereClause = 'WHERE ' . implode(' AND ', $whereConditions);

// Count Total Matching Published Blogs
$countSql = "SELECT COUNT(DISTINCT b.id) as total 
             FROM blogs b 
             LEFT JOIN categories c ON b.category_id = c.id 
             {$whereClause}";

$countStmt = $pdo->prepare($countSql);
foreach ($params as $key => $val) {
    $countStmt->bindValue($key, $val);
}
$countStmt->execute();
$totalCount = (int)$countStmt->fetchColumn();

// Fetch Paginated Blogs
$sql = "SELECT 
            b.id,
            b.title,
            b.slug,
            b.excerpt,
            b.featured_image,
            b.featured_image_alt,
            b.author_name,
            b.published_at,
            b.created_at,
            c.name as category_name,
            c.slug as category_slug
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        {$whereClause}
        ORDER BY b.published_at DESC, b.id DESC
        LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $val) {
    $stmt->bindValue($key, $val);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$blogs = $stmt->fetchAll();

// Format image URLs & dates
foreach ($blogs as &$blog) {
    $blog['featured_image_url'] = getFeaturedImageUrl($blog['featured_image']);
    $blog['formatted_date'] = !empty($blog['published_at']) 
        ? date('M j, Y', strtotime($blog['published_at'])) 
        : date('M j, Y', strtotime($blog['created_at']));
}

$totalPages = max(1, (int)ceil($totalCount / $limit));

jsonResponse(true, 'Published blogs retrieved successfully.', [
    'blogs'       => $blogs,
    'pagination'  => [
        'total_records' => $totalCount,
        'total_pages'   => $totalPages,
        'current_page'  => $page,
        'limit'         => $limit,
        'has_next'      => $page < $totalPages,
        'has_prev'      => $page > 1,
    ]
]);
