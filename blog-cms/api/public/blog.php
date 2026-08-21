<?php
/**
 * Public API: Get Single Published Blog by Slug + Related Blogs
 * GET /api/public/blog.php?slug=my-blog-title
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    jsonResponse(false, 'Method not allowed. Use GET.', null, 405);
}

$slug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : '';

if ($slug === '') {
    jsonResponse(false, 'Slug parameter is required.', null, 400);
}

$pdo = getDBConnection();

// Fetch Published Blog
$sql = "SELECT 
            b.id,
            b.category_id,
            b.title,
            b.slug,
            b.excerpt,
            b.content,
            b.featured_image,
            b.featured_image_alt,
            b.author_name,
            b.status,
            b.meta_title,
            b.meta_description,
            b.canonical_url,
            b.published_at,
            b.created_at,
            b.updated_at,
            c.name as category_name,
            c.slug as category_slug
        FROM blogs b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.slug = :slug AND b.status = 'published' AND (b.published_at IS NULL OR b.published_at <= NOW())
        LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->execute([':slug' => $slug]);
$blog = $stmt->fetch();

if (!$blog) {
    jsonResponse(false, 'Blog post not found or not published.', null, 404);
}

$blog['featured_image_url'] = getFeaturedImageUrl($blog['featured_image']);
$blog['formatted_date'] = !empty($blog['published_at']) 
    ? date('M j, Y', strtotime($blog['published_at'])) 
    : date('M j, Y', strtotime($blog['created_at']));

// Fetch Associated Tags
$tagSql = "SELECT t.id, t.name, t.slug 
           FROM tags t 
           JOIN blog_tags bt ON t.id = bt.tag_id 
           WHERE bt.blog_id = :blog_id";
$tagStmt = $pdo->prepare($tagSql);
$tagStmt->execute([':blog_id' => $blog['id']]);
$blog['tags'] = $tagStmt->fetchAll();

// Track view count safely
try {
    $ipHash = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
    $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);
    $viewStmt = $pdo->prepare("INSERT INTO blog_views (blog_id, ip_hash, user_agent) VALUES (:blog_id, :ip, :ua)");
    $viewStmt->execute([':blog_id' => $blog['id'], ':ip' => $ipHash, ':ua' => $ua]);
} catch (Throwable $e) {
    // Ignore tracking failures
}

// Fetch Related Published Blogs (Same Category or Recent, Excluding Current)
$relatedSql = "SELECT 
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
                 AND b.id != :current_id
                 AND (b.category_id = :category_id OR :category_id IS NULL)
               ORDER BY b.published_at DESC
               LIMIT 3";

$relatedStmt = $pdo->prepare($relatedSql);
$relatedStmt->execute([
    ':current_id' => $blog['id'],
    ':category_id' => $blog['category_id']
]);
$relatedBlogs = $relatedStmt->fetchAll();

foreach ($relatedBlogs as &$rel) {
    $rel['featured_image_url'] = getFeaturedImageUrl($rel['featured_image']);
    $rel['formatted_date'] = !empty($rel['published_at']) 
        ? date('M j, Y', strtotime($rel['published_at'])) 
        : '';
}

jsonResponse(true, 'Blog retrieved successfully.', [
    'blog'          => $blog,
    'related_blogs' => $relatedBlogs,
]);
