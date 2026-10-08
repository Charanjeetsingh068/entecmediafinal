<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

// GET: Fetch blogs (Public / Admin)
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;
    $status = isset($_GET['status']) ? trim($_GET['status']) : null;
    $category = isset($_GET['category']) ? trim($_GET['category']) : null;
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 20;
    $page = isset($_GET['page']) ? max((int)$_GET['page'], 1) : 1;
    $offset = ($page - 1) * $limit;

    // Single blog by ID or Slug
    if ($id || $slug) {
        $query = "SELECT * FROM blogs WHERE " . ($id ? "id = :val" : "slug = :val");
        $stmt = $db->prepare($query);
        $stmt->execute([':val' => $id ?: $slug]);
        $blog = $stmt->fetch();

        if (!$blog) {
            send_json_response(['error' => 'Blog post not found'], 404);
        }

        // Increment view count if public
        if (!isset($_GET['admin'])) {
            $db->prepare("UPDATE blogs SET views = views + 1 WHERE id = ?")->execute([$blog['id']]);
        }

        send_json_response(['success' => true, 'data' => $blog]);
    }

    // List Blogs with Filters
    $where = [];
    $params = [];

    if ($status) {
        $where[] = "status = :status";
        $params[':status'] = $status;
    } elseif (!isset($_GET['admin'])) {
        $where[] = "status = 'published'";
    }

    if ($category) {
        $where[] = "category = :category";
        $params[':category'] = $category;
    }

    if (!empty($_GET['search'])) {
        $where[] = "(title LIKE :search OR excerpt LIKE :search OR content LIKE :search)";
        $params[':search'] = '%' . trim($_GET['search']) . '%';
    }

    $where_sql = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";

    // Count total
    $count_stmt = $db->prepare("SELECT COUNT(*) as total FROM blogs {$where_sql}");
    $count_stmt->execute($params);
    $total = (int)$count_stmt->fetch()['total'];

    // Fetch records
    $sql = "SELECT id, title, slug, excerpt, cover_image, category, author, read_time, status, views, created_at, updated_at 
            FROM blogs {$where_sql} 
            ORDER BY created_at DESC 
            LIMIT {$limit} OFFSET {$offset}";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $blogs = $stmt->fetchAll();

    send_json_response([
        'success' => true,
        'data' => $blogs,
        'pagination' => [
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ]
    ]);
}

// POST: Create New Blog (Admin only)
if ($method === 'POST') {
    require_admin_auth();
    $data = get_json_input();

    $title = trim($data['title'] ?? '');
    if (empty($title)) {
        send_json_response(['error' => 'Title is required'], 400);
    }

    $slug = !empty($data['slug']) ? create_slug($data['slug']) : create_slug($title);
    
    // Ensure slug uniqueness
    $slug_check = $db->prepare("SELECT COUNT(*) FROM blogs WHERE slug = ?");
    $slug_check->execute([$slug]);
    if ($slug_check->fetchColumn() > 0) {
        $slug .= '-' . time();
    }

    $stmt = $db->prepare("INSERT INTO blogs 
        (title, slug, excerpt, content, cover_image, category, author, read_time, meta_title, meta_description, keywords, status) 
        VALUES 
        (:title, :slug, :excerpt, :content, :cover_image, :category, :author, :read_time, :meta_title, :meta_description, :keywords, :status)");

    $stmt->execute([
        ':title'            => $title,
        ':slug'             => $slug,
        ':excerpt'          => $data['excerpt'] ?? '',
        ':content'          => $data['content'] ?? '',
        ':cover_image'      => $data['cover_image'] ?? '',
        ':category'         => $data['category'] ?? 'General',
        ':author'           => $data['author'] ?? 'Entec Media Team',
        ':read_time'        => $data['read_time'] ?? '5 min read',
        ':meta_title'       => $data['meta_title'] ?? $title,
        ':meta_description' => $data['meta_description'] ?? ($data['excerpt'] ?? ''),
        ':keywords'         => $data['keywords'] ?? '',
        ':status'           => in_array($data['status'] ?? '', ['published', 'draft']) ? $data['status'] : 'published'
    ]);

    $new_id = $db->lastInsertId();
    send_json_response(['success' => true, 'message' => 'Blog post created successfully', 'id' => $new_id, 'slug' => $slug], 201);
}

// PUT: Update Existing Blog (Admin only)
if ($method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);

    if (!$id) {
        send_json_response(['error' => 'Blog ID is required'], 400);
    }

    $title = trim($data['title'] ?? '');
    if (empty($title)) {
        send_json_response(['error' => 'Title is required'], 400);
    }

    $slug = !empty($data['slug']) ? create_slug($data['slug']) : create_slug($title);
    
    // Ensure slug uniqueness for other posts
    $slug_check = $db->prepare("SELECT COUNT(*) FROM blogs WHERE slug = ? AND id != ?");
    $slug_check->execute([$slug, $id]);
    if ($slug_check->fetchColumn() > 0) {
        $slug .= '-' . time();
    }

    $stmt = $db->prepare("UPDATE blogs SET 
        title = :title, 
        slug = :slug, 
        excerpt = :excerpt, 
        content = :content, 
        cover_image = :cover_image, 
        category = :category, 
        author = :author, 
        read_time = :read_time, 
        meta_title = :meta_title, 
        meta_description = :meta_description, 
        keywords = :keywords, 
        status = :status 
        WHERE id = :id");

    $stmt->execute([
        ':id'               => $id,
        ':title'            => $title,
        ':slug'             => $slug,
        ':excerpt'          => $data['excerpt'] ?? '',
        ':content'          => $data['content'] ?? '',
        ':cover_image'      => $data['cover_image'] ?? '',
        ':category'         => $data['category'] ?? 'General',
        ':author'           => $data['author'] ?? 'Entec Media Team',
        ':read_time'        => $data['read_time'] ?? '5 min read',
        ':meta_title'       => $data['meta_title'] ?? $title,
        ':meta_description' => $data['meta_description'] ?? ($data['excerpt'] ?? ''),
        ':keywords'         => $data['keywords'] ?? '',
        ':status'           => in_array($data['status'] ?? '', ['published', 'draft']) ? $data['status'] : 'published'
    ]);

    send_json_response(['success' => true, 'message' => 'Blog post updated successfully']);
}

// DELETE: Delete Blog (Admin only)
if ($method === 'DELETE') {
    require_admin_auth();
    $id = (int)($_GET['id'] ?? 0);

    if (!$id) {
        send_json_response(['error' => 'Blog ID is required'], 400);
    }

    $stmt = $db->prepare("DELETE FROM blogs WHERE id = ?");
    $stmt->execute([$id]);

    send_json_response(['success' => true, 'message' => 'Blog post deleted successfully']);
}

send_json_response(['error' => 'Method not allowed'], 405);
