<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$db = get_db_connection();

if ($method === 'POST') {
    $data = get_json_input();
    
    // Action: Login
    if ($action === 'login' || empty($action)) {
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');
        
        if (empty($email) || empty($password)) {
            send_json_response(['error' => 'Email and Password are required.'], 400);
        }
        
        $stmt = $db->prepare("SELECT id, name, email, password_hash, role FROM admins WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            // Update last login
            $update = $db->prepare("UPDATE admins SET last_login = NOW() WHERE id = :id");
            $update->execute([':id' => $admin['id']]);
            
            unset($admin['password_hash']);
            
            // Set session and token
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $admin;
            $token = generate_auth_token($admin);
            
            send_json_response([
                'success' => true,
                'message' => 'Login successful',
                'token'   => $token,
                'user'    => $admin
            ]);
        } else {
            send_json_response(['error' => 'Invalid email or password.'], 401);
        }
    }
    
    // Action: Change Password (Requires Auth)
    if ($action === 'change_password') {
        $current_admin = require_admin_auth();
        $old_pass = $data['old_password'] ?? '';
        $new_pass = $data['new_password'] ?? '';
        
        if (strlen($new_pass) < 6) {
            send_json_response(['error' => 'New password must be at least 6 characters long.'], 400);
        }
        
        $stmt = $db->prepare("SELECT password_hash FROM admins WHERE id = :id");
        $stmt->execute([':id' => $current_admin['id']]);
        $row = $stmt->fetch();
        
        if ($row && password_verify($old_pass, $row['password_hash'])) {
            $new_hash = password_hash($new_pass, PASSWORD_BCRYPT);
            $update = $db->prepare("UPDATE admins SET password_hash = :hash WHERE id = :id");
            $update->execute([':hash' => $new_hash, ':id' => $current_admin['id']]);
            
            send_json_response(['success' => true, 'message' => 'Password updated successfully.']);
        } else {
            send_json_response(['error' => 'Current password is incorrect.'], 400);
        }
    }
    
    // Action: Logout
    if ($action === 'logout') {
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
        }
        session_destroy();
        send_json_response(['success' => true, 'message' => 'Logged out successfully.']);
    }
} elseif ($method === 'GET') {
    // Action: Check current auth status
    $admin = require_admin_auth();
    send_json_response(['authenticated' => true, 'user' => $admin]);
} else {
    send_json_response(['error' => 'Method not allowed'], 405);
}
