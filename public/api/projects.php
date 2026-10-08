<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

// GET: Fetch Projects / Case Studies
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;
    $category = isset($_GET['category']) ? trim($_GET['category']) : null;
    $featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;

    if ($id || $slug) {
        $query = "SELECT * FROM projects WHERE " . ($id ? "id = :val" : "slug = :val");
        $stmt = $db->prepare($query);
        $stmt->execute([':val' => $id ?: $slug]);
        $project = $stmt->fetch();

        if (!$project) {
            send_json_response(['error' => 'Project not found'], 404);
        }

        // Decode JSON gallery if exists
        $project['gallery'] = !empty($project['gallery']) ? json_decode($project['gallery'], true) : [];
        send_json_response(['success' => true, 'data' => $project]);
    }

    $where = [];
    $params = [];

    if (!isset($_GET['admin'])) {
        $where[] = "status = 'published'";
    }

    if ($category) {
        $where[] = "category = :category";
        $params[':category'] = $category;
    }

    if ($featured !== null) {
        $where[] = "featured = :featured";
        $params[':featured'] = $featured;
    }

    $where_sql = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";

    $stmt = $db->prepare("SELECT id, title, slug, client, category, thumbnail, short_desc, services_used, live_url, featured, display_order, status, created_at 
                          FROM projects {$where_sql} 
                          ORDER BY display_order ASC, created_at DESC");
    $stmt->execute($params);
    $projects = $stmt->fetchAll();

    send_json_response(['success' => true, 'data' => $projects]);
}

// POST: Create Project (Admin only)
if ($method === 'POST') {
    require_admin_auth();
    $data = get_json_input();

    $title = trim($data['title'] ?? '');
    if (empty($title)) {
        send_json_response(['error' => 'Project title is required'], 400);
    }

    $slug = !empty($data['slug']) ? create_slug($data['slug']) : create_slug($title);
    $gallery_json = isset($data['gallery']) && is_array($data['gallery']) ? json_encode($data['gallery']) : '[]';

    $stmt = $db->prepare("INSERT INTO projects 
        (title, slug, client, category, thumbnail, gallery, short_desc, overview, challenge, solution, results, services_used, live_url, featured, display_order, status) 
        VALUES 
        (:title, :slug, :client, :category, :thumbnail, :gallery, :short_desc, :overview, :challenge, :solution, :results, :services_used, :live_url, :featured, :display_order, :status)");

    $stmt->execute([
        ':title'         => $title,
        ':slug'          => $slug,
        ':client'        => $data['client'] ?? '',
        ':category'      => $data['category'] ?? 'Web Development',
        ':thumbnail'     => $data['thumbnail'] ?? '',
        ':gallery'       => $gallery_json,
        ':short_desc'    => $data['short_desc'] ?? '',
        ':overview'      => $data['overview'] ?? '',
        ':challenge'     => $data['challenge'] ?? '',
        ':solution'      => $data['solution'] ?? '',
        ':results'       => $data['results'] ?? '',
        ':services_used' => $data['services_used'] ?? '',
        ':live_url'      => $data['live_url'] ?? '',
        ':featured'      => !empty($data['featured']) ? 1 : 0,
        ':display_order' => (int)($data['display_order'] ?? 0),
        ':status'        => in_array($data['status'] ?? '', ['published', 'draft']) ? $data['status'] : 'published'
    ]);

    send_json_response(['success' => true, 'message' => 'Project created successfully', 'id' => $db->lastInsertId()], 201);
}

// PUT: Update Project (Admin only)
if ($method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);

    if (!$id) {
        send_json_response(['error' => 'Project ID is required'], 400);
    }

    $gallery_json = isset($data['gallery']) && is_array($data['gallery']) ? json_encode($data['gallery']) : ($data['gallery'] ?? '[]');

    $stmt = $db->prepare("UPDATE projects SET 
        title = :title, 
        slug = :slug, 
        client = :client, 
        category = :category, 
        thumbnail = :thumbnail, 
        gallery = :gallery, 
        short_desc = :short_desc, 
        overview = :overview, 
        challenge = :challenge, 
        solution = :solution, 
        results = :results, 
        services_used = :services_used, 
        live_url = :live_url, 
        featured = :featured, 
        display_order = :display_order, 
        status = :status 
        WHERE id = :id");

    $stmt->execute([
        ':id'            => $id,
        ':title'         => $data['title'] ?? '',
        ':slug'          => create_slug($data['slug'] ?? $data['title']),
        ':client'        => $data['client'] ?? '',
        ':category'      => $data['category'] ?? 'Web Development',
        ':thumbnail'     => $data['thumbnail'] ?? '',
        ':gallery'       => $gallery_json,
        ':short_desc'    => $data['short_desc'] ?? '',
        ':overview'      => $data['overview'] ?? '',
        ':challenge'     => $data['challenge'] ?? '',
        ':solution'      => $data['solution'] ?? '',
        ':results'       => $data['results'] ?? '',
        ':services_used' => $data['services_used'] ?? '',
        ':live_url'      => $data['live_url'] ?? '',
        ':featured'      => !empty($data['featured']) ? 1 : 0,
        ':display_order' => (int)($data['display_order'] ?? 0),
        ':status'        => in_array($data['status'] ?? '', ['published', 'draft']) ? $data['status'] : 'published'
    ]);

    send_json_response(['success' => true, 'message' => 'Project updated successfully']);
}

// DELETE: Delete Project (Admin only)
if ($method === 'DELETE') {
    require_admin_auth();
    $id = (int)($_GET['id'] ?? 0);

    if (!$id) {
        send_json_response(['error' => 'Project ID is required'], 400);
    }

    $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->execute([$id]);

    send_json_response(['success' => true, 'message' => 'Project deleted successfully']);
}

send_json_response(['error' => 'Method not allowed'], 405);
