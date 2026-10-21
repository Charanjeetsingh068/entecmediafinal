<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

// GET: Retrieve all site settings
if ($method === 'GET') {
    $stmt = $db->query("SELECT key_name, value_data FROM site_settings");
    $raw = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    $settings = [];
    foreach ($raw as $key => $val) {
        $decoded = json_decode($val, true);
        $settings[$key] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $val;
    }

    send_json_response(['success' => true, 'data' => $settings]);
}

// POST/PUT: Update site settings (Admin only)
if ($method === 'POST' || $method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();

    if (empty($data) || !is_array($data)) {
        send_json_response(['error' => 'No settings payload provided'], 400);
    }

    $stmt = $db->prepare("INSERT INTO site_settings (key_name, value_data) VALUES (:key, :val) 
                          ON DUPLICATE KEY UPDATE value_data = VALUES(value_data)");

    foreach ($data as $key => $val) {
        $val_str = is_array($val) ? json_encode($val, JSON_UNESCAPED_UNICODE) : (string)$val;
        $stmt->execute([':key' => $key, ':val' => $val_str]);
    }

    send_json_response(['success' => true, 'message' => 'Site settings saved successfully']);
}

send_json_response(['error' => 'Method not allowed'], 405);
