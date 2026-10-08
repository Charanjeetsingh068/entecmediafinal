<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

// GET Services
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;

    if ($id || $slug) {
        $query = "SELECT * FROM services WHERE " . ($id ? "id = :val" : "slug = :val");
        $stmt = $db->prepare($query);
        $stmt->execute([':val' => $id ?: $slug]);
        $service = $stmt->fetch();

        if (!$service) {
            send_json_response(['error' => 'Service not found'], 404);
        }
        $service['deliverables'] = !empty($service['deliverables']) ? json_decode($service['deliverables'], true) : [];
        send_json_response(['success' => true, 'data' => $service]);
    }

    $where = !isset($_GET['admin']) ? "WHERE status = 'active'" : "";
    $stmt = $db->query("SELECT * FROM services {$where} ORDER BY display_order ASC, id ASC");
    $services = $stmt->fetchAll();

    foreach ($services as &$item) {
        $item['deliverables'] = !empty($item['deliverables']) ? json_decode($item['deliverables'], true) : [];
    }

    send_json_response(['success' => true, 'data' => $services]);
}

// POST Service
if ($method === 'POST') {
    require_admin_auth();
    $data = get_json_input();

    $title = trim($data['title'] ?? '');
    if (empty($title)) {
        send_json_response(['error' => 'Service title is required'], 400);
    }

    $slug = !empty($data['slug']) ? create_slug($data['slug']) : create_slug($title);
    $deliverables_json = isset($data['deliverables']) && is_array($data['deliverables']) ? json_encode($data['deliverables']) : '[]';

    $stmt = $db->prepare("INSERT INTO services (title, slug, icon, short_desc, full_desc, deliverables, display_order, status) 
                          VALUES (:title, :slug, :icon, :short_desc, :full_desc, :deliverables, :display_order, :status)");
    $stmt->execute([
        ':title'        => $title,
        ':slug'         => $slug,
        ':icon'         => $data['icon'] ?? '',
        ':short_desc'   => $data['short_desc'] ?? '',
        ':full_desc'    => $data['full_desc'] ?? '',
        ':deliverables' => $deliverables_json,
        ':display_order'=> (int)($data['display_order'] ?? 0),
        ':status'       => $data['status'] ?? 'active'
    ]);

    send_json_response(['success' => true, 'message' => 'Service created successfully', 'id' => $db->lastInsertId()], 201);
}

// PUT Service
if ($method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);

    if (!$id) {
        send_json_response(['error' => 'Service ID is required'], 400);
    }

    $deliverables_json = isset($data['deliverables']) && is_array($data['deliverables']) ? json_encode($data['deliverables']) : ($data['deliverables'] ?? '[]');

    $stmt = $db->prepare("UPDATE services SET title = :title, slug = :slug, icon = :icon, short_desc = :short_desc, 
                          full_desc = :full_desc, deliverables = :deliverables, display_order = :display_order, status = :status WHERE id = :id");
    $stmt->execute([
        ':id'           => $id,
        ':title'        => $data['title'] ?? '',
        ':slug'         => create_slug($data['slug'] ?? $data['title']),
        ':icon'         => $data['icon'] ?? '',
        ':short_desc'   => $data['short_desc'] ?? '',
        ':full_desc'    => $data['full_desc'] ?? '',
        ':deliverables' => $deliverables_json,
        ':display_order'=> (int)($data['display_order'] ?? 0),
        ':status'       => $data['status'] ?? 'active'
    ]);

    send_json_response(['success' => true, 'message' => 'Service updated successfully']);
}

// DELETE Service
if ($method === 'DELETE') {
    require_admin_auth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) send_json_response(['error' => 'Service ID is required'], 400);

    $db->prepare("DELETE FROM services WHERE id = ?")->execute([$id]);
    send_json_response(['success' => true, 'message' => 'Service deleted successfully']);
}

send_json_response(['error' => 'Method not allowed'], 405);
