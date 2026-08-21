<?php
/**
 * Admin API: List Tags
 * GET /api/admin/tags/list.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../includes/auth.php';

$admin = requireAdminAuth(true);
$pdo = getDBConnection();

$stmt = $pdo->query("SELECT t.id, t.name, t.slug, COUNT(bt.blog_id) as total_blogs FROM tags t LEFT JOIN blog_tags bt ON t.id = bt.tag_id GROUP BY t.id ORDER BY t.name ASC");
$tags = $stmt->fetchAll();

jsonResponse(true, 'Tags retrieved.', ['tags' => $tags]);
