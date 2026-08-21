<?php
/**
 * Public API: Get Active Categories with Published Blog Counts
 * GET /api/public/categories.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    jsonResponse(false, 'Method not allowed. Use GET.', null, 405);
}

$pdo = getDBConnection();

$sql = "SELECT 
            c.id,
            c.name,
            c.slug,
            c.description,
            c.meta_title,
            c.meta_description,
            COUNT(b.id) as published_blogs_count
        FROM categories c
        LEFT JOIN blogs b ON c.id = b.category_id AND b.status = 'published'
        WHERE c.status = 'active'
        GROUP BY c.id
        ORDER BY c.name ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$categories = $stmt->fetchAll();

jsonResponse(true, 'Categories retrieved successfully.', [
    'categories' => $categories
]);
