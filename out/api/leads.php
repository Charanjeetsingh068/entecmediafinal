<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

// GET: Fetch Leads / Inquiries (Admin only)
if ($method === 'GET') {
    require_admin_auth();
    $status = isset($_GET['status']) ? trim($_GET['status']) : null;
    $where = $status ? "WHERE status = :status" : "";
    
    $stmt = $db->prepare("SELECT * FROM leads {$where} ORDER BY created_at DESC");
    if ($status) $stmt->bindValue(':status', $status);
    $stmt->execute();
    
    send_json_response(['success' => true, 'data' => $stmt->fetchAll()]);
}

// POST: Submit new Lead (Public Contact Form)
if ($method === 'POST') {
    $data = get_json_input();
    
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $message = trim($data['message'] ?? '');
    
    if (empty($name) || empty($email) || empty($message)) {
        send_json_response(['error' => 'Name, Email and Message are required.'], 400);
    }
    
    $stmt = $db->prepare("INSERT INTO leads (name, email, phone, service_needed, budget, message, status) 
                          VALUES (:name, :email, :phone, :service, :budget, :message, 'new')");
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $data['phone'] ?? '',
        ':service' => $data['service_needed'] ?? '',
        ':budget'  => $data['budget'] ?? '',
        ':message' => $message
    ]);
    
    send_json_response(['success' => true, 'message' => 'Thank you! Your message has been received. Our team will contact you soon.']);
}

// PUT: Update Lead Status (Admin only)
if ($method === 'PUT') {
    require_admin_auth();
    $data = get_json_input();
    $id = (int)($data['id'] ?? 0);
    $status = $data['status'] ?? 'in_progress';
    
    if (!$id) send_json_response(['error' => 'Lead ID is required'], 400);
    
    $db->prepare("UPDATE leads SET status = ? WHERE id = ?")->execute([$status, $id]);
    send_json_response(['success' => true, 'message' => 'Lead status updated successfully']);
}

// DELETE: Delete Lead (Admin only)
if ($method === 'DELETE') {
    require_admin_auth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) send_json_response(['error' => 'Lead ID is required'], 400);
    
    $db->prepare("DELETE FROM leads WHERE id = ?")->execute([$id]);
    send_json_response(['success' => true, 'message' => 'Lead deleted successfully']);
}

send_json_response(['error' => 'Method not allowed'], 405);
