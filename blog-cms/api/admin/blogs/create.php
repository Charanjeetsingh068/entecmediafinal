<?php
/**
 * Admin API: Create Blog (Draft or Published)
 * POST /api/admin/blogs/create.php
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

$title = trim((string)($input['title'] ?? ''));
$customSlug = trim((string)($input['slug'] ?? ''));
$categoryId = !empty($input['category_id']) ? (int)$input['category_id'] : null;
$excerpt = trim((string)($input['excerpt'] ?? ''));
$contentRaw = (string)($input['content'] ?? '');
$featuredImage = trim((string)($input['featured_image'] ?? ''));
$featuredImageAlt = trim((string)($input['featured_image_alt'] ?? ''));
$authorName = trim((string)($input['author_name'] ?? '')) ?: $admin['name'];
$status = in_array(($input['status'] ?? ''), ['draft', 'published'], true) ? $input['status'] : 'draft';
$metaTitle = trim((string)($input['meta_title'] ?? ''));
$metaDescription = trim((string)($input['meta_description'] ?? ''));
$canonicalUrl = trim((string)($input['canonical_url'] ?? ''));
$tagIds = is_array($input['tag_ids'] ?? null) ? array_map('intval', $input['tag_ids']) : [];

if ($title === '') {
    jsonResponse(false, 'Blog title is required.', null, 400);
}

if ($contentRaw === '') {
    jsonResponse(false, 'Blog content cannot be empty.', null, 400);
}

$pdo = getDBConnection();

// Validate category exists if provided
if ($categoryId !== null) {
    $catCheck = $pdo->prepare("SELECT id FROM categories WHERE id = :id LIMIT 1");
    $catCheck->execute([':id' => $categoryId]);
    if (!$catCheck->fetch()) {
        jsonResponse(false, 'Invalid category selected.', null, 400);
    }
}

// Generate or validate unique slug
$slugBase = $customSlug !== '' ? $customSlug : $title;
$slug = makeUniqueSlug($pdo, 'blogs', $slugBase);

// Sanitize HTML content to prevent XSS
$sanitizedContent = sanitizeHTML($contentRaw);

$publishedAt = null;
if ($status === 'published') {
    $publishedAt = !empty($input['published_at']) ? date('Y-m-d H:i:s', strtotime($input['published_at'])) : date('Y-m-d H:i:s');
}

$sql = "INSERT INTO blogs (
            category_id, title, slug, excerpt, content, 
            featured_image, featured_image_alt, author_name, status, 
            meta_title, meta_description, canonical_url, published_at
        ) VALUES (
            :category_id, :title, :slug, :excerpt, :content, 
            :featured_image, :featured_image_alt, :author_name, :status, 
            :meta_title, :meta_description, :canonical_url, :published_at
        )";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':category_id'        => $categoryId,
    ':title'              => $title,
    ':slug'               => $slug,
    ':excerpt'            => $excerpt !== '' ? $excerpt : mb_substr(strip_tags($sanitizedContent), 0, 160),
    ':content'            => $sanitizedContent,
    ':featured_image'     => $featuredImage,
    ':featured_image_alt' => $featuredImageAlt !== '' ? $featuredImageAlt : $title,
    ':author_name'        => $authorName,
    ':status'             => $status,
    ':meta_title'         => $metaTitle !== '' ? $metaTitle : $title,
    ':meta_description'   => $metaDescription !== '' ? $metaDescription : $excerpt,
    ':canonical_url'      => $canonicalUrl,
    ':published_at'       => $publishedAt,
]);

$blogId = (int)$pdo->lastInsertId();

// Sync Tags
if (!empty($tagIds)) {
    $tagInsert = $pdo->prepare("INSERT IGNORE INTO blog_tags (blog_id, tag_id) VALUES (:blog_id, :tag_id)");
    foreach ($tagIds as $tid) {
        if ($tid > 0) {
            $tagInsert->execute([':blog_id' => $blogId, ':tag_id' => $tid]);
        }
    }
}

jsonResponse(true, "Blog post successfully created as {$status}.", [
    'blog_id' => $blogId,
    'slug'    => $slug,
    'status'  => $status,
]);
