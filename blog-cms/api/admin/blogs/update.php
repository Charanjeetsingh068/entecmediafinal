<?php
/**
 * Admin API: Update Existing Blog
 * POST /api/admin/blogs/update.php
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
    jsonResponse(false, 'Valid blog ID is required for update.', null, 400);
}

$pdo = getDBConnection();

$checkStmt = $pdo->prepare("SELECT id, status, published_at FROM blogs WHERE id = :id LIMIT 1");
$checkStmt->execute([':id' => $id]);
$existingBlog = $checkStmt->fetch();

if (!$existingBlog) {
    jsonResponse(false, 'Blog post not found.', null, 404);
}

$title = trim((string)($input['title'] ?? ''));
$customSlug = trim((string)($input['slug'] ?? ''));
$categoryId = !empty($input['category_id']) ? (int)$input['category_id'] : null;
$excerpt = trim((string)($input['excerpt'] ?? ''));
$contentRaw = (string)($input['content'] ?? '');
$featuredImage = trim((string)($input['featured_image'] ?? ''));
$featuredImageAlt = trim((string)($input['featured_image_alt'] ?? ''));
$authorName = trim((string)($input['author_name'] ?? '')) ?: $admin['name'];
$status = in_array(($input['status'] ?? ''), ['draft', 'published'], true) ? $input['status'] : $existingBlog['status'];
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

// Generate unique slug excluding current blog ID
$slugBase = $customSlug !== '' ? $customSlug : $title;
$slug = makeUniqueSlug($pdo, 'blogs', $slugBase, $id);

$sanitizedContent = sanitizeHTML($contentRaw);

// Manage Published Date
$publishedAt = $existingBlog['published_at'];
if ($status === 'published' && (empty($publishedAt) || $existingBlog['status'] === 'draft')) {
    $publishedAt = !empty($input['published_at']) ? date('Y-m-d H:i:s', strtotime($input['published_at'])) : date('Y-m-d H:i:s');
}

$sql = "UPDATE blogs SET 
            category_id = :category_id,
            title = :title,
            slug = :slug,
            excerpt = :excerpt,
            content = :content,
            featured_image = :featured_image,
            featured_image_alt = :featured_image_alt,
            author_name = :author_name,
            status = :status,
            meta_title = :meta_title,
            meta_description = :meta_description,
            canonical_url = :canonical_url,
            published_at = :published_at
        WHERE id = :id";

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
    ':id'                 => $id,
]);

// Sync Tags: Delete old links and re-insert
$delTags = $pdo->prepare("DELETE FROM blog_tags WHERE blog_id = :id");
$delTags->execute([':id' => $id]);

if (!empty($tagIds)) {
    $tagInsert = $pdo->prepare("INSERT IGNORE INTO blog_tags (blog_id, tag_id) VALUES (:blog_id, :tag_id)");
    foreach ($tagIds as $tid) {
        if ($tid > 0) {
            $tagInsert->execute([':blog_id' => $id, ':tag_id' => $tid]);
        }
    }
}

jsonResponse(true, 'Blog post updated successfully.', [
    'blog_id' => $id,
    'slug'    => $slug,
    'status'  => $status,
]);
