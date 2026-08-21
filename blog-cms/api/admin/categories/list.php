<?php
/**
 * Admin API: List Categories
 * GET /api/admin/categories/list.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../includes/auth.php';

$admin = requireAdminAuth(true);
$pdo = getDBConnection();

$sql = "SELECT 
            c.id,
            c.name,
            c.slug,
            c.description,
            c.meta_title,
            c.meta_description,
            c.status,
            c.created_at,
            c.updated_at,
            COUNT(b.id) as total_blogs
        FROM categories c
        LEFT JOIN blogs b ON c.id = b.category_id
        GROUP BY c.id
        ORDER BY c.name ASC";

$stmt = $pdo->query($sql);
$categories = $stmt->fetchAll();

jsonResponse(true, 'Categories retrieved.', ['categories' => $categories]);
