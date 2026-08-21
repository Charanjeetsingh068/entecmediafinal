<?php
/**
 * Public API: Search Published Blogs
 * GET /api/public/search.php?q=keyword&limit=10
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    jsonResponse(false, 'Method not allowed. Use GET.', null, 405);
}

$query = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
$limit = min(30, max(1, (int)($_GET['limit'] ?? 10)));

if ($query === '') {
    jsonResponse(true, 'Search query empty.', ['blogs' => [], 'total' => 0]);
}

$pdo = getDBConnection();

$sql = "SELECT 
            b.id,
            b.title,
            b.slug,
            b.excerpt,
            b.featured_image,
            b.published_at,
            c.name as category_name,
            c.slug as category_slug
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.status = 'published' 
          AND (b.published_at IS NULL OR b.published_at <= NOW())
          AND (b.title LIKE :q OR b.excerpt LIKE :q OR b.content LIKE :q OR c.name LIKE :q)
        ORDER BY b.published_at DESC
        LIMIT :limit";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':q', '%' . $query . '%');
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->execute();

$blogs = $stmt->fetchAll();

foreach ($blogs as &$blog) {
    $blog['featured_image_url'] = getFeaturedImageUrl($blog['featured_image']);
    $blog['formatted_date'] = !empty($blog['published_at']) 
        ? date('M j, Y', strtotime($blog['published_at'])) 
        : '';
}

jsonResponse(true, 'Search results retrieved successfully.', [
    'blogs' => $blogs,
    'total' => count($blogs),
    'query' => $query
]);
